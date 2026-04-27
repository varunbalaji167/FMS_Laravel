<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $hod = User::where('role', 'hod')->first();

        if ($admin) {
            Announcement::firstOrCreate(
                ['title' => 'Faculty Meeting Schedule'],
                [
                    'user_id' => $admin->id,
                    'body' => 'All faculty members are requested to attend the monthly academic review meeting on Friday at 3:00 PM in the conference hall.',
                    'audience' => 'faculty',
                    'is_active' => true,
                    'published_at' => now(),
                ]
            );
        }

        if ($hod) {
            Announcement::firstOrCreate(
                ['title' => 'Department Submission Reminder'],
                [
                    'user_id' => $hod->id,
                    'body' => 'Please submit updated leave plans and pending academic documents before the end of this week.',
                    'audience' => 'faculty',
                    'is_active' => true,
                    'published_at' => now(),
                ]
            );
        }
    }
}