<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LeaveLedger extends Model
{
    use HasFactory;

    protected $table = 'leave_ledger';

    // Disable timestamps - we only use created_at
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'leave_type',
        'change',
        'reason',
        'leave_request_id',
        'created_at',
    ];

    protected $casts = [
        'change' => 'float',
        'created_at' => 'datetime',
    ];

    // Reason constants
    const REASON_ALLOCATION = 'allocation';
    const REASON_LEAVE_TAKEN = 'leave_taken';
    const REASON_LEAVE_CANCELLED = 'leave_cancelled';
    const REASON_EARLY_RETURN = 'early_return';
    const REASON_LATE_RETURN = 'late_return';
    const REASON_COMP_OFF = 'comp_off';
    const REASON_CORRECTION = 'correction';

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function leaveRequest()
    {
        return $this->belongsTo(Leave::class, 'leave_request_id');
    }

    /**
     * Get the current balance for a user and leave type
     * Balance = SUM(change) from all ledger entries for this user + leave_type
     */
    public static function getBalance($userId, $leaveType, $year = null)
    {
        $year = $year ?? date('Y');

        $query = self::where('user_id', $userId)
            ->where('leave_type', $leaveType)
            ->whereYear('created_at', $year);

        return (float) $query->sum('change');
    }

    /**
     * Get ledger entries for a user and leave type for a specific year
     */
    public static function getLedgerForYear($userId, $leaveType, $year = null)
    {
        $year = $year ?? date('Y');

        return self::where('user_id', $userId)
            ->where('leave_type', $leaveType)
            ->whereYear('created_at', $year)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Create a ledger entry
     */
    public static function recordEntry($userId, $leaveType, $change, $reason, $leaveRequestId = null)
    {
        return self::create([
            'user_id' => $userId,
            'leave_type' => $leaveType,
            'change' => $change,
            'reason' => $reason,
            'leave_request_id' => $leaveRequestId,
            'created_at' => now(),
        ]);
    }

    /**
     * Get all ledger entries for a user in a given year
     */
    public static function getUserLedgerYear($userId, $year = null)
    {
        $year = $year ?? date('Y');

        return self::where('user_id', $userId)
            ->whereYear('created_at', $year)
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Reverse a ledger entry (for cancellations)
     */
    public function reverse()
    {
        return self::recordEntry(
            $this->user_id,
            $this->leave_type,
            -$this->change,
            self::REASON_LEAVE_CANCELLED,
            $this->leave_request_id
        );
    }
}
