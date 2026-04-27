import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import FacultyLayout from '@/Layouts/FacultyLayout';
import { ChevronLeft, History, Download, Send, Edit2 } from 'lucide-react';
import AnnexurePdfPreview from '@/Components/AnnexurePdfPreview';

export default function ShowAnnexure({ annexure, latestData, latestVersion, auditTimeline = [], allVersions = [] }) {
    const [activeTab, setActiveTab] = useState('details');

    const statusColor = {
        draft: 'bg-gray-100 text-gray-700',
        submitted: 'bg-blue-100 text-blue-700',
        under_review: 'bg-yellow-100 text-yellow-700',
        pending_revision: 'bg-orange-100 text-orange-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
        signed: 'bg-purple-100 text-purple-700',
    };

    const canEdit = ['draft', 'pending_revision'].includes(annexure?.status);
    const canSubmit = ['draft', 'pending_revision'].includes(annexure?.status);

    const parsedData = (() => {
        if (!latestData?.form_data) return {};
        if (typeof latestData.form_data === 'object') return latestData.form_data;
        try {
            const first = JSON.parse(latestData.form_data);
            if (typeof first === 'string') {
                try {
                    return JSON.parse(first);
                } catch {
                    return {};
                }
            }
            return first;
        } catch {
            return {};
        }
    })();

    return (
        <FacultyLayout>
            <div className="max-w-5xl mx-auto px-4 py-6">
                <Link
                    href={route('faculty.annexures.index')}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Annexures
                </Link>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{annexure?.title || annexure?.template?.name || 'Annexure'}</h1>
                            <p className="text-sm text-gray-600 mt-1">Reference: {annexure?.reference_number || '-'}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[annexure?.status] || statusColor.draft}`}>
                            {(annexure?.status || 'draft').replace('_', ' ').toUpperCase()}
                        </span>
                    </div>

                    <div className="px-6 py-4 border-b flex gap-2">
                        {canEdit && (
                            <Link href={route('faculty.annexures.edit', annexure?.id)} className="inline-flex items-center px-3 py-2 rounded-md border text-sm hover:bg-gray-50">
                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                            </Link>
                        )}

                        {canSubmit && (
                            <button
                                onClick={() => {
                                    if (confirm('Submit this annexure for review?')) {
                                        router.post(route('faculty.annexures.submit', annexure?.id));
                                    }
                                }}
                                className="inline-flex items-center px-3 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
                            >
                                <Send className="w-4 h-4 mr-2" /> Submit for Review
                            </button>
                        )}

                        {latestVersion?.pdf_path && (
                            <a
                                href={route('faculty.annexures.download-pdf', annexure?.id)}
                                className="inline-flex items-center px-3 py-2 rounded-md border text-sm hover:bg-gray-50"
                            >
                                <Download className="w-4 h-4 mr-2" /> Download PDF
                            </a>
                        )}
                    </div>

                    <div className="px-6 py-3 border-b flex gap-6 text-sm">
                        <button className={activeTab === 'details' ? 'text-blue-700 font-semibold' : 'text-gray-600'} onClick={() => setActiveTab('details')}>Details</button>
                        <button className={activeTab === 'preview' ? 'text-blue-700 font-semibold' : 'text-gray-600'} onClick={() => setActiveTab('preview')}>PDF Preview</button>
                        <button className={activeTab === 'versions' ? 'text-blue-700 font-semibold' : 'text-gray-600'} onClick={() => setActiveTab('versions')}>Versions</button>
                        <button className={activeTab === 'timeline' ? 'text-blue-700 font-semibold' : 'text-gray-600'} onClick={() => setActiveTab('timeline')}>Timeline</button>
                    </div>

                    {activeTab === 'details' && (
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><span className="text-gray-500">Template:</span> <span className="font-medium">{annexure?.template?.name || '-'}</span></div>
                                <div><span className="text-gray-500">Created:</span> <span className="font-medium">{annexure?.created_at ? new Date(annexure.created_at).toLocaleString() : '-'}</span></div>
                                <div><span className="text-gray-500">Submitted:</span> <span className="font-medium">{annexure?.submitted_at ? new Date(annexure.submitted_at).toLocaleString() : '-'}</span></div>
                                <div><span className="text-gray-500">Assigned Admin:</span> <span className="font-medium">{annexure?.assigned_admin?.name || '-'}</span></div>
                            </div>

                            <div className="border rounded-lg p-4 bg-gray-50">
                                <h3 className="font-semibold text-gray-900 mb-3">Form Data</h3>
                                <pre className="text-xs whitespace-pre-wrap text-gray-800">{JSON.stringify(parsedData, null, 2)}</pre>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preview' && (
                        <div className="p-6">
                            <div className="mb-3 flex items-center justify-between gap-3 text-sm text-gray-700">
                                <span>Review this generated layout before final submission to admin.</span>
                                {latestVersion?.pdf_path && (
                                    <a
                                        href={route('faculty.annexures.download-pdf', annexure?.id)}
                                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                                    >
                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                    </a>
                                )}
                            </div>
                            <AnnexurePdfPreview template={annexure?.template} formData={parsedData} />
                        </div>
                    )}

                    {activeTab === 'versions' && (
                        <div className="p-6">
                            {allVersions.length === 0 ? (
                                <p className="text-sm text-gray-600">No versions available.</p>
                            ) : (
                                <div className="space-y-3">
                                    {allVersions.map((v) => (
                                        <div key={v.id} className="border rounded-lg p-3 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">Version {v.version_number}</p>
                                                <p className="text-xs text-gray-600">{v.generated_at ? new Date(v.generated_at).toLocaleString() : '-'}</p>
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{v.status}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="p-6">
                            {auditTimeline.length === 0 ? (
                                <p className="text-sm text-gray-600">No activity yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {auditTimeline.map((log) => (
                                        <div key={log.id} className="border-l-2 border-blue-200 pl-4">
                                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                <History className="w-4 h-4 text-blue-600" /> {log.action}
                                            </p>
                                            <p className="text-sm text-gray-700">{log.description || '-'}</p>
                                            <p className="text-xs text-gray-500 mt-1">{log.created_at ? new Date(log.created_at).toLocaleString() : '-'}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </FacultyLayout>
    );
}
