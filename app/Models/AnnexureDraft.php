<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexureDraft extends Model
{
    use HasFactory;

    protected $fillable = [
        'annexure_id',
        'user_id',
        'content',
        'auto_save',
    ];

    protected $casts = [
        'content' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function annexure()
    {
        return $this->belongsTo(Annexure::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function isAutoSave(): bool
    {
        return $this->auto_save === 'auto';
    }
}
