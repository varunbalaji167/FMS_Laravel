<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveBalance extends Model
{
    use HasFactory;

    protected $table = 'leave_balances';

    protected $fillable = [
        'user_id',
        'leave_type',
        'total_allocated',
        'used',
        'pending',
        'balance',
        'year',
    ];

    protected $casts = [
        'total_allocated' => 'float',
        'used' => 'float',
        'pending' => 'float',
        'balance' => 'float',
        'year' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get or create balance record for a user, leave type, and year
     */
    public static function getOrCreate($userId, $leaveType, $year = null)
    {
        $year = $year ?? date('Y');

        return self::firstOrCreate(
            [
                'user_id' => $userId,
                'leave_type' => $leaveType,
                'year' => $year,
            ],
            [
                'total_allocated' => Leave::LEAVE_TYPES[$leaveType]['annual'] ?? 0,
                'used' => 0,
                'pending' => 0,
                'balance' => Leave::LEAVE_TYPES[$leaveType]['annual'] ?? 0,
            ]
        );
    }

    /**
     * Compute actual balance from ledger entries
     * This method recalculates balance based on leave_ledger entries
     */
    public function computeFromLedger()
    {
        // Get the sum of all changes in the ledger for this user + leave_type + year
        $actualBalance = LeaveLedger::where('user_id', $this->user_id)
            ->where('leave_type', $this->leave_type)
            ->whereYear('created_at', $this->year)
            ->sum('change');

        $this->balance = (float) $actualBalance;
        return $this;
    }

    /**
     * Save and ensure balance is computed from ledger
     */
    public function save(array $options = [])
    {
        $this->computeFromLedger();
        return parent::save($options);
    }

    /**
     * Get pending leaves count and total days for approval calculations
     */
    public function getPendingDays()
    {
        return Leave::where('user_id', $this->user_id)
            ->where('leave_type', $this->leave_type)
            ->whereYear('start_date', $this->year)
            ->whereIn('recommender_status', ['pending', 'approved'])
            ->where('approver_status', 'pending')
            ->sum('total_days');
    }

    /**
     * Get approved leaves that consume balance
     */
    public function getApprovedDays()
    {
        return Leave::where('user_id', $this->user_id)
            ->where('leave_type', $this->leave_type)
            ->whereYear('start_date', $this->year)
            ->where('recommender_status', 'approved')
            ->where('approver_status', 'approved')
            ->sum('total_days');
    }

    /**
     * Update balance after a leave approval
     * This creates a ledger entry and updates the balance
     */
    public function recordLeaveTaken($leaveRequestId, $days)
    {
        LeaveLedger::recordEntry(
            $this->user_id,
            $this->leave_type,
            -$days, // Negative because balance decreases
            LeaveLedger::REASON_LEAVE_TAKEN,
            $leaveRequestId
        );

        // Recompute balance from ledger
        return $this->computeFromLedger();
    }

    /**
     * Record a leave cancellation and credit balance back
     */
    public function recordLeaveCancelled($leaveRequestId, $days)
    {
        LeaveLedger::recordEntry(
            $this->user_id,
            $this->leave_type,
            $days, // Positive because balance increases
            LeaveLedger::REASON_LEAVE_CANCELLED,
            $leaveRequestId
        );

        return $this->computeFromLedger();
    }

    /**
     * Record early return and credit days
     */
    public function recordEarlyReturn($leaveRequestId, $daysReturned)
    {
        LeaveLedger::recordEntry(
            $this->user_id,
            $this->leave_type,
            $daysReturned,
            LeaveLedger::REASON_EARLY_RETURN,
            $leaveRequestId
        );

        return $this->computeFromLedger();
    }

    /**
     * Record late return as LWP (Loss of Pay) or debit
     */
    public function recordLateReturn($leaveRequestId, $daysLate)
    {
        LeaveLedger::recordEntry(
            $this->user_id,
            $this->leave_type,
            -$daysLate,
            LeaveLedger::REASON_LATE_RETURN,
            $leaveRequestId
        );

        return $this->computeFromLedger();
    }

    /**
     * Record compensation off
     */
    public function recordCompOff($leaveRequestId, $days)
    {
        LeaveLedger::recordEntry(
            $this->user_id,
            $this->leave_type,
            $days,
            LeaveLedger::REASON_COMP_OFF,
            $leaveRequestId
        );

        return $this->computeFromLedger();
    }

    /**
     * Make a manual correction to balance
     */
    public function makeCorrection($days, $notes = null)
    {
        LeaveLedger::recordEntry(
            $this->user_id,
            $this->leave_type,
            $days,
            LeaveLedger::REASON_CORRECTION,
            null
        );

        return $this->computeFromLedger();
    }

    /**
     * Get full ledger history for this balance
     */
    public function getLedgerHistory()
    {
        return LeaveLedger::where('user_id', $this->user_id)
            ->where('leave_type', $this->leave_type)
            ->whereYear('created_at', $this->year)
            ->orderBy('created_at', 'asc')
            ->get();
    }
}
