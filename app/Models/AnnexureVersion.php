<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexureVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'annexure_request_id',
        'annexure_data_id',
        'version_number',
        'version_type',
        'pdf_path',
        'pdf_filename',
        'pdf_file_size',
        'pdf_hash',
        'generated_at',
        'generated_by',
        'signed_at',
        'signed_by',
        'digital_signature',
        'signature_notes',
        'generation_notes',
        'is_current',
        'is_downloadable',
        'download_count',
        'last_downloaded_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'signed_at' => 'datetime',
        'last_downloaded_at' => 'datetime',
        'is_current' => 'boolean',
        'is_downloadable' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function request()
    {
        return $this->belongsTo(AnnexureRequest::class);
    }

    public function data()
    {
        return $this->belongsTo(AnnexureData::class, 'annexure_data_id');
    }

    public function generatedBy()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function signedBy()
    {
        return $this->belongsTo(User::class, 'signed_by');
    }

    // Scopes
    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('version_type', $type);
    }

    public function scopeDownloadable($query)
    {
        return $query->where('is_downloadable', true);
    }

    public function scopeSigned($query)
    {
        return $query->whereNotNull('signed_at');
    }

    public function scopeLatest($query)
    {
        return $query->latest('version_number');
    }

    // Methods
    public function markAsCurrent()
    {
        // Mark all other versions as not current
        $this->request->versions()->update(['is_current' => false]);

        // Mark this version as current
        $this->update(['is_current' => true]);
    }

    public function recordDownload()
    {
        $this->increment('download_count');
        $this->update(['last_downloaded_at' => now()]);
    }

    public function sign($signature, $signedBy, $notes = null)
    {
        $this->update([
            'signed_at' => now(),
            'signed_by' => $signedBy,
            'digital_signature' => $signature,
            'signature_notes' => $notes,
        ]);
    }

    public function isSigned()
    {
        return !is_null($this->signed_at);
    }

    public function getDownloadUrl()
    {
        if (!$this->is_downloadable) {
            return null;
        }

        return route('annexure.download', [
            'request' => $this->request_id,
            'version' => $this->id,
        ]);
    }

    public function getVersionLabel()
    {
        return "{$this->version_type} v{$this->version_number}";
    }
}
