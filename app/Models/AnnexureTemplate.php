<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AnnexureTemplate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'json_schema',
        'html_template',
        'status',
        'version',
    ];

    protected $casts = [
        'json_schema' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function requests()
    {
        return $this->hasMany(AnnexureRequest::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCategory($query, $category)
    {
        // Since the actual schema doesn't have category, we'll filter by code pattern
        // Category is embedded in code like ACADEMIC_CRED, EMPLOYMENT_HIST, etc.
        return $query;
    }

    public function scopeVisibleToFaculty($query)
    {
        // All active templates are visible to faculty
        return $query->where('status', 'active');
    }

    // Methods
    public function getFormFields()
    {
        $schema = $this->json_schema;
        $fields = [];
        
        if (isset($schema['sections']) && is_array($schema['sections'])) {
            foreach ($schema['sections'] as $section) {
                if (isset($section['fields']) && is_array($section['fields'])) {
                    $fields = array_merge($fields, $section['fields']);
                }
            }
        }
        
        return $fields;
    }

    public function getFormSections()
    {
        return $this->json_schema['sections'] ?? [];
    }

    public function validateFormData($formData)
    {
        $errors = [];
        $formData = is_array($formData) ? $formData : [];
        
        foreach ($this->getFormFields() as $field) {
            if (isset($field['required']) && $field['required']) {
                $value = $formData[$field['name']] ?? null;

                $isEmpty = is_null($value)
                    || (is_string($value) && trim($value) === '')
                    || (is_array($value) && count($value) === 0);

                if ($isEmpty) {
                    $errors[$field['name']] = "{$field['label']} is required";
                }
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
        ];
    }
}
