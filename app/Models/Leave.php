<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Leave extends Model
{
    use HasFactory;

    protected $appends = [
        'status',
        'leave_type_name',
    ];

    protected $fillable = [
        'user_id',
        'leave_type',
        'start_date',
        'end_date',
        'is_full_day',
        'reason',
        'attachment_path',
        'recommender_id',
        'approver_id',
        'recommender_status',
        'approver_status',
        'recommender_comment',
        'approver_comment',
        'recommender_approved_at',
        'approver_approved_at',
        'total_days',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_full_day' => 'boolean',
        'recommender_approved_at' => 'datetime',
        'approver_approved_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Leave types with their annual allocations
    const LEAVE_TYPES = [
        'CL' => ['name' => 'Casual Leave', 'annual' => 12],
        'SL' => ['name' => 'Sick Leave', 'annual' => 10],
        'EL' => ['name' => 'Earned Leave', 'annual' => 20],
        'ML' => ['name' => 'Maternity Leave', 'annual' => 180],
        'PL' => ['name' => 'Paternity Leave', 'annual' => 15],
        'BL' => ['name' => 'Bereavement Leave', 'annual' => 5],
        'OL' => ['name' => 'Other Leave', 'annual' => 5],
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function recommender()
    {
        return $this->belongsTo(User::class, 'recommender_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function ledgerEntries()
    {
        return $this->hasMany(LeaveLedger::class, 'leave_request_id');
    }

    public function isFullyApproved()
    {
        return $this->recommender_status === self::STATUS_APPROVED && 
               $this->approver_status === self::STATUS_APPROVED;
    }

    public function isPending()
    {
        return $this->recommender_status === self::STATUS_PENDING || 
               $this->approver_status === self::STATUS_PENDING;
    }

    public function getLeaveTypeNameAttribute()
    {
        return self::LEAVE_TYPES[$this->leave_type]['name'] ?? $this->leave_type;
    }

    public function getStatusAttribute()
    {
        if ($this->recommender_status === self::STATUS_REJECTED || 
            $this->approver_status === self::STATUS_REJECTED) {
            return 'rejected';
        }
        
        if ($this->recommender_status === self::STATUS_PENDING) {
            return 'pending_recommender';
        }
        
        if ($this->approver_status === self::STATUS_PENDING) {
            return 'pending_approver';
        }
        
        if ($this->isFullyApproved()) {
            return 'approved';
        }

        return 'pending';
    }

    /**
     * Record this leave in the ledger when approved
     * This should be called after both recommender and approver approve
     */
    public function recordInLedger()
    {
        if (!$this->isFullyApproved()) {
            return null;
        }

        // Check if already recorded
        $existingEntry = LeaveLedger::where('leave_request_id', $this->id)
            ->where('reason', LeaveLedger::REASON_LEAVE_TAKEN)
            ->first();

        if ($existingEntry) {
            return $existingEntry;
        }

        // Create ledger entry with negative value (balance decreases)
        return LeaveLedger::recordEntry(
            $this->user_id,
            $this->leave_type,
            -$this->total_days,
            LeaveLedger::REASON_LEAVE_TAKEN,
            $this->id
        );
    }

    /**
     * Check if there are overlapping leaves with this one
     */
    public function hasOverlappingLeaves()
    {
        return Leave::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->where(function ($query) {
                $query->whereBetween('start_date', [$this->start_date, $this->end_date])
                    ->orWhereBetween('end_date', [$this->start_date, $this->end_date])
                    ->orWhere(function ($subQuery) {
                        $subQuery->where('start_date', '<=', $this->start_date)
                            ->where('end_date', '>=', $this->end_date);
                    });
            })
            ->where(function ($query) {
                $query->whereIn('recommender_status', [self::STATUS_APPROVED, 'pending'])
                    ->where('approver_status', '!=', self::STATUS_REJECTED);
            })
            ->exists();
    }

    /**
     * Check if balance is sufficient for this leave
     */
    public function canApply($allowLWP = false)
    {
        // Get the balance record
        $balance = LeaveBalance::where('user_id', $this->user_id)
            ->where('leave_type', $this->leave_type)
            ->where('year', $this->start_date->year)
            ->first();

        if (!$balance) {
            // No balance record means allocation hasn't happened yet
            return false;
        }

        $currentBalance = $balance->computeFromLedger()->balance;

        // Allow if balance is sufficient or LWP is allowed
        return $currentBalance >= $this->total_days || $allowLWP;
    }

    /**
     * Get leave history with ledger details
     */
    public function getLedgerHistory()
    {
        return $this->ledgerEntries()->orderBy('created_at')->get();
    }

    /**
     * Cancel this leave and reverse ledger entries
     */
    public function cancel($reason = null)
    {
        // Reverse the leave_taken entry
        $takenEntry = LeaveLedger::where('leave_request_id', $this->id)
            ->where('reason', LeaveLedger::REASON_LEAVE_TAKEN)
            ->first();

        if ($takenEntry) {
            $takenEntry->reverse();
        }

        // Update leave status
        $this->update([
            'recommender_status' => 'cancelled',
            'approver_status' => 'cancelled',
        ]);

        return $this;
    }
}
