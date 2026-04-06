<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create the Master Admin
        User::factory()->create([
            'name' => 'System Administrator',
            'email' => 'admin@iiti.ac.in',
            'role' => 'admin',
        ]);

        // 2. Create a Department HOD
        User::factory()->create([
            'name' => 'Dr. Ranveer Singh',
            'email' => 'hod.cse@iiti.ac.in',
            'role' => 'hod',
        ]);

        // 3. Create a General Faculty Member
        User::factory()->create([
            'name' => 'Dr. Sasank Mouli',
            'email' => 'user@iiti.ac.in',
            'role' => 'faculty',
        ]);
    }
}