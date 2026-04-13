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
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('leave_type', ['CL', 'SL', 'EL', 'ML', 'PL', 'BL', 'OL']);
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_full_day')->default(true);
            $table->text('reason');
            $table->string('attachment_path')->nullable();
            
            // Recommender (HOD or Department Head)
            $table->foreignId('recommender_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('recommender_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('recommender_comment')->nullable();
            $table->timestamp('recommender_approved_at')->nullable();
            
            // Approver (Admin/Dean/Director)
            $table->foreignId('approver_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('approver_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('approver_comment')->nullable();
            $table->timestamp('approver_approved_at')->nullable();
            
            // Calculate total days
            $table->decimal('total_days', 6, 2)->default(0);
            
            $table->timestamps();
            
            // Indexes for faster queries
            $table->index('user_id');
            $table->index('recommender_id');
            $table->index('approver_id');
            $table->index('start_date');
            $table->index('recommender_status');
            $table->index('approver_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};
