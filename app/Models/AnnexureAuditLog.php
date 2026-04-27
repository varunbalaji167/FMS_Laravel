<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexureAuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'annexure_request_id',
        'user_id',
        'action',
        'description',
        'previous_state',
        'new_state',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'previous_state' => 'json',
        'new_state' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function request()
    {
        return $this->belongsTo(AnnexureRequest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeRecent($query, $hours = 24)
    {
        return $query->where('created_at', '>=', now()->subHours($hours));
    }

    public function scopeTimeline($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    public function scopeWithChanges($query)
    {
        return $query->whereNotNull('previous_state')->whereNotNull('new_state');
    }

    // Methods
    public static function record($requestId, $action, $description, $userId, $data = [])
    {
        return self::create([
            'annexure_request_id' => $requestId,
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
            'previous_state' => $data['previous_state'] ?? null,
            'new_state' => $data['new_state'] ?? null,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function getActionLabel()
    {
        $labels = [
            'created' => 'Request Created',
            'draft_saved' => 'Draft Saved',
            'submitted' => 'Submitted for Review',
            'admin_edited' => 'Admin Edited Data',
            'revision_requested' => 'Revision Requested',
            'pdf_generated' => 'PDF Generated',
            'approved' => 'Approved',
            'signed' => 'Digitally Signed',
            'rejected' => 'Rejected',
            'downloaded' => 'Downloaded',
            'commented' => 'Comment Added',
            'assigned' => 'Assigned to Admin',
            'data_updated' => 'Data Updated',
            'validation_failed' => 'Validation Failed',
            'status_changed' => 'Status Changed',
            'metadata_updated' => 'Metadata Updated',
        ];

        return $labels[$this->action] ?? ucfirst($this->action);
    }

    public function getChangeSummary()
    {
        if (!$this->previous_state || !$this->new_state) {
            return null;
        }

        $changes = [];
        foreach ($this->new_state as $field => $newValue) {
            $oldValue = $this->previous_state[$field] ?? 'N/A';
            if ($oldValue !== $newValue) {
                $changes[] = "{$field}: {$oldValue} → {$newValue}";
            }
        }

        return !empty($changes) ? implode(', ', $changes) : null;
    }

    public function getTimelineLabel()
    {
        return sprintf(
            '%s - %s (%s)',
            $this->created_at->format('M d, Y H:i'),
            $this->getActionLabel(),
            $this->user->name ?? 'System'
        );
    }
}
