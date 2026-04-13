<?php

namespace App\Services;

use App\Models\Leave;
use App\Models\LeaveBalance;
use App\Models\LeaveLedger;
use Carbon\Carbon;

class LeaveValidationService
{
    /**
     * Validate if a user can apply for leave
     */
    public static function canApply($userId, $leaveType, $startDate, $endDate, $days, $allowLWP = false)
    {
        $errors = [];

        // Validate leave type exists
        if (!array_key_exists($leaveType, Leave::LEAVE_TYPES)) {
            $errors[] = 'Invalid leave type.';
            return ['valid' => false, 'errors' => $errors];
        }

        // Validate dates
        $start = Carbon::parse($startDate);
        $end = Carbon::parse($endDate);

        if ($start > $end) {
            $errors[] = 'End date must be after or equal to start date.';
        }

        if ($start->isPast()) {
            $errors[] = 'Cannot apply for leave in the past.';
        }

        // Check for overlapping leaves
        if (self::hasOverlappingLeaves($userId, $start, $end)) {
            $errors[] = 'You already have an approved or pending leave during this period.';
        }

        // Check leave balance
        if (!self::hasSufficientBalance($userId, $leaveType, $days, $start->year)) {
            $currentBalance = self::getCurrentBalance($userId, $leaveType, $start->year);
            $errors[] = "Insufficient balance. You have {$currentBalance} days available but need {$days} days.";
        }

        // Apply leave-type specific rules
        $ruleErrors = self::validateLeaveTypeRules($leaveType, $days);
        $errors = array_merge($errors, $ruleErrors);

        return [
            'valid' => count($errors) === 0,
            'errors' => $errors,
        ];
    }

    /**
     * Check if user has sufficient balance for leave
     */
    public static function hasSufficientBalance($userId, $leaveType, $days, $year = null)
    {
        $year = $year ?? date('Y');
        $balance = self::getCurrentBalance($userId, $leaveType, $year);
        return $balance >= $days;
    }

    /**
     * Get current balance for a user and leave type from ledger
     */
    public static function getCurrentBalance($userId, $leaveType, $year = null)
    {
        $year = $year ?? date('Y');
        return (float) LeaveLedger::where('user_id', $userId)
            ->where('leave_type', $leaveType)
            ->whereYear('created_at', $year)
            ->sum('change');
    }

    /**
     * Check if user has overlapping leaves
     */
    public static function hasOverlappingLeaves($userId, Carbon $start, Carbon $end, $excludeLeaveId = null)
    {
        $query = Leave::where('user_id', $userId);

        if ($excludeLeaveId) {
            $query->where('id', '!=', $excludeLeaveId);
        }

        return $query->where(function ($q) use ($start, $end) {
            $q->whereBetween('start_date', [$start, $end])
                ->orWhereBetween('end_date', [$start, $end])
                ->orWhere(function ($subQ) use ($start, $end) {
                    $subQ->where('start_date', '<=', $start)
                        ->where('end_date', '>=', $end);
                });
        })
        ->where(function ($q) {
            // Only check against approved or pending leaves
            $q->whereIn('recommender_status', [Leave::STATUS_APPROVED, 'pending'])
                ->where('approver_status', '!=', Leave::STATUS_REJECTED);
        })
        ->exists();
    }

    /**
     * Validate leave type specific rules
     */
    public static function validateLeaveTypeRules($leaveType, $days)
    {
        $errors = [];

        $rules = [
            'CL' => ['min' => 0.5, 'max' => 12, 'name' => 'Casual Leave'],
            'SL' => ['min' => 0.5, 'max' => 10, 'name' => 'Sick Leave'],
            'EL' => ['min' => 1, 'max' => 30, 'name' => 'Earned Leave'],
            'ML' => ['min' => 1, 'max' => 180, 'name' => 'Maternity Leave'],
            'PL' => ['min' => 1, 'max' => 15, 'name' => 'Paternity Leave'],
            'BL' => ['min' => 1, 'max' => 5, 'name' => 'Bereavement Leave'],
            'OL' => ['min' => 1, 'max' => 30, 'name' => 'Other Leave'],
        ];

        if (!isset($rules[$leaveType])) {
            $errors[] = "Invalid leave type: {$leaveType}";
            return $errors;
        }

        $rule = $rules[$leaveType];

        if ($days < $rule['min']) {
            $errors[] = "{$rule['name']} requires minimum {$rule['min']} day(s).";
        }

        if ($days > $rule['max']) {
            $errors[] = "{$rule['name']} cannot exceed {$rule['max']} days per request.";
        }

        return $errors;
    }

    /**
     * Get user's leave balance summary
     */
    public static function getBalanceSummary($userId, $year = null)
    {
        $year = $year ?? date('Y');
        $summary = [];

        foreach (Leave::LEAVE_TYPES as $type => $details) {
            $balance = LeaveBalance::getOrCreate($userId, $type, $year);
            $balance->computeFromLedger();

            $summary[$type] = [
                'name' => $details['name'],
                'allocated' => $balance->total_allocated,
                'balance' => $balance->balance,
                'used' => 0, // This would be calculated from ledger
            ];
        }

        return $summary;
    }

    /**
     * Get complete ledger audit for a user
     */
    public static function getLedgerAudit($userId, $year = null)
    {
        $year = $year ?? date('Y');

        $ledgerEntries = LeaveLedger::where('user_id', $userId)
            ->whereYear('created_at', $year)
            ->with('leaveRequest')
            ->orderBy('created_at')
            ->get()
            ->map(function ($entry) {
                return [
                    'id' => $entry->id,
                    'date' => $entry->created_at->format('Y-m-d H:i:s'),
                    'leave_type' => $entry->leave_type,
                    'change' => $entry->change,
                    'reason' => $entry->reason,
                    'reference' => $entry->leave_request_id ? "Leave Request #" . $entry->leave_request_id : null,
                ];
            });

        return [
            'user_id' => $userId,
            'year' => $year,
            'entries' => $ledgerEntries,
        ];
    }

    /**
     * Calculate provisional balance including pending approvals
     */
    public static function getProvisionalBalance($userId, $leaveType, $year = null)
    {
        $year = $year ?? date('Y');

        // Get actual ledger balance
        $actualBalance = self::getCurrentBalance($userId, $leaveType, $year);

        // Get pending leaves (not yet recorded in ledger)
        $pendingDays = Leave::where('user_id', $userId)
            ->where('leave_type', $leaveType)
            ->whereYear('start_date', $year)
            ->where(function ($q) {
                $q->where('recommender_status', '!=', Leave::STATUS_REJECTED)
                    ->where('approver_status', 'pending');
            })
            ->sum('total_days');

        return [
            'actual' => $actualBalance,
            'pending_deduction' => $pendingDays,
            'provisional' => $actualBalance - $pendingDays,
        ];
    }
}
