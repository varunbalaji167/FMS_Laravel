<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexureSignature extends Model
{
    use HasFactory;

    protected $fillable = [
        'annexure_id',
        'signed_by',
        'signature_data',
        'signature_type',
        'signed_pdf_path',
        'signature_notes',
        'signed_at',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function annexure()
    {
        return $this->belongsTo(Annexure::class);
    }

    public function signedBy()
    {
        return $this->belongsTo(User::class, 'signed_by');
    }

    public function isDrawn(): bool
    {
        return $this->signature_type === 'drawn';
    }

    public function isUploaded(): bool
    {
        return $this->signature_type === 'uploaded';
    }
}
