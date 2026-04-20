import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import FacultyLayout from '@/Layouts/FacultyLayout';
import AnnexureForm from './Form';
import { ChevronLeft, AlertCircle } from 'lucide-react';

export default function Create({ templates = [], faculty = {} }) {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        setShowForm(true);
    };

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            router.post('/faculty/annexures', {
                template_id: selectedTemplate.id,
                data: formData,
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <FacultyLayout>
            <div className="max-w-4xl mx-auto py-6">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => router.visit('/faculty/annexures')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium text-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Annexures
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Submit New Annexure</h1>
                    <p className="text-gray-600 mt-2">Select a template to begin filling out your annexure form</p>
                </div>

                {/* Template Selection or Form */}
                {!showForm ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates && templates.length > 0 ? (
                            templates.map((template) => (
                                <div
                                    key={template.id}
                                    onClick={() => handleTemplateSelect(template)}
                                    className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-400 hover:shadow-md cursor-pointer transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                                            <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                                        </div>
                                        <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                            →
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <AlertCircle className="w-5 h-5 text-yellow-600 inline mr-2" />
                                <span className="text-yellow-700">No templates available. Please contact administration.</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <button
                            onClick={() => setShowForm(false)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium text-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Choose Different Template
                        </button>
                        <AnnexureForm
                            template={selectedTemplate}
                            faculty={faculty}
                            onSubmit={handleFormSubmit}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                )}
            </div>
        </FacultyLayout>
    );
}
