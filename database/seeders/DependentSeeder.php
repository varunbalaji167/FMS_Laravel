<?php

namespace Database\Seeders;

use App\Models\Dependent;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DependentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find Dr. John Doe
        $johnDoe = User::where('name', 'Dr. John Doe')->first();

        if ($johnDoe) {
            Dependent::create([
                'user_id' => $johnDoe->id,
                'name' => 'Mrs. Sarah Doe',
                'relationship' => 'spouse',
                'date_of_birth' => '1980-05-15',
                'contact_number' => '9876543210',
                'email' => 'sarah.doe@email.com',
                'address' => '123 Faculty Housing, IIT Indore Campus, Indore 453552',
                'aadhar_number' => '123456789012',
            ]);

            Dependent::create([
                'user_id' => $johnDoe->id,
                'name' => 'Mark Doe',
                'relationship' => 'son',
                'date_of_birth' => '2010-03-22',
                'contact_number' => '9876543211',
                'email' => 'mark.doe@email.com',
                'address' => '123 Faculty Housing, IIT Indore Campus, Indore 453552',
                'aadhar_number' => '123456789013',
            ]);

            Dependent::create([
                'user_id' => $johnDoe->id,
                'name' => 'Emma Doe',
                'relationship' => 'daughter',
                'date_of_birth' => '2012-07-18',
                'contact_number' => null,
                'email' => 'emma.doe@email.com',
                'address' => '123 Faculty Housing, IIT Indore Campus, Indore 453552',
                'aadhar_number' => '123456789014',
            ]);

            Dependent::create([
                'user_id' => $johnDoe->id,
                'name' => 'Dr. Robert Doe',
                'relationship' => 'father',
                'date_of_birth' => '1955-12-08',
                'contact_number' => '9876543212',
                'email' => 'robert.doe@email.com',
                'address' => '456 Senior Citizen Colony, Indore 453001',
                'aadhar_number' => '123456789015',
            ]);

            Dependent::create([
                'user_id' => $johnDoe->id,
                'name' => 'Mrs. Patricia Doe',
                'relationship' => 'mother',
                'date_of_birth' => '1960-08-20',
                'contact_number' => '9876543213',
                'email' => null,
                'address' => '456 Senior Citizen Colony, Indore 453001',
                'aadhar_number' => '123456789016',
            ]);
        }
    }
}
