<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexurePdf extends Model
{
    use HasFactory;

    protected $fillable = [
        'annexure_id',
        'file_path',
        'file_name',
        'file_size',
        'status',
        'generated_at',
        'signed_at',
    ];

    protected $casts = [
        'generated_at' => 'datetime',
        'signed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function annexure()
    {
        return $this->belongsTo(Annexure::class);
    }

    public function isSigned(): bool
    {
        return $this->status === 'signed';
    }

    public function isArchived(): bool
    {
        return $this->status === 'archived';
    }
}
