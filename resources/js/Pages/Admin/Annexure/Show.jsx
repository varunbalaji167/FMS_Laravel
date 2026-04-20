import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Link } from '@inertiajs/react';
import { Eye, Download, CheckCircle, AlertCircle, History, FileText } from 'lucide-react';
import JsonViewer from '@/Components/JsonViewer';

export default function AdminShowAnnexure({ annexure, isReviewable, isSignable }) {
    const [activeTab, setActiveTab] = useState('details');

    const getStatusColor = (status) => {
        const colors = {
            submitted: 'bg-blue-100 text-blue-800',
            under_review: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            signed: 'bg-purple-100 text-purple-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'signed':
                return <CheckCircle className="w-4 h-4" />;
            case 'rejected':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">{annexure.name}</h2>
                    <Badge className={getStatusColor(annexure.status)}>
                        {getStatusIcon(annexure.status)}
                        <span className="ml-1">{annexure.status.replace('_', ' ')}</span>
                    </Badge>
                </div>
            }
        >
            <div className="max-w-5xl mx-auto">
                {/* Action Buttons */}
                <div className="mb-6 flex gap-3 flex-wrap">
                    {isReviewable && (
                        <Link href={route('admin.annexures.review', annexure)}>
                            <Button variant="outline">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Review & Decide
                            </Button>
                        </Link>
                    )}

                    {isSignable && (
                        <Link href={route('admin.annexures.sign', annexure)}>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <FileText className="w-4 h-4 mr-2" />
                                Sign Document
                            </Button>
                        </Link>
                    )}

                    {annexure.status === 'signed' && (
                        <Link href={route('admin.annexures.download-pdf', annexure)}>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-4">
                        {['details', 'timeline', 'signatures'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                    activeTab === tab
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {tab === 'details' && 'Details'}
                                {tab === 'timeline' && 'Timeline'}
                                {tab === 'signatures' && 'Signatures'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Faculty Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600">Name</p>
                                        <p className="font-semibold">{annexure.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-semibold">{annexure.user?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Role</p>
                                        <p className="font-semibold">{annexure.user?.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Document Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-600">Template Type</p>
                                        <p className="font-semibold">{annexure.template?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className="font-semibold">
                                            {annexure.status.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Submitted</p>
                                        <p className="font-semibold">
                                            {new Date(annexure.submitted_at).toLocaleString()}
                                        </p>
                                    </div>
                                    {annexure.reviewed_at && (
                                        <div>
                                            <p className="text-sm text-gray-600">Reviewed</p>
                                            <p className="font-semibold">
                                                {new Date(annexure.reviewed_at).toLocaleString()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Submitted Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <JsonViewer data={annexure.content} />
                            </CardContent>
                        </Card>
                    </>
                )}

                {/* Timeline Tab */}
                {activeTab === 'timeline' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="w-5 h-5" />
                                Activity Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {annexure.activities && annexure.activities.length > 0 ? (
                                <div className="space-y-4">
                                    {annexure.activities.map((activity, index) => (
                                        <div key={activity.id} className="relative pb-4">
                                            {index < annexure.activities.length - 1 && (
                                                <div className="absolute left-6 top-10 w-0.5 h-8 bg-gray-200"></div>
                                            )}
                                            <div className="flex gap-4">
                                                <div className="w-4 h-4 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">
                                                        {activity.action.replace('_', ' ')}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {activity.description}
                                                    </p>
                                                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                                        <span>{activity.user?.name}</span>
                                                        <span>
                                                            {new Date(activity.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No activity found</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Signatures Tab */}
                {activeTab === 'signatures' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Digital Signatures</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {annexure.signatures && annexure.signatures.length > 0 ? (
                                <div className="space-y-6">
                                    {annexure.signatures.map((signature) => (
                                        <div
                                            key={signature.id}
                                            className="p-4 border border-gray-200 rounded"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {signature.signature_type === 'drawn'
                                                            ? 'Digital Signature'
                                                            : 'Uploaded Signature'}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Signed at:{' '}
                                                        {new Date(signature.signed_at).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                            {signature.signature_data &&
                                                signature.signature_data.startsWith('data:') && (
                                                    <img
                                                        src={signature.signature_data}
                                                        alt="Signature"
                                                        className="max-w-xs max-h-32 border border-gray-200 p-2 bg-white rounded"
                                                    />
                                                )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No signatures yet</p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
