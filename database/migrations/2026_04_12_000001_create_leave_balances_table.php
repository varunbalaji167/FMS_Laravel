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
        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('leave_type', ['CL', 'SL', 'EL', 'ML', 'PL', 'BL', 'OL']);
            $table->decimal('total_allocated', 6, 2); // Total days allocated for the year
            $table->decimal('used', 6, 2)->default(0); // Days already used
            $table->decimal('pending', 6, 2)->default(0); // Days pending approval
            $table->decimal('balance', 6, 2); // Available balance
            $table->integer('year');
            $table->timestamps();
            
            // Composite unique constraint
            $table->unique(['user_id', 'leave_type', 'year']);
            
            // Indexes
            $table->index('user_id');
            $table->index('year');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};
