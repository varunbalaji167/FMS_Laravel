<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Annexure Templates
        Schema::create('annexure_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->text('description')->nullable();
            $table->longText('json_schema');
            $table->longText('html_template');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('version')->default(1);
            $table->timestamps();
            $table->softDeletes();
            $table->index('status');
        });

        // Annexure Requests (Main workflow records)
        Schema::create('annexure_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('annexure_template_id')->constrained('annexure_templates')->onDelete('restrict');
            $table->string('reference_number')->unique();
            $table->string('title')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'submitted', 'under_review', 'pending_revision', 'approved', 'rejected', 'signed', 'archived'])->default('draft');
            $table->unsignedBigInteger('current_version_id')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->integer('revision_count')->default(0);
            $table->text('revision_reason')->nullable();
            $table->text('admin_comments')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'status']);
            $table->index(['annexure_template_id', 'status']);
            $table->index(['assigned_to', 'status']);
            $table->index('submitted_at');
        });

        // Annexure Data (Form submission data versions)
        Schema::create('annexure_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annexure_request_id')->constrained('annexure_requests')->onDelete('cascade');
            $table->integer('version')->default(1);
            $table->longText('form_data');
            $table->text('change_notes')->nullable();
            $table->string('changed_by')->nullable();
            $table->timestamps();
            $table->index(['annexure_request_id', 'version']);
        });

        // Annexure Versions (PDF versions)
        Schema::create('annexure_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annexure_request_id')->constrained('annexure_requests')->onDelete('cascade');
            $table->integer('version_number');
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->integer('file_size')->nullable();
            $table->enum('status', ['generated', 'signed', 'archived'])->default('generated');
            $table->longText('signature_data')->nullable();
            $table->enum('signature_type', ['drawn', 'uploaded'])->nullable();
            $table->foreignId('signed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('signed_at')->nullable();
            $table->timestamp('generated_at');
            $table->timestamps();
            $table->index(['annexure_request_id', 'version_number']);
            $table->index('status');
        });

        // Audit Log (Immutable)
        Schema::create('annexure_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annexure_request_id')->constrained('annexure_requests')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->string('action');
            $table->text('description')->nullable();
            $table->json('previous_state')->nullable();
            $table->json('new_state')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
            $table->index(['annexure_request_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index('action');
        });

        // Add foreign key for current_version_id now that annexure_versions exists
        Schema::table('annexure_requests', function (Blueprint $table) {
            $table->foreign('current_version_id')->references('id')->on('annexure_versions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('annexure_requests', function (Blueprint $table) {
            $table->dropForeign(['current_version_id']);
        });
        Schema::dropIfExists('annexure_audit_logs');
        Schema::dropIfExists('annexure_versions');
        Schema::dropIfExists('annexure_data');
        Schema::dropIfExists('annexure_requests');
        Schema::dropIfExists('annexure_templates');
    }
};
