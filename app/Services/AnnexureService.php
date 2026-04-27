<?php

namespace App\Services;

use App\Models\AnnexureRequest;
use App\Models\AnnexureData;
use App\Models\AnnexureVersion;
use App\Models\AnnexureAuditLog;
use App\Models\AnnexureTemplate;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AnnexureService
{
    /**
     * Create a new annexure request
     */
    public function createRequest($templateId, $userId, $data = [])
    {
        $template = AnnexureTemplate::findOrFail($templateId);

        $request = AnnexureRequest::create([
            'user_id' => $userId,
            'annexure_template_id' => $templateId,
            'reference_number' => $this->generateReferenceNumber(),
            'title' => $data['title'] ?? $template->name,
            'notes' => $data['notes'] ?? null,
            'status' => 'draft',
            'revision_count' => 0,
        ]);

        // Record audit log
        AnnexureAuditLog::record(
            $request->id,
            'created',
            "Request created for template: {$template->name}",
            $userId,
            [
                'new_values' => $request->toArray(),
            ]
        );

        return $request;
    }

    /**
     * Save draft data
     */
    public function saveDraft($requestId, $formData, $userId)
    {
        $request = AnnexureRequest::findOrFail($requestId);

        // Validate data
        $validation = $request->template->validateFormData($formData);

        // Create new data entry
        $latestData = $request->getLatestData();
        $version = ($latestData ? $latestData->version : 0) + 1;
        $changedBy = User::find($userId)?->name ?? (string) $userId;

        $data = AnnexureData::create([
            'annexure_request_id' => $requestId,
            'form_data' => $formData,
            'version' => $version,
            'changed_by' => $changedBy,
            'change_notes' => $validation['valid']
                ? $this->generateChangeSummary($latestData, $formData)
                : 'Validation errors: ' . implode('; ', array_values($validation['errors'] ?? [])),
        ]);

        // Record audit
        AnnexureAuditLog::record(
            $requestId,
            'draft_saved',
            "Draft saved - Version {$version}",
            $userId,
            [
                'new_state' => $data->form_data,
            ]
        );

        return $data;
    }

    /**
     * Submit request for review
     */
    public function submitForReview($requestId, $userId)
    {
        $request = AnnexureRequest::findOrFail($requestId);

        if (!$request->canSubmit()) {
            throw new \Exception("Request cannot be submitted from {$request->status} status");
        }

        $latestData = $request->getLatestData();

        if (!$latestData) {
            throw new \Exception('Form data is invalid. Please correct errors before submitting.');
        }

        $formData = is_array($latestData->form_data)
            ? $latestData->form_data
            : (json_decode((string) $latestData->form_data, true) ?: []);

        $validation = $request->template->validateFormData($formData);

        if (!$validation['valid']) {
            throw new \Exception('Form data is invalid. Please correct errors before submitting.');
        }

        // Generate version record (PDF generation can be integrated later)
        $version = $this->generatePdf(
            $request,
            $latestData,
            'faculty_draft',
            $userId
        );

        // Update request status
        $request->update([
            'status' => 'submitted',
            'submitted_at' => now(),
            'current_version_id' => $version->id,
        ]);

        // Record audit
        AnnexureAuditLog::record(
            $request->id,
            'submitted',
            'Request submitted for review',
            $userId,
            [
                'previous_state' => ['status' => 'draft'],
                'new_state' => ['status' => 'submitted'],
            ]
        );

        return $request;
    }

    /**
     * Admin assigns request to themselves
     */
    public function assignToAdmin($requestId, $adminId)
    {
        $request = AnnexureRequest::findOrFail($requestId);

        $request->update([
            'assigned_to' => $adminId,
            'status' => 'under_review',
            'reviewed_at' => now(),
        ]);

        AnnexureAuditLog::record(
            $requestId,
            'assigned',
            "Assigned to admin for review",
            $adminId,
            [
                'new_values' => ['assigned_to' => $adminId],
            ]
        );

        return $request;
    }

    /**
     * Admin edits request data
     */
    public function adminEdit($requestId, $formData, $adminId)
    {
        $request = AnnexureRequest::findOrFail($requestId);

        if (!$request->canReview()) {
            throw new \Exception("Cannot edit request in {$request->status} status");
        }

        // Validate data
        $validation = $request->template->validateFormData($formData);

        // Create admin edit data entry
        $latestData = $request->getLatestData();
        $version = ($latestData ? $latestData->version : 0) + 1;
        $changedBy = User::find($adminId)?->name ?? (string) $adminId;

        $data = AnnexureData::create([
            'annexure_request_id' => $requestId,
            'form_data' => $formData,
            'version' => $version,
            'changed_by' => $changedBy,
            'change_notes' => $validation['valid']
                ? $this->generateChangeSummary($latestData, $formData)
                : 'Validation errors: ' . implode('; ', array_values($validation['errors'] ?? [])),
        ]);

        // Generate new PDF
        $pdfVersion = $this->generatePdf(
            $request,
            $data,
            'admin_draft',
            $adminId
        );

        $request->update(['current_version_id' => $pdfVersion->id]);

        // Record audit
        AnnexureAuditLog::record(
            $requestId,
            'admin_edited',
            "Admin edited form data - Version {$version}",
            $adminId,
            [
                'previous_state' => $latestData ? $latestData->form_data : [],
                'new_state' => $data->form_data,
            ]
        );

        return $data;
    }

    /**
     * Request revision from faculty
     */
    public function requestRevision($requestId, $reason, $adminId)
    {
        $request = AnnexureRequest::findOrFail($requestId);

        $request->update([
            'status' => 'revision_requested',
            'revision_reason' => $reason,
            'revision_count' => $request->revision_count + 1,
        ]);

        AnnexureAuditLog::record(
            $requestId,
            'revision_requested',
            "Revision requested: {$reason}",
            $adminId,
            [
                'previous_state' => ['status' => 'under_review'],
                'new_state' => ['status' => 'pending_revision'],
            ]
        );

        return $request;
    }

    /**
     * Approve request
     */
    public function approve($requestId, $comments, $adminId)
    {
        $request = AnnexureRequest::findOrFail($requestId);

        if (!$request->canApprove()) {
            throw new \Exception("Cannot approve request in {$request->status} status");
        }

        // Generate approved version
        $latestData = $request->getLatestData();
        $version = $this->generatePdf(
            $request,
            $latestData,
            'approved',
            $adminId
        );

        $request->update([
            'status' => 'approved',
            'approved_at' => now(),
            'admin_comments' => $comments,
            'current_version_id' => $version->id,
        ]);

        AnnexureAuditLog::record(
            $requestId,
            'approved',
            "Request approved by admin. {$comments}",
            $adminId,
            [
                'previous_state' => ['status' => 'under_review'],
                'new_state' => ['status' => 'approved'],
            ]
        );

        return $request;
    }

    /**
     * Sign and finalize document
     */
    public function sign($requestId, $signature, $adminId, $notes = null)
    {
        $request = AnnexureRequest::findOrFail($requestId);

        if (!$request->canSign()) {
            throw new \Exception("Cannot sign request in {$request->status} status");
        }

        // Generate final signed version
        $latestData = $request->getLatestData();
        $version = $this->generatePdf(
            $request,
            $latestData,
            'final_signed',
            $adminId
        );

        // Sign the version
        $version->sign($signature, $adminId, $notes);
        $version->update(['status' => 'signed']);

        $request->update([
            'status' => 'signed',
            'signed_at' => now(),
            'current_version_id' => $version->id,
        ]);

        AnnexureAuditLog::record(
            $requestId,
            'signed',
            "Document digitally signed",
            $adminId,
            [
                'previous_state' => ['status' => 'approved'],
                'new_state' => ['status' => 'signed'],
            ]
        );

        return $request;
    }

    /**
     * Reject request
     */
    public function reject($requestId, $reason, $adminId)
    {
        $request = AnnexureRequest::findOrFail($requestId);

        $request->update([
            'status' => 'rejected',
        ]);

        AnnexureAuditLog::record(
            $requestId,
            'rejected',
            "Request rejected: {$reason}",
            $adminId,
            [
                'previous_state' => ['status' => $request->getOriginal('status')],
                'new_state' => ['status' => 'rejected'],
            ]
        );

        return $request;
    }

    /**
     * Generate PDF for a version
     */
    public function generatePdf($request, $data, $versionType, $userId)
    {
        try {
            $latestVersion = $request->versions()->orderByDesc('version_number')->first();
            $versionNumber = ($latestVersion ? $latestVersion->version_number : 0) + 1;

            $version = AnnexureVersion::create([
                'annexure_request_id' => $request->id,
                'version_number' => $versionNumber,
                'file_path' => null,
                'file_name' => null,
                'file_size' => null,
                'status' => in_array($versionType, ['signed', 'final_signed']) ? 'signed' : 'generated',
                'generated_at' => now(),
            ]);

            AnnexureAuditLog::record(
                $request->id,
                'pdf_generated',
                "PDF generated - {$versionType}",
                $userId,
                [
                    'new_state' => [
                        'version_number' => $version->version_number,
                        'status' => $version->status,
                    ],
                ]
            );

            return $version;
        } catch (\Exception $e) {
            Log::error("PDF generation failed for request {$request->id}", [
                'error' => $e->getMessage(),
            ]);

            AnnexureAuditLog::record(
                $request->id,
                'pdf_generation_failed',
                "PDF generation failed: {$e->getMessage()}",
                $userId
            );

            throw $e;
        }
    }

    /**
     * Store PDF file (placeholder)
     */
    private function storePdf($request, $data)
    {
        // TODO: Implement actual PDF storage
        // Create storage/annexures directory if needed
        // Generate PDF from template and form data
        // Store in storage/annexures/{year}/{month}/

        $storagePath = storage_path("annexures/{$request->id}");
        if (!is_dir($storagePath)) {
            mkdir($storagePath, 0755, true);
        }

        $filename = "{$request->reference_number}_{$data->version}.pdf";
        return "{$storagePath}/{$filename}";
    }

    /**
     * Generate unique reference number
     */
    private function generateReferenceNumber()
    {
        return 'ANX-' . date('Y') . '-' . Str::random(8);
    }

    /**
     * Generate change summary
     */
    private function generateChangeSummary($latestData, $newData)
    {
        if (!$latestData) {
            return 'Initial submission';
        }

        $changes = [];
        foreach ($newData as $key => $value) {
            $old = $latestData->form_data[$key] ?? null;
            if ($old !== $value) {
                $changes[] = $key;
            }
        }

        return empty($changes) ? 'No changes' : 'Changed: ' . implode(', ', $changes);
    }
}
