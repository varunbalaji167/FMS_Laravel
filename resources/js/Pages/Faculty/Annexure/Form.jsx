import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { AlertCircle, FileText, Save, Eye } from 'lucide-react';
import AnnexurePdfPreview from '@/Components/AnnexurePdfPreview';

export default function AnnexureForm({ 
    initialData = {}, 
    template, 
    faculty,
    onSubmit,
    isSubmitting = false 
}) {
    const [formData, setFormData] = useState({});
    const [activeSection, setActiveSection] = useState(0);
    const [missingFields, setMissingFields] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

    // Auto-fill fields from database
    useEffect(() => {
        if (template && faculty) {
            // Handle both string and object formats for json_schema
            const schema = typeof template.json_schema === 'string' 
                ? JSON.parse(template.json_schema)
                : template.json_schema;
            const autoFillData = { ...initialData };
            const missing = [];

            schema.sections?.forEach(section => {
                section.fields?.forEach(field => {
                    if (field.auto_fill) {
                        // Map database field to form field
                        let value = faculty[field.auto_fill];
                        
                        // Handle date formatting
                        if (field.type === 'date' && value) {
                            // Handle ISO date strings and date objects
                            if (value instanceof Date) {
                                value = value.toISOString().split('T')[0];
                            } else if (typeof value === 'string') {
                                value = value.split('T')[0];
                            }
                        }

                        // Only set if value exists
                        if (value) {
                            autoFillData[field.name] = value;
                        }

                        // Track missing required auto-fill fields
                        if (field.required && (!value || value === '')) {
                            missing.push(field.name);
                        }
                    }
                });
            });

            setFormData(autoFillData);
            setMissingFields(missing);
        }
    }, [template, faculty]);

    const handleFieldChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Remove from missing fields if now filled
        if (value && missingFields.includes(fieldName)) {
            setMissingFields(prev => prev.filter(f => f !== fieldName));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        const schema = typeof template.json_schema === 'string' 
            ? JSON.parse(template.json_schema)
            : template.json_schema;
        const requiredFields = [];

        schema.sections?.forEach(section => {
            section.fields?.forEach(field => {
                if (field.required && !formData[field.name]) {
                    requiredFields.push(field.label);
                }
            });
        });

        if (requiredFields.length > 0) {
            alert(`Please fill required fields:\n${requiredFields.join('\n')}`);
            return;
        }

        onSubmit(formData);
    };

    if (!template) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <AlertCircle className="w-5 h-5 text-yellow-600 inline mr-2" />
                <span className="text-yellow-700">No template selected</span>
            </div>
        );
    }

    const schema = typeof template.json_schema === 'string' 
        ? JSON.parse(template.json_schema)
        : template.json_schema;
    const sections = schema.sections || [];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    </div>
                </div>
            </div>

            {/* Form Sections */}
            <form onSubmit={handleSubmit} className="p-6">
                {sections.length > 1 && (
                    <div className="flex gap-2 mb-6 border-b border-gray-200 pb-4">
                        {sections.map((section, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveSection(idx)}
                                className={`px-4 py-2 rounded text-sm font-medium transition ${
                                    activeSection === idx
                                        ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {section.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Active Section */}
                {sections[activeSection] && (
                    <div className="space-y-6">
                        <h4 className="text-base font-semibold text-gray-900 mb-4">
                            {sections[activeSection].name}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {sections[activeSection].fields?.map((field, idx) => (
                                <div key={idx} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                        {field.readonly && (
                                            <span className="text-gray-500 text-xs ml-2 font-normal">(Auto-filled)</span>
                                        )}
                                    </label>

                                    {field.type === 'text' && (
                                        <input
                                            type="text"
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            readOnly={field.readonly}
                                            className={`w-full px-3 py-2 border rounded-lg text-sm transition ${
                                                field.readonly
                                                    ? 'bg-gray-100 border-gray-300 text-gray-600'
                                                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            }`}
                                        />
                                    )}

                                    {field.type === 'email' && (
                                        <input
                                            type="email"
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    )}

                                    {field.type === 'tel' && (
                                        <input
                                            type="tel"
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    )}

                                    {field.type === 'date' && (
                                        <input
                                            type="date"
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            readOnly={field.readonly}
                                            className={`w-full px-3 py-2 border rounded-lg text-sm transition ${
                                                field.readonly
                                                    ? 'bg-gray-100 border-gray-300 text-gray-600'
                                                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            }`}
                                        />
                                    )}

                                    {field.type === 'number' && (
                                        <input
                                            type="number"
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    )}

                                    {field.type === 'select' && (
                                        <select
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options?.map((opt, i) => (
                                                <option key={i} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    )}

                                    {field.type === 'textarea' && (
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => setShowPreview((prev) => !prev)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm"
                    >
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Hide PDF Preview' : 'Review PDF Preview'}
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium text-sm"
                    >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? 'Saving...' : 'Save & Submit'}
                    </button>
                </div>

                {showPreview && (
                    <div className="mt-6">
                        <div className="mb-2 text-sm font-semibold text-gray-800">PDF Preview (Faculty Copy)</div>
                        <AnnexurePdfPreview template={template} formData={formData} />
                    </div>
                )}
            </form>
        </div>
    );
}
