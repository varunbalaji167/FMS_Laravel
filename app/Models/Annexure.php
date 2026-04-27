<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Annexure extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'annexure_template_id',
        'content',
        'status',
        'submitted_at',
        'reviewed_at',
        'signed_at',
        'admin_comments',
        'current_version',
    ];

    protected $casts = [
        'content' => 'json',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'signed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Status constants
    const STATUS_DRAFT = 'draft';
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_UNDER_REVIEW = 'under_review';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_ARCHIVED = 'archived';

    public static $statuses = [
        'draft' => 'Draft',
        'submitted' => 'Submitted',
        'under_review' => 'Under Review',
        'approved' => 'Approved',
        'rejected' => 'Rejected',
        'archived' => 'Archived',
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

    public function drafts()
    {
        return $this->hasMany(AnnexureDraft::class);
    }

    public function versions()
    {
        return $this->hasMany(AnnexureVersion::class)->orderBy('version_number', 'desc');
    }

    public function pdfs()
    {
        return $this->hasMany(AnnexurePdf::class);
    }

    public function signatures()
    {
        return $this->hasMany(AnnexureSignature::class);
    }

    public function activities()
    {
        return $this->hasMany(AnnexureActivity::class)->orderBy('created_at', 'desc');
    }

    public function latestSignature()
    {
        return $this->signatures()->latest()->first();
    }

    public function latestPdf()
    {
        return $this->pdfs()->latest()->first();
    }

    // Methods
    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isSubmitted(): bool
    {
        return $this->status === self::STATUS_SUBMITTED;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function isSigned(): bool
    {
        return $this->status === self::STATUS_APPROVED && $this->signed_at !== null;
    }

    public function canEdit(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_REJECTED]);
    }

    public function canSubmit(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function canSign(): bool
    {
        return $this->status === self::STATUS_APPROVED && !$this->isSigned();
    }

    public function createVersion($reason = null, $changedBy = null)
    {
        $this->current_version++;
        $this->save();

        AnnexureVersion::create([
            'annexure_id' => $this->id,
            'version_number' => $this->current_version - 1,
            'content' => json_encode($this->getOriginal('content')),
            'changed_by' => $changedBy ?? auth()->user()->name,
            'change_reason' => $reason,
            'status' => $this->status,
        ]);
    }

    public function logActivity($action, $description = null, $changes = null)
    {
        AnnexureActivity::create([
            'annexure_id' => $this->id,
            'user_id' => auth()->id(),
            'action' => $action,
            'description' => $description,
            'changes' => $changes,
            'ip_address' => request()->ip(),
        ]);
    }
}
