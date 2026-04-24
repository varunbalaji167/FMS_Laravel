<?php

namespace App\Http\Controllers;

use App\Models\AnnexureRequest;
use App\Models\AnnexureTemplate;
use App\Models\AnnexureData;
use App\Services\AnnexureService;
use Illuminate\Http\Request;
use Inertia\Inertia;
class AnnexureController extends Controller
{
    protected $annexureService;

    public function __construct(AnnexureService $annexureService)
    {
        $this->annexureService = $annexureService;
        // Middleware is applied via routes, not here
    }

    /**
     * List faculty annexure requests
     */
    public function index(Request $request)
    {
        $requestsQuery = AnnexureRequest::byUser(auth()->id())
            ->with('template', 'currentVersion')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = trim($request->string('search'));
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('title', 'like', "%{$search}%")
                        ->orWhere('reference_number', 'like', "%{$search}%")
                        ->orWhereHas('template', function ($templateQuery) use ($search) {
                            $templateQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                if ($request->status !== 'all') {
                    $query->where('status', $request->status);
                }
            })
            ->when($request->filled('template'), function ($query) use ($request) {
                $query->where('annexure_template_id', $request->template);
            });

        $requests = $requestsQuery->latest()->paginate(15)->withQueryString();

        return Inertia::render('Faculty/Annexure/Index', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status', 'template']),
            'stats' => [
                'total' => $requestsQuery->count(),
                'draft' => AnnexureRequest::byUser(auth()->id())->byStatus('draft')->count(),
                'submitted' => AnnexureRequest::byUser(auth()->id())->byStatus('submitted')->count(),
                'pending' => AnnexureRequest::byUser(auth()->id())->pendingReview()->count(),
                'signed' => AnnexureRequest::byUser(auth()->id())->byStatus('signed')->count(),
            ],
        ]);
    }

    /**
     * Show available templates
     */
    public function templates()
    {
        $templates = AnnexureTemplate::active()
            ->get();

        return Inertia::render('Faculty/Annexure/Templates', [
            'templates' => $templates,
        ]);
    }

    /**
     * Create new annexure request from template
     */
    public function create()
    {
        $templates = AnnexureTemplate::active()->get();
        $user = auth()->user();
        $faculty = $user->faculty?->load('user');
        $dependents = $user->dependents()->get();

        return Inertia::render('Faculty/Annexure/Create', [
            'templates' => $templates,
            'faculty' => $faculty ? [
                'id' => $faculty->id,
                'name' => $faculty->full_name ?? $user->name,
                'father_name' => $faculty->father_name ?? '',
                'designation' => $faculty->present_designation ?? $faculty->designation_at_joining,
                'department' => $faculty->department,
                'doj' => $faculty->doj,
                'office_address' => $faculty->current_address ?? '',
                'date_of_birth' => $faculty->date_of_birth,
                'passport_number' => $faculty->passport_number ?? '',
                'idn' => $faculty->idn ?? '',
                'ptn' => $faculty->ptn ?? '',
                'email' => $user->email,
                'contact' => $faculty->contact_number ?? '',
            ] : [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'dependents' => $dependents,
        ]);
    }

    /**
     * Store new annexure request
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'template_id' => 'required|exists:annexure_templates,id',
                'data' => 'required|array',
            ]);

            $template = AnnexureTemplate::findOrFail($validated['template_id']);
            
            // Create the annexure request
            $annexureRequest = $this->annexureService->createRequest(
                $validated['template_id'],
                auth()->id(),
                ['title' => $template->name . ' - ' . now()->format('Y-m-d')]
            );

            // Save the form data directly to annexure_data
            AnnexureData::create([
                'annexure_request_id' => $annexureRequest->id,
                'form_data' => $validated['data'],
                'version' => 1,
                'changed_by' => auth()->user()->name,
            ]);

            return redirect()->route('faculty.annexures.show', $annexureRequest->id)
                ->with('success', 'Annexure submitted successfully!');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Edit draft annexure
     */
    public function edit(AnnexureRequest $annexure)
    {
        $this->ensureOwner($annexure);

        if (!$annexure->canEdit()) {
            return back()->with('error', 'This request cannot be edited in its current status');
        }

        $latestData = $annexure->getLatestData();

        return Inertia::render('Faculty/Annexure/Edit', [
            'request' => $annexure->load('template', 'data', 'auditLogs'),
            'formSchema' => $annexure->template->getFormSections(),
            'formData' => $latestData ? $latestData->form_data : [],
            'validationErrors' => $latestData ? $latestData->validation_errors : [],
        ]);
    }

    /**
     * Save draft
     */
    public function update(Request $request, AnnexureRequest $annexure)
    {
        $this->ensureOwner($annexure);

        try {
            $data = $this->annexureService->saveDraft(
                $annexure->id,
                $request->input('form_data'),
                auth()->id()
            );

            return redirect()->back()
                ->with('success', 'Draft saved successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Submit for review
     */
    public function submit(Request $request, AnnexureRequest $annexure)
    {
        $this->ensureOwner($annexure);

        try {
            $updated = $this->annexureService->submitForReview(
                $annexure->id,
                auth()->id()
            );

            return redirect()->route('faculty.annexures.show', $updated)
                ->with('success', 'Annexure submitted for review');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * View submitted annexure
     */
    public function show(AnnexureRequest $annexure)
    {
        $this->ensureOwner($annexure);

        $latestVersion = $annexure->getLatestVersion();

        return Inertia::render('Faculty/Annexure/Show', [
            'annexure' => $annexure->load(
                'template',
                'data',
                'versions',
                'auditLogs',
                'user',
                'assignedAdmin'
            ),
            'latestData' => $annexure->getLatestData(),
            'latestVersion' => $latestVersion,
            'auditTimeline' => $annexure->auditLogs()->get(),
            'allVersions' => $annexure->getAllVersions(),
        ]);
    }

    /**
     * Download PDF version
     */
    public function downloadPdf(AnnexureRequest $annexure)
    {
        $this->ensureOwner($annexure);

        $latestVersion = $annexure->getLatestVersion();

        if (!$latestVersion || !file_exists($latestVersion->pdf_path)) {
            return back()->with('error', 'PDF not available');
        }

        $latestVersion->recordDownload();

        return response()->download($latestVersion->pdf_path, $latestVersion->pdf_filename);
    }

    /**
     * Get audit timeline
     */
    public function getActivityHistory(AnnexureRequest $annexure)
    {
        $this->ensureOwner($annexure);

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
     * Ensure faculty can only access their own annexure requests.
     */
    private function ensureOwner(AnnexureRequest $annexure): void
    {
        if ((int) $annexure->user_id !== (int) auth()->id()) {
            abort(403, 'This action is unauthorized.');
        }
    }
}
