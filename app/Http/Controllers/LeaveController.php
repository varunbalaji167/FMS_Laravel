<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\LeaveBalance;
use App\Models\LeaveLedger;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaveController extends Controller
{
    /**
     * Show the merged leave dashboard and application form
     */
    public function create()
    {
        return $this->index();
    }

    /**
     * Store a new leave application
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'leave_type' => 'required|in:CL,SL,EL,ML,PL,BL,OL',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_full_day' => 'boolean',
            'reason' => 'required|string|min:10',
            'attachment' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120',
            'recommender_id' => 'required|exists:users,id',
            'approver_id' => 'required|exists:users,id',
        ]);

        // Parse dates
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $totalDays = $this->calculateWorkingDays($startDate, $endDate, $validated['is_full_day']);

        // Get or create balance record
        $balance = LeaveBalance::getOrCreate(
            $user->id,
            $validated['leave_type'],
            $startDate->year
        );

        // Check for overlapping leaves
        $leave = new Leave([
            'user_id' => $user->id,
            'leave_type' => $validated['leave_type'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_days' => $totalDays,
        ]);

        if ($leave->hasOverlappingLeaves()) {
            return back()->withErrors([
                'overlapping' => 'You already have an approved or pending leave during this period.',
            ]);
        }

        // Check leave balance using ledger
        if (!$leave->canApply(allowLWP: false)) {
            $currentBalance = $balance->computeFromLedger()->balance;
            return back()->withErrors([
                'leave_balance' => "Insufficient balance. You have {$currentBalance} days available but need {$totalDays} days.",
            ]);
        }

        // Handle file upload
        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('leave_attachments', 'public');
        }

        // Create leave request (no ledger entry yet - only when approved)
        $leave = Leave::create([
            'user_id' => $user->id,
            'leave_type' => $validated['leave_type'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'is_full_day' => $validated['is_full_day'] ?? true,
            'reason' => $validated['reason'],
            'attachment_path' => $attachmentPath,
            'recommender_id' => $validated['recommender_id'],
            'approver_id' => $validated['approver_id'],
            'total_days' => $totalDays,
            'recommender_status' => Leave::STATUS_PENDING,
            'approver_status' => Leave::STATUS_PENDING,
        ]);

        return redirect()->route('faculty.leaves.index')
            ->with('success', 'Leave application submitted successfully. Pending approvals from recommender and approver.');
    }

    /**
     * Show all leave requests for faculty
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        
        $query = Leave::where('user_id', $user->id)
            ->with(['recommender', 'approver']);

        // Filter by status
        if ($request->get('status')) {
            $status = $request->get('status');
            if ($status === 'approved') {
                $query->where('recommender_status', 'approved')
                      ->where('approver_status', 'approved');
            } elseif ($status === 'rejected') {
                $query->where(function($q) {
                    $q->where('recommender_status', 'rejected')
                      ->orWhere('approver_status', 'rejected');
                });
            } elseif ($status === 'pending') {
                $query->where(function($q) {
                    $q->where('recommender_status', 'pending')
                      ->orWhere('approver_status', 'pending');
                });
            }
        }

        // Filter by leave type
        if ($request->get('leave_type')) {
            $query->where('leave_type', $request->get('leave_type'));
        }

        $leaves = $query->latest()->paginate(10);

        $leaveBalances = LeaveBalance::where('user_id', $user->id)
            ->where('year', now()->year)
            ->get();

        // Compute balances from ledger by directly calculating from ledger entries
        $leaveBalances = $leaveBalances->map(function($balance) {
            // Recompute balance from all ledger entries for this user, leave_type, and year
            $computedBalance = LeaveLedger::where('user_id', $balance->user_id)
                ->where('leave_type', $balance->leave_type)
                ->whereYear('created_at', $balance->year)
                ->sum('change');
            
            // Update the balance value (this will be serialized to frontend)
            $balance->balance = (float) $computedBalance;
            return $balance;
        });

        $leaveBalancesKeyed = $leaveBalances->keyBy('leave_type');

        $recommenders = User::where('role', 'hod')->get();

        $approvers = User::where('role', 'admin')->get();

        return Inertia::render('Faculty/Leaves', [
            'leaves' => $leaves,
            'leaveBalances' => $leaveBalancesKeyed,
            'leaveTypes' => Leave::LEAVE_TYPES,
            'recommenders' => $recommenders,
            'approvers' => $approvers,
            'currentYear' => now()->year,
            'filters' => [
                'status' => $request->get('status'),
                'leave_type' => $request->get('leave_type'),
            ],
        ]);
    }

    /**
     * Show recommendations pending for HOD
     */
    public function pendingRecommendations()
    {
        $user = auth()->user();

        // Fetch all leaves where this user is the recommender and status is pending
        $leaves = Leave::where('recommender_id', $user->id)
            ->where('recommender_status', Leave::STATUS_PENDING)
            ->with(['user', 'approver'])
            ->latest()
            ->paginate(10);

        // Add summary statistics
        $totalPending = Leave::where('recommender_id', $user->id)
            ->where('recommender_status', Leave::STATUS_PENDING)
            ->count();

        $totalFacultyInvolved = Leave::where('recommender_id', $user->id)
            ->where('recommender_status', Leave::STATUS_PENDING)
            ->distinct('user_id')
            ->count();

        $totalDaysRequested = Leave::where('recommender_id', $user->id)
            ->where('recommender_status', Leave::STATUS_PENDING)
            ->sum('total_days');

        return Inertia::render('Hod/PendingRecommendations', [
            'leaves' => $leaves,
            'leaveTypes' => Leave::LEAVE_TYPES,
            'stats' => [
                'pending' => $totalPending,
                'faculty' => $totalFacultyInvolved,
                'days' => $totalDaysRequested,
            ],
        ]);
    }

    /**
     * Show all leaves recommended by HOD (report view)
     */
    public function hodLeaveReport(Request $request)
    {
        $user = auth()->user();

        $query = Leave::where('recommender_id', $user->id)
            ->with(['user', 'approver']);

        // Filter by status
        if ($request->get('status')) {
            $status = $request->get('status');
            if ($status === 'approved') {
                $query->where('recommender_status', 'approved');
            } elseif ($status === 'rejected') {
                $query->where('recommender_status', 'rejected');
            } elseif ($status === 'pending') {
                $query->where('recommender_status', 'pending');
            }
        }

        // Filter by leave type
        if ($request->get('leave_type')) {
            $query->where('leave_type', $request->get('leave_type'));
        }

        // Filter by date range
        if ($request->get('from_date')) {
            $query->whereDate('start_date', '>=', $request->get('from_date'));
        }
        if ($request->get('to_date')) {
            $query->whereDate('end_date', '<=', $request->get('to_date'));
        }

        $leaves = $query->latest('created_at')->paginate(15);

        // Calculate statistics
        $allLeaves = Leave::where('recommender_id', $user->id)->get();
        
        $stats = [
            'total' => $allLeaves->count(),
            'approved' => $allLeaves->where('recommender_status', 'approved')->count(),
            'rejected' => $allLeaves->where('recommender_status', 'rejected')->count(),
            'pending' => $allLeaves->where('recommender_status', 'pending')->count(),
            'total_days_approved' => $allLeaves->where('recommender_status', 'approved')->sum('total_days'),
            'total_faculty' => $allLeaves->pluck('user_id')->unique()->count(),
        ];

        return Inertia::render('Hod/LeaveReport', [
            'leaves' => $leaves,
            'leaveTypes' => Leave::LEAVE_TYPES,
            'stats' => $stats,
            'filters' => [
                'status' => $request->get('status'),
                'leave_type' => $request->get('leave_type'),
                'from_date' => $request->get('from_date'),
                'to_date' => $request->get('to_date'),
            ],
        ]);
    }

    /**
     * Approve/Reject leave as recommender (HOD)
     */
    public function recommendLeave(Request $request, Leave $leave)
    {
        $user = auth()->user();

        if ($leave->recommender_id !== $user->id) {
            return back()->withErrors(['unauthorized' => 'You are not authorized to recommend this leave.']);
        }

        $validated = $request->validate([
            'action' => 'required|in:approved,rejected',
            'comment' => 'nullable|string|max:500',
        ]);

        $leave->update([
            'recommender_status' => $validated['action'],
            'recommender_comment' => $validated['comment'],
            'recommender_approved_at' => now(),
            'approver_status' => $validated['action'] === Leave::STATUS_REJECTED ? Leave::STATUS_REJECTED : $leave->approver_status,
            'approver_approved_at' => $validated['action'] === Leave::STATUS_REJECTED ? now() : $leave->approver_approved_at,
        ]);

        // If rejected by recommender, don't create ledger entry
        // If approved by recommender, still wait for approver before ledger entry

        return back()->with('success', 'Leave has been ' . $validated['action']);
    }

    /**
     * Show approvals pending for admin
     */
    public function pendingApprovals()
    {
        $user = auth()->user();

        // Get leaves that are approved by recommender but pending approver
        $leaves = Leave::where('approver_id', $user->id)
            ->where('approver_status', Leave::STATUS_PENDING)
            ->where('recommender_status', Leave::STATUS_APPROVED)
            ->with(['user', 'recommender'])
            ->latest()
            ->paginate(10);

        // Add summary statistics
        $totalPending = Leave::where('approver_id', $user->id)
            ->where('approver_status', Leave::STATUS_PENDING)
            ->where('recommender_status', Leave::STATUS_APPROVED)
            ->count();

        $totalFacultyInvolved = Leave::where('approver_id', $user->id)
            ->where('approver_status', Leave::STATUS_PENDING)
            ->where('recommender_status', Leave::STATUS_APPROVED)
            ->distinct('user_id')
            ->count();

        $totalDaysRequested = Leave::where('approver_id', $user->id)
            ->where('approver_status', Leave::STATUS_PENDING)
            ->where('recommender_status', Leave::STATUS_APPROVED)
            ->sum('total_days');

        return Inertia::render('Admin/PendingApprovals', [
            'leaves' => $leaves,
            'leaveTypes' => Leave::LEAVE_TYPES,
            'stats' => [
                'pending' => $totalPending,
                'faculty' => $totalFacultyInvolved,
                'days' => $totalDaysRequested,
            ],
        ]);
    }

    /**
     * Approve/Reject leave as approver (Admin)
     * 
     * Ledger entry is created ONLY when both stages approve
     */
    public function approveLeave(Request $request, Leave $leave)
    {
        $user = auth()->user();

        if ($leave->approver_id !== $user->id) {
            return back()->withErrors(['unauthorized' => 'You are not authorized to approve this leave.']);
        }

        $validated = $request->validate([
            'action' => 'required|in:approved,rejected',
            'comment' => 'nullable|string|max:500',
        ]);

        $leave->update([
            'approver_status' => $validated['action'],
            'approver_comment' => $validated['comment'],
            'approver_approved_at' => now(),
        ]);

        // Create ledger entry ONLY if fully approved (both recommender and approver)
        if ($validated['action'] === Leave::STATUS_APPROVED && $leave->isFullyApproved()) {
            $leave->recordInLedger();
        }

        // No need to update balance here - ledger handles it automatically

        return back()->with('success', 'Leave has been ' . $validated['action']);
    }

    /**
     * Calculate working days between two dates
     */
    private function calculateWorkingDays(Carbon $start, Carbon $end, $isFullDay = true)
    {
        $days = 0;
        $current = $start->copy();

        while ($current <= $end) {
            // Count Monday to Friday as working days
            if ($current->isWeekday()) {
                $days += $isFullDay ? 1 : 0.5;
            }
            $current->addDay();
        }

        return $days;
    }

    /**
     * Initialize leave balance for a user at the start of year
     * This creates allocation entries in the ledger
     */
    public function initializeYearlyBalances($userId)
    {
        $year = now()->year;

        foreach (Leave::LEAVE_TYPES as $leaveType => $details) {
            // Get or create balance record
            $balance = LeaveBalance::getOrCreate($userId, $leaveType, $year);

            // Check if allocation already exists for this year
            $existingAllocation = LeaveLedger::where('user_id', $userId)
                ->where('leave_type', $leaveType)
                ->where('reason', LeaveLedger::REASON_ALLOCATION)
                ->whereYear('created_at', $year)
                ->exists();

            if (!$existingAllocation) {
                // Create allocation ledger entry
                LeaveLedger::recordEntry(
                    $userId,
                    $leaveType,
                    $details['annual'],
                    LeaveLedger::REASON_ALLOCATION
                );
            }

            // Compute balance from ledger
            $balance->computeFromLedger()->save();
        }
    }

    /**
     * Get ledger history for a user
     */
    public function getLedgerHistory(User $user)
    {
        $ledger = LeaveLedger::getUserLedgerYear($user->id, now()->year);

        return response()->json([
            'ledger' => $ledger,
            'balances' => LeaveBalance::where('user_id', $user->id)
                ->where('year', now()->year)
                ->get(),
        ]);
    }
}
