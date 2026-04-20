<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Faculty;
use Illuminate\Console\Command;

class VerifySeededData extends Command
{
    protected $signature = 'verify:seeded-data';
    protected $description = 'Verify the seeded data in the database';

    public function handle()
    {
        $this->info('=== SEEDED USERS ===');
        $users = User::all();
        foreach ($users as $user) {
            $this->line("ID: {$user->id} | Name: {$user->name} | Email: {$user->email} | Role: {$user->role}");
        }

        $this->info("\n=== SEEDED FACULTIES ===");
        $faculties = Faculty::all();
        foreach ($faculties as $faculty) {
            $this->line("ID: {$faculty->id} | Full Name: {$faculty->full_name} | Department: {$faculty->department} | Employee ID: {$faculty->employee_id}");
            $this->line("  Contact: {$faculty->contact_number} | Official Email: {$faculty->official_email}");
            $this->line("  DOJ: {$faculty->doj} | Designation: {$faculty->present_designation}");
        }

        $this->info("\n✓ Data verification complete!");
    }
}
