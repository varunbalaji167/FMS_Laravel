<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Only run UserSeeder if no users exist
        if (User::count() === 0) {
            $this->call([
                UserSeeder::class,
            ]);
        }
        
        // Always run leave seeders
        $this->call([
            LeaveBalanceDummySeeder::class,
            LeaveDummySeeder::class,
            AnnexureTemplateSeeder::class,
            DependentSeeder::class,
            AnnouncementSeeder::class,
        ]);
    }
}
