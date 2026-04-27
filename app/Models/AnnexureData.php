<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexureData extends Model
{
    use HasFactory;

    protected $fillable = [
        'annexure_request_id',
        'form_data',
        'version',
        'change_notes',
        'changed_by',
    ];

    protected $casts = [
        'form_data' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function request()
    {
        return $this->belongsTo(AnnexureRequest::class);
    }

    public function versions()
    {
        return $this->hasMany(AnnexureVersion::class);
    }

    // Scopes
    public function scopeLatest($query)
    {
        return $query->orderBy('version', 'desc');
    }

    public function getChanges()
    {
        return $this->form_data ?? [];
    }
}
