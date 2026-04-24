<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\LeaveBalance;
use App\Models\LeaveLedger;
use App\Models\Leave;
use Illuminate\Database\Seeder;

class LeaveBalanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();
        $currentYear = now()->year;

        foreach ($users as $user) {
            // Create leave balances and ledger entries for each leave type
            foreach (Leave::LEAVE_TYPES as $leaveType => $leaveInfo) {
                LeaveBalance::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'leave_type' => $leaveType,
                        'year' => $currentYear,
                    ],
                    [
                        'total_allocated' => $leaveInfo['annual'],
                        'used' => 0,
                        'pending' => 0,
                        'balance' => $leaveInfo['annual'],
                    ]
                );

                // Create initial allocation ledger entry if not exists
                LeaveLedger::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'leave_type' => $leaveType,
                        'reason' => LeaveLedger::REASON_ALLOCATION,
                        'leave_request_id' => null,
                    ],
                    [
                        'change' => $leaveInfo['annual'],
                        'created_at' => now(),
                    ]
                );
            }
        }

        $this->command->info('Leave balances initialized successfully!');
    }
}
