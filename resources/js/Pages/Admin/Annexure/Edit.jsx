import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { AlertCircle } from 'lucide-react';
import DynamicForm from '@/Components/DynamicForm';

export default function EditAdminAnnexure({ annexure, template }) {
    const [formData, setFormData] = useState(annexure?.content || {});
    const { post, processing } = useForm();

    const handleFormChange = (newData) => {
        setFormData(newData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!confirm('Save changes to this annexure?')) {
            return;
        }

        post(route('admin.annexures.update', annexure.id), {
            content: formData,
            onSuccess: () => {
                window.location.href = route('admin.annexures.show', annexure.id);
            },
        });
    };

    const schema = template?.schema || {};
    const uiSchema = template?.ui_schema || {};

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-gray-900">
                    Edit Annexure: {annexure.name}
                </h2>
            }
        >
            <div className="max-w-5xl mx-auto">
                {/* Info */}
                <Card className="mb-6 bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                            <div>
                                <p className="font-semibold text-blue-900">Admin Edit Mode</p>
                                <p className="text-sm text-blue-800 mt-1">
                                    You are editing this annexure as an administrator. Any changes will
                                    create a new version and be logged in the activity history.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>{template?.name || 'Annexure Form'}</CardTitle>
                        <p className="text-sm text-gray-600 mt-2">
                            {template?.description}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
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
                                <Button type="submit" disabled={processing} className="flex-1">
                                    {processing ? 'Saving...' : 'Save Changes'}
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
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
