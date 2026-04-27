<?php

namespace App\Http\Controllers;

use App\Models\AnnexureRequest;
use App\Models\AnnexureTemplate;
use App\Services\AnnexureService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminAnnexureController extends Controller
{
    protected $annexureService;

    public function __construct(AnnexureService $annexureService)
    {
        $this->annexureService = $annexureService;
        // Middleware is applied via routes, not here
    }

    /**
     * List pending annexures for review
     */
    public function index(Request $request)
    {
        $query = AnnexureRequest::with('user', 'template', 'currentVersion');

        // Filter by status
        $status = $request->get('status');
        if ($status === 'all') {
            // Show all statuses
        } elseif ($status) {
            // Show specific status
            $query->byStatus($status);
        } else {
            // Default to pending review when no filter applied
            $query->pendingReview();
        }

        // Filter by search
        if ($request->get('search')) {
            $search = $request->get('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $requests = $query->latest('submitted_at')->paginate(15);

        return Inertia::render('Admin/Annexure/Index', [
            'requests' => $requests,
            'filters' => [
                'status' => $status,
                'search' => $request->get('search'),
            ],
        ]);
    }

    /**
     * View annexure details (admin read-only page)
     */
    public function show(AnnexureRequest $annexure)
    {
        $annexure->load('user', 'template', 'versions', 'auditLogs');

        $latestData = $annexure->getLatestData();

        $content = [];
        if ($latestData?->form_data) {
            if (is_array($latestData->form_data)) {
                $content = $latestData->form_data;
            } else {
                $decoded = json_decode((string) $latestData->form_data, true);
                if (is_string($decoded)) {
                    $decoded = json_decode($decoded, true);
                }
                $content = is_array($decoded) ? $decoded : [];
            }
        }

        $activities = $annexure->auditLogs->map(fn ($log) => [
            'id' => $log->id,
            'action' => $log->action,
            'description' => $log->description,
            'user' => ['name' => $log->user?->name],
            'created_at' => $log->created_at,
        ])->values();

        $signatures = $annexure->versions
            ->filter(fn ($version) => !empty($version->signature_data) || !empty($version->signed_at))
            ->map(fn ($version) => [
                'id' => $version->id,
                'signature_type' => $version->signature_type,
                'signature_data' => $version->signature_data,
                'signed_at' => $version->signed_at,
            ])
            ->values();

        return Inertia::render('Admin/Annexure/Show', [
            'annexure' => [
                ...$annexure->toArray(),
                'name' => $annexure->title ?: ($annexure->template?->name ?? 'Annexure'),
                'content' => $content,
                'activities' => $activities,
                'signatures' => $signatures,
            ],
            'isReviewable' => $annexure->canReview(),
            'isSignable' => $annexure->canSign(),
        ]);
    }

    /**
     * My assignments
     */
    public function myAssignments()
    {
        $requests = AnnexureRequest::assignedToAdmin(auth()->id())
            ->with('user', 'template')
            ->latest('reviewed_at')
            ->paginate(15);

        return Inertia::render('Admin/Annexure/MyAssignments', [
            'requests' => $requests,
        ]);
    }

    /**
     * Review annexure request
     */
    public function review(AnnexureRequest $annexure)
    {
        if (!$annexure->canReview()) {
            return back()->with('error', 'Request is not in review status');
        }

        $latestData = $annexure->getLatestData();
        $latestVersion = $annexure->getLatestVersion();

        $content = [];
        if ($latestData?->form_data) {
            if (is_array($latestData->form_data)) {
                $content = $latestData->form_data;
            } else {
                $decoded = json_decode((string) $latestData->form_data, true);
                if (is_string($decoded)) {
                    $decoded = json_decode($decoded, true);
                }
                $content = is_array($decoded) ? $decoded : [];
            }
        }

        return Inertia::render('Admin/Annexure/Review', [
            'annexure' => [
                ...$annexure->load(
                'user',
                'template',
                'data',
                'versions',
                'auditLogs',
                'assignedAdmin'
                )->toArray(),
                'content' => $content,
            ],
            'formSchema' => $annexure->template->getFormFields(),
            'formData' => $content,
            'validationErrors' => [],
            'latestVersion' => $latestVersion,
            'allVersions' => $annexure->getAllVersions(),
            'auditTimeline' => $annexure->auditLogs()->get(),
        ]);
    }

    /**
     * Assign request to self
     */
    public function assign(AnnexureRequest $annexure)
    {
        try {
            $this->annexureService->assignToAdmin(
                $annexure->id,
                auth()->id()
            );

            return redirect()->route('admin.annexures.review', $annexure)
                ->with('success', 'Request assigned to you');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Edit form data as admin
     */
    public function update(Request $request, AnnexureRequest $annexure)
    {
        try {
            $data = $this->annexureService->adminEdit(
                $annexure->id,
                $request->input('form_data'),
                auth()->id()
            );

            return redirect()->back()
                ->with('success', 'Form data updated successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Request revision from faculty
     */
    public function requestRevision(Request $request, AnnexureRequest $annexure)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $this->annexureService->requestRevision(
                $annexure->id,
                $request->input('reason'),
                auth()->id()
            );

            return redirect()->route('admin.annexures.index')
                ->with('success', 'Revision request sent to faculty');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Approve request
     */
    public function approve(Request $request, AnnexureRequest $annexure)
    {
        try {
            $this->annexureService->approve(
                $annexure->id,
                $request->input('comments'),
                auth()->id()
            );

            return redirect()->route('admin.annexures.review', $annexure)
                ->with('success', 'Request approved successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Sign document
     */
    public function sign(Request $request, AnnexureRequest $annexure)
    {
        try {
            $this->annexureService->sign(
                $annexure->id,
                $request->input('signature'),
                auth()->id(),
                $request->input('notes')
            );

            return redirect()->route('admin.annexures.review', $annexure)
                ->with('success', 'Document signed successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Reject request
     */
    public function reject(Request $request, AnnexureRequest $annexure)
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        try {
            $this->annexureService->reject(
                $annexure->id,
                $request->input('reason'),
                auth()->id()
            );

            return redirect()->route('admin.annexures.index')
                ->with('success', 'Request rejected');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Download PDF
     */
    public function downloadPdf(AnnexureRequest $annexure)
    {
        $version = $annexure->getLatestVersion();

        if (!$version || !file_exists($version->pdf_path)) {
            return back()->with('error', 'PDF not available');
        }

        $version->recordDownload();

        return response()->download($version->pdf_path, $version->pdf_filename);
    }

    /**
     * Preview PDF
     */
    public function previewPdf(AnnexureRequest $annexure)
    {
        $version = $annexure->getLatestVersion();

        if (!$version || !file_exists($version->pdf_path)) {
            return back()->with('error', 'PDF not available');
        }

        return response()->file($version->pdf_path);
    }

    /**
     * Get activity history
     */
    public function getActivityHistory(AnnexureRequest $annexure)
    {
        return response()->json([
            'activities' => $annexure->auditLogs()
                ->orderByDesc('created_at')
                ->with('user')
                ->get()
                ->map(fn ($log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'description' => $log->description,
                    'user' => $log->user?->name,
                    'timestamp' => $log->created_at,
                    'changes' => $log->changes,
                ]),
        ]);
    }

    /**
     * Get version history
     */
    public function getVersionHistory(AnnexureRequest $annexure)
    {
        return response()->json([
            'versions' => $annexure->versions()
                ->orderByDesc('created_at')
                ->get()
                ->map(fn ($version) => [
                    'id' => $version->id,
                    'version_number' => $version->version_number,
                    'pdf_filename' => $version->pdf_filename,
                    'status' => $version->status,
                    'created_at' => $version->created_at,
                    'signed_at' => $version->signed_at,
                    'is_current' => $version->is_current,
                ]),
        ]);
    }

    /**
     * Archive request
     */
    public function archive(AnnexureRequest $annexure)
    {
        try {
            $annexure->update(['is_archived' => true]);

            return redirect()->back()
                ->with('success', 'Request archived successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Save digital signature
     */
    public function saveSignature(Request $request, AnnexureRequest $annexure)
    {
        try {
            $this->annexureService->sign(
                $annexure->id,
                $request->input('signature'),
                auth()->id()
            );

            return response()->json(['success' => true, 'message' => 'Signature saved']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 422);
        }
    }
}
