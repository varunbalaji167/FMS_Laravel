<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnnexureTemplateSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Clear existing templates
        DB::table('annexure_templates')->truncate();
        
        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $templates = [
            [
                'name' => 'Address Proof Certificate',
                'code' => 'ADDRESS_PROOF',
                'description' => 'Official address proof certificate from Office of Faculty Affairs',
                'json_schema' => json_encode([
                    'auto_fill_fields' => ['name', 'designation', 'department', 'doj'],
                    'sections' => [
                        [
                            'name' => 'Faculty Information (Auto-filled)',
                            'fields' => [
                                ['name' => 'faculty_name', 'label' => 'Faculty Name', 'type' => 'text', 'required' => true, 'auto_fill' => 'name', 'readonly' => true],
                                ['name' => 'doj', 'label' => 'Date of Joining', 'type' => 'date', 'required' => true, 'auto_fill' => 'doj', 'readonly' => true],
                                ['name' => 'designation', 'label' => 'Designation', 'type' => 'text', 'required' => true, 'auto_fill' => 'designation', 'readonly' => true],
                                ['name' => 'department', 'label' => 'Department', 'type' => 'text', 'required' => true, 'auto_fill' => 'department', 'readonly' => true],
                            ]
                        ],
                        [
                            'name' => 'Address Details',
                            'fields' => [
                                ['name' => 'address', 'label' => 'Residential Address (Hindi)', 'type' => 'textarea', 'required' => true],
                                ['name' => 'address_english', 'label' => 'Residential Address (English)', 'type' => 'textarea', 'required' => true],
                            ]
                        ]
                    ]
                ]),
                'html_template' => '<div class="form-section"><h3>Address Proof Certificate</h3></div>',
                'status' => 'active',
                'version' => 1,
            ],
            [
                'name' => 'Annexure A - Passport Identity Certificate',
                'code' => 'ANNEXURE_A_PASSPORT',
                'description' => 'Identity certificate for passport application',
                'json_schema' => json_encode([
                    'auto_fill_fields' => ['name', 'father_name', 'doj', 'designation', 'department'],
                    'sections' => [
                        [
                            'name' => 'Faculty Information (Auto-filled)',
                            'fields' => [
                                ['name' => 'faculty_name', 'label' => 'Faculty Name', 'type' => 'text', 'required' => true, 'auto_fill' => 'name', 'readonly' => true],
                                ['name' => 'father_name', 'label' => 'Father\'s Name', 'type' => 'text', 'required' => true, 'auto_fill' => 'father_name'],
                                ['name' => 'doj', 'label' => 'Date of Joining', 'type' => 'date', 'required' => true, 'auto_fill' => 'doj', 'readonly' => true],
                                ['name' => 'designation', 'label' => 'Designation', 'type' => 'text', 'required' => true, 'auto_fill' => 'designation', 'readonly' => true],
                                ['name' => 'department', 'label' => 'Department', 'type' => 'text', 'required' => true, 'auto_fill' => 'department', 'readonly' => true],
                            ]
                        ],
                        [
                            'name' => 'Dependent Information',
                            'fields' => [
                                ['name' => 'dependent_name', 'label' => 'Dependent Name', 'type' => 'text', 'required' => true],
                                ['name' => 'dependent_relation', 'label' => 'Relationship', 'type' => 'select', 'required' => true, 'options' => ['Spouse', 'Daughter', 'Son', 'Parent', 'Other']],
                            ]
                        ]
                    ]
                ]),
                'html_template' => '<div class="form-section"><h3>Annexure A - Passport Identity Certificate</h3></div>',
                'status' => 'active',
                'version' => 1,
            ],
            [
                'name' => 'NOC for VISA - International Travel',
                'code' => 'NOC_VISA',
                'description' => 'No Objection Certificate for international travel and visa application',
                'json_schema' => json_encode([
                    'auto_fill_fields' => ['name', 'designation', 'department', 'doj'],
                    'sections' => [
                        [
                            'name' => 'Faculty Information (Auto-filled)',
                            'fields' => [
                                ['name' => 'faculty_name', 'label' => 'Faculty Name', 'type' => 'text', 'required' => true, 'auto_fill' => 'name', 'readonly' => true],
                                ['name' => 'designation', 'label' => 'Current Designation', 'type' => 'text', 'required' => true, 'auto_fill' => 'designation', 'readonly' => true],
                                ['name' => 'department', 'label' => 'Department', 'type' => 'text', 'required' => true, 'auto_fill' => 'department', 'readonly' => true],
                                ['name' => 'doj', 'label' => 'Date of Joining', 'type' => 'date', 'required' => true, 'auto_fill' => 'doj', 'readonly' => true],
                            ]
                        ],
                        [
                            'name' => 'Travel Details',
                            'fields' => [
                                ['name' => 'passport_number', 'label' => 'Passport Number', 'type' => 'text', 'required' => true],
                                ['name' => 'destination_country', 'label' => 'Destination Country', 'type' => 'text', 'required' => true],
                                ['name' => 'travel_purpose', 'label' => 'Purpose of Travel', 'type' => 'textarea', 'required' => true],
                                ['name' => 'travel_dates', 'label' => 'Travel Dates (From - To)', 'type' => 'text', 'required' => true],
                                ['name' => 'duration', 'label' => 'Duration (in days)', 'type' => 'number', 'required' => true],
                            ]
                        ]
                    ]
                ]),
                'html_template' => '<div class="form-section"><h3>NOC for VISA - International Travel</h3></div>',
                'status' => 'active',
                'version' => 1,
            ],
            [
                'name' => 'Bonafide Certificate',
                'code' => 'BONAFIDE_CERT',
                'description' => 'Official bonafide certificate for workplace and dependents',
                'json_schema' => json_encode([
                    'auto_fill_fields' => ['name', 'designation', 'department', 'doj'],
                    'sections' => [
                        [
                            'name' => 'Employee Information (Auto-filled)',
                            'fields' => [
                                ['name' => 'employee_name', 'label' => 'Name of Employee', 'type' => 'text', 'required' => true, 'auto_fill' => 'name', 'readonly' => true],
                                ['name' => 'current_designation', 'label' => 'Current Designation', 'type' => 'text', 'required' => true, 'auto_fill' => 'designation', 'readonly' => true],
                                ['name' => 'department', 'label' => 'Department', 'type' => 'text', 'required' => true, 'auto_fill' => 'department', 'readonly' => true],
                                ['name' => 'doj', 'label' => 'Date of Joining', 'type' => 'date', 'required' => true, 'auto_fill' => 'doj', 'readonly' => true],
                            ]
                        ],
                        [
                            'name' => 'Dependent Information',
                            'fields' => [
                                ['name' => 'dependent_name', 'label' => 'Dependent Name', 'type' => 'text', 'required' => true],
                                ['name' => 'dependent_relation', 'label' => 'Relationship', 'type' => 'select', 'required' => true, 'options' => ['Spouse', 'Daughter', 'Son', 'Parent', 'Other']],
                                ['name' => 'reason', 'label' => 'Reason/Purpose of Certificate', 'type' => 'textarea', 'required' => true],
                            ]
                        ]
                    ]
                ]),
                'html_template' => '<div class="form-section"><h3>Bonafide Certificate</h3></div>',
                'status' => 'active',
                'version' => 1,
            ],
            [
                'name' => 'Annexure H - Prior Intimation for Passport',
                'code' => 'ANNEXURE_H_PASSPORT',
                'description' => 'Prior Intimation Letter from Government/PSU Employee to Administrative Office for Passport Application',
                'json_schema' => json_encode([
                    'auto_fill_fields' => ['name', 'designation', 'department', 'office_address'],
                    'sections' => [
                        [
                            'name' => 'Employee Information (Auto-filled)',
                            'fields' => [
                                ['name' => 'employee_name', 'label' => 'Employee Name', 'type' => 'text', 'required' => true, 'auto_fill' => 'name', 'readonly' => true],
                                ['name' => 'designation', 'label' => 'Designation', 'type' => 'text', 'required' => true, 'auto_fill' => 'designation', 'readonly' => true],
                                ['name' => 'office_address', 'label' => 'Office Address', 'type' => 'textarea', 'required' => true, 'auto_fill' => 'office_address', 'readonly' => true],
                                ['name' => 'office_contact', 'label' => 'Office Contact Number', 'type' => 'tel', 'required' => true],
                            ]
                        ],
                        [
                            'name' => 'Passport Details',
                            'fields' => [
                                ['name' => 'passport_type', 'label' => 'Type of Passport', 'type' => 'select', 'required' => true, 'options' => ['Ordinary', 'Official', 'Diplomatic']],
                                ['name' => 'date_of_birth', 'label' => 'Date of Birth', 'type' => 'date', 'required' => true, 'auto_fill' => 'date_of_birth'],
                                ['name' => 'residential_address', 'label' => 'Residential Address', 'type' => 'textarea', 'required' => true],
                                ['name' => 'office_seal_date', 'label' => 'Date for Office Seal', 'type' => 'date', 'required' => true],
                            ]
                        ]
                    ]
                ]),
                'html_template' => '<div class="form-section"><h3>Annexure H - Prior Intimation for Passport</h3></div>',
                'status' => 'active',
                'version' => 1,
            ],
        ];

        foreach ($templates as $template) {
            DB::table('annexure_templates')->insert($template);
        }

        echo "✓ Seeded 5 government annexure templates\n";
    }
}
