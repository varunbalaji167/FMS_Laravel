import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, Save, Eye } from 'lucide-react';
import AnnexurePdfPreview from '@/Components/AnnexurePdfPreview';

export default function ReviewAnnexure({ annexure: annexureProp, request, formData = {}, formSchema = [] }) {
    const annexure = annexureProp || request || {};
    const [activeTab, setActiveTab] = useState('edit');
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [processing, setProcessing] = useState(false);

    const content = useMemo(() => {
        const base = annexure.content || formData || {};
        if (typeof base === 'object' && base !== null) return base;
        try {
            return JSON.parse(base);
        } catch {
            return {};
        }
    }, [annexure.content, formData]);

    const [editedData, setEditedData] = useState(content);

    const fields = useMemo(() => {
        if (Array.isArray(formSchema) && formSchema.length > 0) {
            return formSchema;
        }

        return Object.keys(editedData || {}).map((key) => ({
            name: key,
            label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            type: 'text',
        }));
    }, [formSchema, editedData]);

    const handleFieldChange = (name, value) => {
        setEditedData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveEdits = () => {
        setProcessing(true);
        router.patch(
            route('admin.annexures.update', annexure.id),
            {
                form_data: editedData,
            },
            {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            }
        );
    };

    const handleApprove = () => {
        if (confirm('Approve this annexure?')) {
            setProcessing(true);
            router.post(
                route('admin.annexures.approve', annexure.id),
                {
                    comments: '',
                },
                {
                    onFinish: () => setProcessing(false),
                    onSuccess: () => {
                        window.location.href = route('admin.annexures.index');
                    },
                },
            );
        }
    };

    const handleReject = () => {
        if (!rejectReason.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }
        if (confirm('Reject this annexure?')) {
            setProcessing(true);
            router.post(
                route('admin.annexures.reject', annexure.id),
                {
                    reason: rejectReason,
                },
                {
                    onFinish: () => setProcessing(false),
                    onSuccess: () => {
                        window.location.href = route('admin.annexures.index');
                    },
                }
            );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Review Annexure</h2>
                    <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Under Review
                    </Badge>
                </div>
            }
        >
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-6">
                        <button
                            className={`py-2 px-1 text-sm ${activeTab === 'edit' ? 'text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('edit')}
                        >
                            Edit Fields
                        </button>
                        <button
                            className={`py-2 px-1 text-sm ${activeTab === 'preview' ? 'text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('preview')}
                        >
                            PDF Preview
                        </button>
                        <button
                            className={`py-2 px-1 text-sm ${activeTab === 'actions' ? 'text-blue-700 border-b-2 border-blue-600 font-semibold' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('actions')}
                        >
                            Review Actions
                        </button>
                    </div>
                </div>

                {/* Submission Info */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Submission Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600">Faculty Name</p>
                                <p className="font-semibold">{annexure.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold">{annexure.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Document Type</p>
                                <p className="font-semibold">{annexure.template?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Submitted On</p>
                                <p className="font-semibold">
                                    {annexure.submitted_at ? new Date(annexure.submitted_at).toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {activeTab === 'edit' && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Edit Submitted Data (Admin Access)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {fields.map((field) => {
                                    const name = field.name;
                                    const label = field.label || name;
                                    const value = editedData?.[name] ?? '';
                                    const type = field.type || 'text';

                                    return (
                                        <div key={name} className={type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>

                                            {type === 'textarea' ? (
                                                <textarea
                                                    value={value}
                                                    onChange={(e) => handleFieldChange(name, e.target.value)}
                                                    rows={4}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                            ) : type === 'select' ? (
                                                <select
                                                    value={value}
                                                    onChange={(e) => handleFieldChange(name, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                >
                                                    <option value="">Select {label}</option>
                                                    {(field.options || []).map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={type}
                                                    value={value}
                                                    onChange={(e) => handleFieldChange(name, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6">
                                <Button onClick={handleSaveEdits} disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save All Edits'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'preview' && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" /> PDF Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AnnexurePdfPreview template={annexure.template} formData={editedData} />
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'actions' && (
                <div className="grid grid-cols-2 gap-6">
                    {/* Approve */}
                    <Card className="border-2 border-green-200 bg-green-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-900">
                                <CheckCircle className="w-5 h-5" />
                                Approve
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-green-800 mb-4">
                                Approve this annexure. The faculty will be notified and can proceed to sign.
                            </p>
                            <Button
                                onClick={handleApprove}
                                disabled={processing}
                                className="w-full bg-green-600 hover:bg-green-700"
                            >
                                {processing ? 'Processing...' : 'Approve Annexure'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Reject */}
                    <Card className="border-2 border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-900">
                                <XCircle className="w-5 h-5" />
                                Reject
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-red-800 mb-4">
                                Reject this annexure. The faculty will need to correct and resubmit.
                            </p>
                            {!showRejectForm ? (
                                <Button
                                    onClick={() => setShowRejectForm(true)}
                                    className="w-full bg-red-600 hover:bg-red-700"
                                >
                                    Reject Annexure
                                </Button>
                            ) : (
                                <div className="space-y-3">
                                    <textarea
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        placeholder="Provide a reason for rejection..."
                                        className="w-full px-3 py-2 border border-red-300 rounded text-sm"
                                        rows="3"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleReject}
                                            disabled={processing}
                                            className="flex-1 bg-red-600 hover:bg-red-700"
                                        >
                                            {processing ? 'Processing...' : 'Confirm Rejection'}
                                        </Button>
                                        <Button
                                            onClick={() => setShowRejectForm(false)}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
