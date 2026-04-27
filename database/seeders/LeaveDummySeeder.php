<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveDummySeeder extends Seeder
{
    public function run(): void
    {
        // Sample leave applications for faculty user (user_id = 3)
        
        // Leave 1: Casual Leave - Approved
        DB::table('leaves')->insert([
            'user_id' => 3,
            'leave_type' => 'CL',
            'start_date' => '2026-04-01',
            'end_date' => '2026-04-01',
            'is_full_day' => true,
            'reason' => 'Personal work',
            'attachment_path' => null,
            'recommender_id' => 2, // HOD user_id
            'recommender_status' => 'approved',
            'recommender_comment' => 'Approved',
            'recommender_approved_at' => now(),
            'approver_id' => 1, // Admin user_id
            'approver_status' => 'approved',
            'approver_comment' => 'Approved by admin',
            'approver_approved_at' => now(),
            'total_days' => 1.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Leave 2: Earned Leave - Approved
        DB::table('leaves')->insert([
            'user_id' => 3,
            'leave_type' => 'EL',
            'start_date' => '2026-04-10',
            'end_date' => '2026-04-12',
            'is_full_day' => true,
            'reason' => 'Annual vacation',
            'attachment_path' => null,
            'recommender_id' => 2,
            'recommender_status' => 'approved',
            'recommender_comment' => 'Good',
            'recommender_approved_at' => now(),
            'approver_id' => 1,
            'approver_status' => 'approved',
            'approver_comment' => 'Approved',
            'approver_approved_at' => now(),
            'total_days' => 3.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Leave 3: Casual Leave - Pending Approver
        DB::table('leaves')->insert([
            'user_id' => 3,
            'leave_type' => 'CL',
            'start_date' => '2026-05-01',
            'end_date' => '2026-05-01',
            'is_full_day' => true,
            'reason' => 'Family meeting',
            'attachment_path' => null,
            'recommender_id' => 2,
            'recommender_status' => 'approved',
            'recommender_comment' => 'No objection',
            'recommender_approved_at' => now(),
            'approver_id' => null,
            'approver_status' => 'pending',
            'approver_comment' => null,
            'approver_approved_at' => null,
            'total_days' => 1.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Leave 4: Sick Leave - Approved
        DB::table('leaves')->insert([
            'user_id' => 3,
            'leave_type' => 'SL',
            'start_date' => '2026-04-15',
            'end_date' => '2026-04-15',
            'is_full_day' => true,
            'reason' => 'Medical appointment',
            'attachment_path' => null,
            'recommender_id' => 2,
            'recommender_status' => 'approved',
            'recommender_comment' => 'Approved',
            'recommender_approved_at' => now(),
            'approver_id' => 1,
            'approver_status' => 'approved',
            'approver_comment' => 'Approved',
            'approver_approved_at' => now(),
            'total_days' => 1.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Leave 5: Privilege Leave - Approved
        DB::table('leaves')->insert([
            'user_id' => 3,
            'leave_type' => 'PL',
            'start_date' => '2026-05-20',
            'end_date' => '2026-05-21',
            'is_full_day' => true,
            'reason' => 'Travel to home town',
            'attachment_path' => null,
            'recommender_id' => 2,
            'recommender_status' => 'approved',
            'recommender_comment' => 'Approved',
            'recommender_approved_at' => now(),
            'approver_id' => 1,
            'approver_status' => 'approved',
            'approver_comment' => 'Approved',
            'approver_approved_at' => now(),
            'total_days' => 2.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Leave 6: Earned Leave - Pending Recommender
        DB::table('leaves')->insert([
            'user_id' => 3,
            'leave_type' => 'EL',
            'start_date' => '2026-06-01',
            'end_date' => '2026-06-02',
            'is_full_day' => true,
            'reason' => 'Extended vacation',
            'attachment_path' => null,
            'recommender_id' => null,
            'recommender_status' => 'pending',
            'recommender_comment' => null,
            'recommender_approved_at' => null,
            'approver_id' => null,
            'approver_status' => 'pending',
            'approver_comment' => null,
            'approver_approved_at' => null,
            'total_days' => 2.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Leave 7: Casual Leave - Rejected
        DB::table('leaves')->insert([
            'user_id' => 3,
            'leave_type' => 'CL',
            'start_date' => '2026-03-15',
            'end_date' => '2026-03-15',
            'is_full_day' => true,
            'reason' => 'Not necessary',
            'attachment_path' => null,
            'recommender_id' => 2,
            'recommender_status' => 'rejected',
            'recommender_comment' => 'Critical academic period. Rejected.',
            'recommender_approved_at' => now(),
            'approver_id' => null,
            'approver_status' => 'pending',
            'approver_comment' => null,
            'approver_approved_at' => null,
            'total_days' => 1.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
