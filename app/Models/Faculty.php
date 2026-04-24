<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'father_name',
        'avatar_url',
        'department',
        'employee_id',
        'date_of_birth',
        'ptn',
        'idn',
        'designation_at_joining',
        'doj',
        'confirmation_date',
        'present_designation',
        'present_tenure_doj',
        'contract_end_date',
        'retirement_date',
        'phd_date',
        'phd_university',
        'pan_number',
        'aadhar_number',
        'passport_number',
        'pran_number',
        'gender',
        'category',
        'nationality',
        'religion',
        'marital_status',
        'blood_group',
        'bank_name',
        'bank_branch',
        'ifsc_code',
        'salary_account_number',
        'official_email',
        'contact_number',
        'emergency_contact_number',
        'current_address',
        'permanent_address',
        'relocation_claim',
        'is_active',
        'remarks',
    ];

    protected $dates = [
        'date_of_birth',
        'doj',
        'confirmation_date',
        'present_tenure_doj',
        'contract_end_date',
        'retirement_date',
        'phd_date',
        'created_at',
        'updated_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
