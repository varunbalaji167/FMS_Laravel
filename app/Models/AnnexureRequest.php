<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexureRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'annexure_template_id',
        'reference_number',
        'title',
        'notes',
        'status',
        'current_version_id',
        'assigned_to',
        'submitted_at',
        'reviewed_at',
        'approved_at',
        'signed_at',
        'revision_count',
        'revision_reason',
        'admin_comments',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'signed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(AnnexureTemplate::class, 'annexure_template_id');
    }

    public function currentVersion()
    {
        return $this->belongsTo(AnnexureVersion::class, 'current_version_id');
    }

    public function assignedAdmin()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function data()
    {
        return $this->hasMany(AnnexureData::class);
    }

    public function versions()
    {
        return $this->hasMany(AnnexureVersion::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AnnexureAuditLog::class)->orderBy('created_at', 'desc');
    }

    // Scopes
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePendingReview($query)
    {
        return $query->whereIn('status', ['submitted', 'under_review']);
    }

    public function scopeAssignedToAdmin($query, $adminId)
    {
        return $query->where('assigned_to', $adminId);
    }

    // Methods
    public function canEdit()
    {
        return in_array($this->status, ['draft', 'revision_requested']);
    }

    public function canSubmit()
    {
        return $this->status === 'draft' || $this->status === 'revision_requested';
    }

    public function canReview()
    {
        return in_array($this->status, ['submitted', 'under_review']);
    }

    public function canApprove()
    {
        return in_array($this->status, ['submitted', 'under_review']);
    }

    public function canSign()
    {
        return $this->status === 'approved';
    }

    public function getLatestData()
    {
        return $this->data()->latest()->first();
    }

    public function getLatestVersion()
    {
        if ($this->current_version_id) {
            return $this->versions()->find($this->current_version_id);
        }
        return $this->versions()->orderBy('version_number', 'desc')->first();
    }

    public function getAllVersions()
    {
        return $this->versions()->orderBy('version_number', 'desc')->get();
    }
}
