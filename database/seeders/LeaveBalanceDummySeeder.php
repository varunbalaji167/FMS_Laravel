<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveBalanceDummySeeder extends Seeder
{
    public function run(): void
    {
        // Leave balances for the faculty user (user_id = 3)
        // CL - Casual Leave
        DB::table('leave_balances')->insert([
            'user_id' => 3,
            'leave_type' => 'CL',
            'total_allocated' => 10.00,
            'used' => 2.00,
            'pending' => 1.00,
            'balance' => 7.00,
            'year' => 2026,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // SL - Sick Leave
        DB::table('leave_balances')->insert([
            'user_id' => 3,
            'leave_type' => 'SL',
            'total_allocated' => 10.00,
            'used' => 0.00,
            'pending' => 0.00,
            'balance' => 10.00,
            'year' => 2026,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // EL - Earned Leave
        DB::table('leave_balances')->insert([
            'user_id' => 3,
            'leave_type' => 'EL',
            'total_allocated' => 20.00,
            'used' => 5.00,
            'pending' => 0.00,
            'balance' => 15.00,
            'year' => 2026,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // ML - Medical Leave
        DB::table('leave_balances')->insert([
            'user_id' => 3,
            'leave_type' => 'ML',
            'total_allocated' => 5.00,
            'used' => 0.00,
            'pending' => 0.00,
            'balance' => 5.00,
            'year' => 2026,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // PL - Privilege Leave
        DB::table('leave_balances')->insert([
            'user_id' => 3,
            'leave_type' => 'PL',
            'total_allocated' => 15.00,
            'used' => 3.00,
            'pending' => 2.00,
            'balance' => 10.00,
            'year' => 2026,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // BL - Bereavement Leave
        DB::table('leave_balances')->insert([
            'user_id' => 3,
            'leave_type' => 'BL',
            'total_allocated' => 3.00,
            'used' => 0.00,
            'pending' => 0.00,
            'balance' => 3.00,
            'year' => 2026,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // OL - Other Leave
        DB::table('leave_balances')->insert([
            'user_id' => 3,
            'leave_type' => 'OL',
            'total_allocated' => 5.00,
            'used' => 0.00,
            'pending' => 0.00,
            'balance' => 5.00,
            'year' => 2026,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
