<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leave_ledger', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('leave_type', ['CL', 'SL', 'EL', 'ML', 'PL', 'BL', 'OL']);
            
            // Change can be positive (allocation, cancellation, early return, comp-off) 
            // or negative (leave taken, late return/LWP)
            $table->decimal('change', 6, 2);
            
            // Reason for the ledger entry
            $table->enum('reason', [
                'allocation',      // Annual allocation at year start
                'leave_taken',     // Leave approved and taken
                'leave_cancelled', // Leave cancelled by user
                'early_return',    // User returned early, balance credited
                'late_return',     // User returned late, balance debited
                'comp_off',        // Compensatory off given
                'correction',      // Manual correction by admin
            ]);
            
            // Optional reference to leave_request if related
            $table->foreignId('leave_request_id')->nullable()->constrained('leaves')->onDelete('cascade');
            
            // Track when this ledger entry was created
            $table->timestamp('created_at')->useCurrent();
            
            // Indexes for fast queries
            $table->index('user_id');
            $table->index(['user_id', 'leave_type']);
            $table->index(['user_id', 'leave_type', 'created_at']);
            $table->index('reason');
            $table->index('leave_request_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_ledger');
    }
};
