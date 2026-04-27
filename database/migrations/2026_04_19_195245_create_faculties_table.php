<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('full_name');
            $table->string('avatar_url')->nullable();
            $table->string('department')->nullable();
            $table->string('employee_id')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('ptn')->nullable(); // PTN
            $table->string('idn')->nullable(); // IDN
            $table->string('designation_at_joining')->nullable();
            $table->date('doj')->nullable(); // Date of Joining
            $table->date('confirmation_date')->nullable();
            $table->string('present_designation')->nullable();
            $table->date('present_tenure_doj')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->date('retirement_date')->nullable();
            $table->date('phd_date')->nullable();
            $table->string('phd_university')->nullable();
            $table->string('pan_number')->nullable();
            $table->string('aadhar_number')->nullable();
            $table->string('passport_number')->nullable();
            $table->string('pran_number')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->string('category')->nullable(); // SC, ST, OBC, General
            $table->string('nationality')->default('Indian');
            $table->string('religion')->nullable();
            $table->enum('marital_status', ['Single', 'Married', 'Divorced', 'Widowed'])->nullable();
            $table->string('blood_group')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_branch')->nullable();
            $table->string('ifsc_code')->nullable();
            $table->string('salary_account_number')->nullable();
            $table->string('official_email')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('emergency_contact_number')->nullable();
            $table->text('current_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->boolean('relocation_claim')->default(false);
            $table->boolean('is_active')->default(true);
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};
