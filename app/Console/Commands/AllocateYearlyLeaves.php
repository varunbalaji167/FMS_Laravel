<?php

namespace App\Console\Commands;

use App\Models\LeaveLedger;
use App\Models\LeaveBalance;
use App\Models\User;
use App\Models\Leave;
use Illuminate\Console\Command;

class AllocateYearlyLeaves extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leaves:allocate-yearly {--year=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Allocate yearly leave allocations to all users at the start of the year';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $year = $this->option('year') ?? date('Y');

        $this->info("Allocating yearly leaves for {$year}...");

        // Get all users (typically faculty/staff)
        $users = User::where('role', 'faculty')->get();

        $totalAllocations = 0;

        foreach ($users as $user) {
            foreach (Leave::LEAVE_TYPES as $leaveType => $details) {
                // Get or create balance record
                $balance = LeaveBalance::getOrCreate($user->id, $leaveType, $year);

                // Check if allocation already exists
                $existingAllocation = LeaveLedger::where('user_id', $user->id)
                    ->where('leave_type', $leaveType)
                    ->where('reason', LeaveLedger::REASON_ALLOCATION)
                    ->whereYear('created_at', $year)
                    ->exists();

                if (!$existingAllocation) {
                    // Create allocation ledger entry
                    LeaveLedger::recordEntry(
                        $user->id,
                        $leaveType,
                        $details['annual'],
                        LeaveLedger::REASON_ALLOCATION
                    );

                    $totalAllocations++;
                    $this->line("  ✓ Allocated {$details['annual']} days of {$details['name']} to {$user->email}");
                }

                // Ensure balance is computed
                $balance->computeFromLedger()->save();
            }
        }

        $this->info("✓ Total allocations created: {$totalAllocations}");
        $this->info("✓ Yearly leave allocation completed for {$year}!");
    }
}
