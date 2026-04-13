<?php

namespace App\Http\Controllers;

use App\Models\Leave;
use App\Models\User;
use App\Models\LeaveLedger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class LeaveReportController extends Controller
{
    /**
     * Get leave report for HOD - shows only their department faculty
     */
    public function hodReport(Request $request)
    {
        $user = Auth::user();
        
        // Get all faculty under this HOD
        $facultyIds = User::where('hod_id', $user->id)
            ->where('role', 'faculty')
            ->pluck('id')
            ->toArray();

        $leaves = $this->getLeaveQuery($facultyIds)
            ->with('user')
            ->paginate(15);

        $summary = $this->getLeavesSummary($facultyIds);
        
        return Inertia::render('Hod/LeaveReport', [
            'leaves' => $leaves,
            'summary' => $summary,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Get leave report for Admin - shows all faculty leaves
     */
    public function adminReport(Request $request)
    {
        // Get all faculty
        $facultyIds = User::where('role', 'faculty')->pluck('id')->toArray();

        $leaves = $this->getLeaveQuery($facultyIds)
            ->with('user')
            ->paginate(15);

        $summary = $this->getLeavesSummary($facultyIds);
        $departmentSummary = $this->getDepartmentSummary();
        
        return Inertia::render('Admin/LeaveReport', [
            'leaves' => $leaves,
            'summary' => $summary,
            'departmentSummary' => $departmentSummary,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Get leave report for Faculty - shows their own leaves
     */
    public function facultyReport(Request $request)
    {
        $user = Auth::user();

        $leaves = $this->getLeaveQuery([$user->id])
            ->paginate(15);

        $summary = $this->getLeavesSummary([$user->id]);
        
        return Inertia::render('Faculty/LeaveReport', [
            'leaves' => $leaves,
            'summary' => $summary,
            'filters' => $request->all(),
        ]);
    }

    /**
     * Build the base leave query with filters
     */
    private function getLeaveQuery(array $userIds)
    {
        $query = Leave::whereIn('user_id', $userIds);

        // Filter by leave type
        if (request('leave_type') && request('leave_type') !== 'all') {
            $query->where('leave_type', request('leave_type'));
        }

        // Filter by status
        if (request('status') && request('status') !== 'all') {
            $status = request('status');
            if ($status === 'approved') {
                $query->where('approver_status', 'approved');
            } elseif ($status === 'pending') {
                $query->where(function($q) {
                    $q->where('approver_status', 'pending')
                      ->orWhere('recommender_status', 'pending');
                });
            } elseif ($status === 'rejected') {
                $query->where(function($q) {
                    $q->where('approver_status', 'rejected')
                      ->orWhere('recommender_status', 'rejected');
                });
            } elseif ($status === 'taken') {
                $query->where('approver_status', 'approved')
                    ->where('start_date', '<=', now())
                    ->where('end_date', '<=', now());
            }
        }

        // Filter by date range
        if (request('from_date')) {
            $query->where('start_date', '>=', request('from_date'));
        }

        if (request('to_date')) {
            $query->where('end_date', '<=', request('to_date'));
        }

        // Filter by year
        if (request('year')) {
            $year = request('year');
            $query->whereBetween('start_date', [
                Carbon::createFromDate($year, 1, 1),
                Carbon::createFromDate($year, 12, 31),
            ]);
        }

        // Search by faculty name/email
        if (request('search')) {
            $query->whereHas('user', function($q) {
                $q->where('name', 'like', '%' . request('search') . '%')
                  ->orWhere('email', 'like', '%' . request('search') . '%');
            });
        }

        return $query->orderBy('start_date', 'desc');
    }

    /**
     * Get summary statistics for selected leaves
     */
    private function getLeavesSummary(array $userIds)
    {
        $leaves = Leave::whereIn('user_id', $userIds);

        // Apply filters
        if (request('leave_type') && request('leave_type') !== 'all') {
            $leaves->where('leave_type', request('leave_type'));
        }

        if (request('year')) {
            $year = request('year');
            $leaves->whereBetween('start_date', [
                Carbon::createFromDate($year, 1, 1),
                Carbon::createFromDate($year, 12, 31),
            ]);
        }

        $allLeaves = $leaves->get();

        return [
            'total_requests' => $allLeaves->count(),
            'approved' => $allLeaves->where('approver_status', 'approved')->count(),
            'pending' => $allLeaves->where('approver_status', 'pending')->count(),
            'rejected' => $allLeaves->where('approver_status', 'rejected')->count(),
            'total_days' => $allLeaves->sum('total_days'),
            'approved_days' => $allLeaves->where('approver_status', 'approved')->sum('total_days'),
            'by_leave_type' => $this->getSummaryByLeaveType($allLeaves),
            'by_status' => $this->getSummaryByStatus($allLeaves),
        ];
    }

    /**
     * Get summary grouped by leave type
     */
    private function getSummaryByLeaveType($leaves)
    {
        $leaveTypes = Leave::LEAVE_TYPES;
        $summary = [];

        foreach ($leaveTypes as $code => $info) {
            $typeLeaves = $leaves->where('leave_type', $code);
            $summary[$code] = [
                'name' => $info['name'],
                'count' => $typeLeaves->count(),
                'days' => $typeLeaves->sum('total_days'),
                'approved' => $typeLeaves->where('approver_status', 'approved')->count(),
                'pending' => $typeLeaves->where('approver_status', 'pending')->count(),
            ];
        }

        return $summary;
    }

    /**
     * Get summary grouped by status
     */
    private function getSummaryByStatus($leaves)
    {
        return [
            'approved' => [
                'count' => $leaves->where('approver_status', 'approved')->count(),
                'days' => $leaves->where('approver_status', 'approved')->sum('total_days'),
            ],
            'pending_approver' => [
                'count' => $leaves->where('approver_status', 'pending')->count(),
                'days' => $leaves->where('approver_status', 'pending')->sum('total_days'),
            ],
            'pending_recommender' => [
                'count' => $leaves->where('recommender_status', 'pending')->count(),
                'days' => $leaves->where('recommender_status', 'pending')->sum('total_days'),
            ],
            'rejected' => [
                'count' => $leaves->filter(function($leave) {
                    return $leave->approver_status === 'rejected' || $leave->recommender_status === 'rejected';
                })->count(),
            ],
        ];
    }

    /**
     * Get department-wise summary (for admin only)
     */
    private function getDepartmentSummary()
    {
        // Returns empty array - department field not available in users table
        // Can be extended in future when department is added to users schema
        return [];
    }

    /**
     * Export leave data as CSV
     */
    public function exportCSV(Request $request)
    {
        $user = Auth::user();
        
        // Determine which leaves to export based on user role
        if ($user->role === 'admin') {
            $facultyIds = User::where('role', 'faculty')->pluck('id')->toArray();
        } elseif ($user->role === 'hod') {
            $facultyIds = User::where('hod_id', $user->id)
                ->where('role', 'faculty')
                ->pluck('id')
                ->toArray();
        } else {
            $facultyIds = [$user->id];
        }

        $leaves = $this->getLeaveQuery($facultyIds)
            ->with('user')
            ->get();

        $fileName = 'leave_report_' . now()->format('Y-m-d_His') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"$fileName\"",
        ];

        $callback = function() use ($leaves) {
            $file = fopen('php://output', 'w');
            
            // Add CSV headers
            fputcsv($file, [
                'Faculty Name',
                'Email',
                'Leave Type',
                'Start Date',
                'End Date',
                'Total Days',
                'Reason',
                'HOD Status',
                'Admin Status',
                'Applied Date',
                'Approved Date',
            ]);

            // Add leave data
            foreach ($leaves as $leave) {
                fputcsv($file, [
                    $leave->user->name,
                    $leave->user->email,
                    Leave::LEAVE_TYPES[$leave->leave_type]['name'],
                    $leave->start_date->format('Y-m-d'),
                    $leave->end_date->format('Y-m-d'),
                    $leave->total_days,
                    $leave->reason,
                    ucfirst($leave->recommender_status),
                    ucfirst($leave->approver_status),
                    $leave->created_at->format('Y-m-d H:i'),
                    $leave->approver_approved_at?->format('Y-m-d H:i') ?? '-',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
