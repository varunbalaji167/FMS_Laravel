import { useState, useEffect, useCallback } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { AlertCircle, Save, Send } from 'lucide-react';
import DynamicForm from '@/Components/DynamicForm';

export default function EditAnnexure({ annexure, template, drafts }) {
    const [formData, setFormData] = useState(annexure?.content || {});
    const [showDraftRestore, setShowDraftRestore] = useState(drafts?.length > 0);
    const [selectedDraft, setSelectedDraft] = useState(null);
    const { post, processing, errors } = useForm();

    // Auto-save functionality
    useEffect(() => {
        const autoSaveTimer = setTimeout(() => {
            if (JSON.stringify(formData) !== JSON.stringify(annexure?.content)) {
                fetch(route('faculty.annexures.update', annexure.id), {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')
                            ?.content,
                    },
                    body: JSON.stringify({
                        content: formData,
                        is_autosave: true,
                    }),
                }).catch((err) => console.error('Auto-save failed:', err));
            }
        }, 3000); // Auto-save every 3 seconds

        return () => clearTimeout(autoSaveTimer);
    }, [formData]);

    const handleFormChange = (newData) => {
        setFormData(newData);
    };

    const handleSaveDraft = (e) => {
        e.preventDefault();
        fetch(route('faculty.annexures.update', annexure.id), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
            },
            body: JSON.stringify({
                content: formData,
                is_autosave: false,
            }),
        })
            .then(() => {
                alert('Draft saved successfully!');
            })
            .catch((err) => {
                alert('Error saving draft: ' + err.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to submit this annexure? You won\'t be able to edit it after submission.')) {
            return;
        }

        // First save the content, then submit
        fetch(route('faculty.annexures.update', annexure.id), {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content,
            },
            body: JSON.stringify({
                content: formData,
                is_autosave: false,
            }),
        })
            .then(() => {
                // Now submit
                post(route('faculty.annexures.submit', annexure.id), {
                    onSuccess: () => {
                        window.location.href = route('faculty.annexures.show', annexure.id);
                    },
                });
            })
            .catch((err) => {
                alert('Error saving draft: ' + err.message);
            });
    };

    const handleRestoreDraft = (draft) => {
        if (
            confirm(
                'Are you sure you want to restore this draft? Current changes will be lost.'
            )
        ) {
            post(route('faculty.annexures.restore-draft', annexure.id), {
                draft_id: draft.id,
                onSuccess: () => {
                    setFormData(draft.content);
                    setSelectedDraft(null);
                },
            });
        }
    };

    const schema = template?.schema || {};
    const uiSchema = template?.ui_schema || {};

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Edit Annexure: {annexure.name}
                    </h2>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded">
                        Draft
                    </span>
                </div>
            }
        >
            <div className="max-w-5xl mx-auto">
                {/* Draft Recovery */}
                {showDraftRestore && drafts.length > 0 && (
                    <Card className="mb-6 bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="flex gap-4">
                                <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-blue-900 mb-2">
                                        Draft Recovery Available
                                    </h3>
                                    <p className="text-sm text-blue-800 mb-3">
                                        You have {drafts.length} saved draft(s). You can restore from any of
                                        them:
                                    </p>
                                    <select
                                        value={selectedDraft?.id || ''}
                                        onChange={(e) => {
                                            const draft = drafts.find((d) => d.id == e.target.value);
                                            setSelectedDraft(draft);
                                        }}
                                        className="block w-full md:w-64 px-3 py-2 border border-blue-300 rounded mb-3 text-sm"
                                    >
                                        <option value="">Select a draft to restore...</option>
                                        {drafts.map((draft) => (
                                            <option key={draft.id} value={draft.id}>
                                                {new Date(draft.created_at).toLocaleString()}
                                                {draft.is_autosave ? ' (Auto-saved)' : ' (Manual)'}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedDraft && (
                                        <Button
                                            onClick={() => handleRestoreDraft(selectedDraft)}
                                            size="sm"
                                            variant="outline"
                                        >
                                            Restore Selected Draft
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{template?.name || 'Annexure Form'}</CardTitle>
                        <p className="text-sm text-gray-600 mt-2">
                            {template?.description}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveDraft}>
                            {Object.keys(schema.properties || {}).length > 0 ? (
                                <DynamicForm
                                    schema={schema}
                                    uiSchema={uiSchema}
                                    formData={formData}
                                    onChange={handleFormChange}
                                />
                            ) : (
                                <div className="p-4 bg-gray-50 rounded text-gray-600">
                                    No fields defined for this template
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-8 flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Draft
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit for Review
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>

                            {/* Info Box */}
                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> Your changes are automatically saved as drafts every 3
                                    seconds. Once you submit this annexure, it will be sent for review and you
                                    won't be able to edit it.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
