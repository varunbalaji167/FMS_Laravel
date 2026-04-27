import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Eye, CheckCircle, XCircle, Clock, Archive, Search } from 'lucide-react';

export default function Index({ requests = { data: [], current_page: 1, last_page: 1 }, filters = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter) params.append('status', statusFilter);
        router.get('/admin/annexures?' + params.toString());
    };

    const statusBadges = {
        'draft': { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Draft' },
        'submitted': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Submitted' },
        'under_review': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Under Review' },
        'pending_revision': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending Revision' },
        'approved': { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
        'rejected': { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
        'signed': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Signed' },
    };

    const handleViewAnnexure = (requestId) => {
        router.visit(`/admin/annexures/${requestId}`);
    };

    const handleReviewAnnexure = (requestId) => {
        router.visit(`/admin/annexures/${requestId}/review`);
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Annexures</h1>
                    <p className="text-gray-600 mt-1">Review and approve faculty annexure submissions</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Faculty name, reference number..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    const params = new URLSearchParams();
                                    if (searchTerm) params.append('search', searchTerm);
                                    if (e.target.value && e.target.value !== 'all') params.append('status', e.target.value);
                                    if (e.target.value === 'all') params.append('status', 'all');
                                    router.get('/admin/annexures?' + params.toString());
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Pending Review (Default)</option>
                                <option value="all">All Statuses</option>
                                <option value="submitted">Submitted</option>
                                <option value="under_review">Under Review</option>
                                <option value="pending_revision">Pending Revision</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="signed">Signed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {requests.data && requests.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Faculty</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Template</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ref Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Submitted</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {requests.data.map((request) => {
                                        const badge = statusBadges[request.status] || statusBadges['draft'];
                                        const submittedDate = request.submitted_at ? new Date(request.submitted_at).toLocaleDateString() : '-';
                                        return (
                                            <tr key={request.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-sm">
                                                    <div className="font-medium text-gray-900">{request.user?.name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">{request.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{request.template?.name}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-gray-600">{request.reference_number}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                                        {badge.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{submittedDate}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleViewAnnexure(request.id)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        {request.status === 'submitted' && (
                                                            <button
                                                                onClick={() => handleReviewAnnexure(request.id)}
                                                                className="p-2 text-orange-600 hover:bg-orange-50 rounded transition"
                                                                title="Review"
                                                            >
                                                                <Clock className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {request.status === 'approved' && (
                                                            <button
                                                                onClick={() => router.visit(`/admin/annexures/${request.id}/sign`)}
                                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded transition"
                                                                title="Sign"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No annexures found</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {requests.last_page > 1 && (
                    <div className="mt-6 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Page {requests.current_page} of {requests.last_page}
                        </div>
                        <div className="flex gap-2">
                            {requests.current_page > 1 && (
                                <button
                                    onClick={() => {
                                        const params = new URLSearchParams({ page: requests.current_page - 1 });
                                        if (searchTerm) params.append('search', searchTerm);
                                        if (statusFilter) params.append('status', statusFilter);
                                        router.get('/admin/annexures?' + params.toString());
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Previous
                                </button>
                            )}
                            {requests.current_page < requests.last_page && (
                                <button
                                    onClick={() => {
                                        const params = new URLSearchParams({ page: requests.current_page + 1 });
                                        if (searchTerm) params.append('search', searchTerm);
                                        if (statusFilter) params.append('status', statusFilter);
                                        router.get('/admin/annexures?' + params.toString());
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
