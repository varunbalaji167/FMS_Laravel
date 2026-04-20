<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Faculty;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin',
            'email' => 'admin@iiti.ac.in',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create HOD User
        User::create([
            'name' => 'HOD',
            'email' => 'hod.cse@iiti.ac.in',
            'password' => Hash::make('password'),
            'role' => 'hod',
            'email_verified_at' => now(),
        ]);

        // Create Faculty User
        $facultyUser = User::create([
            'name' => 'Dr. John Doe',
            'email' => 'user@iiti.ac.in',
            'password' => Hash::make('password'),
            'role' => 'faculty',
            'email_verified_at' => now(),
        ]);

        // Create Faculty Profile for the faculty user
        Faculty::create([
            'user_id' => $facultyUser->id,
            'full_name' => 'Dr. John Doe',
            'avatar_url' => 'https://via.placeholder.com/150',
            'department' => 'Computer Science and Engineering',
            'employee_id' => 'EMP001',
            'date_of_birth' => '1980-05-15',
            'ptn' => 'PTN12345',
            'idn' => 'IDN98765',
            'designation_at_joining' => 'Assistant Professor',
            'doj' => '2010-07-01',
            'confirmation_date' => '2012-07-01',
            'present_designation' => 'Associate Professor',
            'present_tenure_doj' => '2018-01-15',
            'contract_end_date' => '2028-01-15',
            'retirement_date' => '2045-05-15',
            'phd_date' => '2008-04-10',
            'phd_university' => 'IIT Delhi',
            'pan_number' => 'ABCDE1234F',
            'aadhar_number' => '1234567890123456',
            'passport_number' => 'J1234567',
            'pran_number' => 'PRAN1234567890',
            'gender' => 'Male',
            'category' => 'General',
            'nationality' => 'Indian',
            'religion' => 'Hindu',
            'marital_status' => 'Married',
            'blood_group' => 'B+',
            'bank_name' => 'State Bank of India',
            'bank_branch' => 'IIT Indore Branch',
            'ifsc_code' => 'SBIN0001234',
            'salary_account_number' => '12345678901234',
            'official_email' => 'johndoe@iiti.ac.in',
            'contact_number' => '+919876543210',
            'emergency_contact_number' => '+918765432109',
            'current_address' => 'Faculty Residence, IIT Indore, Indore 453552',
            'permanent_address' => '123 Main Street, Delhi 110001',
            'relocation_claim' => false,
            'is_active' => true,
            'remarks' => 'Dedicated faculty member with excellent research record',
        ]);
    }
}
