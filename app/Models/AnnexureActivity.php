<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexureActivity extends Model
{
    use HasFactory;

    protected $fillable = [
        'annexure_id',
        'user_id',
        'action',
        'description',
        'changes',
        'ip_address',
    ];

    protected $casts = [
        'changes' => 'json',
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
}
