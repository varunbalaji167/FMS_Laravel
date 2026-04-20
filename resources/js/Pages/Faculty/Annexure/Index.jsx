import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import TextInput from '@/Components/TextInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import {
    FileText,
    Plus,
    Search,
    Eye,
    Edit2,
    Send,
    Download,
    Clock,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';

export default function AnnexureIndex({ requests, annexures, templates, filters, statusCounts, stats }) {
    const dataSource = requests || annexures || { data: [], current_page: 1, last_page: 1 };
    const templateOptions = templates || [];
    const computedStatusCounts = statusCounts || stats || {};
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || '');
    const [template, setTemplate] = useState(filters?.template || '');

    const getStatusBadge = (status) => {
        const badges = {
            draft: 'bg-gray-100 text-gray-800',
            submitted: 'bg-blue-100 text-blue-800',
            under_review: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            signed: 'bg-purple-100 text-purple-800',
            archived: 'bg-slate-100 text-slate-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'draft':
                return <Clock className="w-4 h-4" />;
            case 'submitted':
            case 'under_review':
                return <AlertCircle className="w-4 h-4" />;
            case 'approved':
            case 'signed':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Annexures
                    </h2>
                    <Link href={route('faculty.annexures.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Annexure
                        </Button>
                    </Link>
                </div>
            }
        >
            <div className="max-w-7xl mx-auto">
                {/* Status Summary Cards */}
                <div className="grid grid-cols-5 gap-4 mb-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">
                                    {computedStatusCounts?.draft || 0}
                                </div>
                                <div className="text-sm text-gray-600">Drafts</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {computedStatusCounts?.submitted || 0}
                                </div>
                                <div className="text-sm text-gray-600">Submitted</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {computedStatusCounts?.under_review || 0}
                                </div>
                                <div className="text-sm text-gray-600">Under Review</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {computedStatusCounts?.approved || 0}
                                </div>
                                <div className="text-sm text-gray-600">Approved</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {computedStatusCounts?.signed || 0}
                                </div>
                                <div className="text-sm text-gray-600">Signed</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <TextInput
                                    type="text"
                                    placeholder="Search annexures..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="submitted">Submitted</option>
                                <option value="under_review">Under Review</option>
                                <option value="approved">Approved</option>
                                <option value="signed">Signed</option>
                            </select>

                            <select
                                value={template}
                                onChange={(e) => setTemplate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Types</option>
                                {templateOptions.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>

                            <Button
                                onClick={() => {
                                    const params = new URLSearchParams();
                                    if (search) params.append('search', search);
                                    if (status) params.append('status', status);
                                    if (template) params.append('template', template);
                                    window.location.href = `/faculty/annexures${params.toString() ? '?' + params.toString() : ''}`;
                                }}
                                className="w-full"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Annexures Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Annexures</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold">Type</th>
                                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold">Created</th>
                                        <th className="text-left py-3 px-4 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataSource.data?.length > 0 ? (
                                        dataSource.data.map((annexure) => (
                                            <tr key={annexure.id} className="border-b hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                        <span className="font-medium">{annexure.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">{annexure.template?.name}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={getStatusBadge(annexure.status)}>
                                                        {getStatusIcon(annexure.status)}
                                                        <span className="ml-1">
                                                            {annexure.status.replace('_', ' ')}
                                                        </span>
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600">
                                                    {new Date(annexure.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={route(
                                                                'faculty.annexures.show',
                                                                annexure
                                                            )}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>

                                                        {annexure.status === 'draft' ||
                                                        annexure.status === 'rejected' ? (
                                                            <Link
                                                                href={route(
                                                                    'faculty.annexures.edit',
                                                                    annexure
                                                                )}
                                                                className="text-gray-600 hover:text-gray-800"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </Link>
                                                        ) : null}

                                                        {annexure.status === 'draft' ||
                                                        annexure.status === 'rejected' ? (
                                                            <form
                                                                method="POST"
                                                                action={route(
                                                                    'faculty.annexures.submit',
                                                                    annexure
                                                                )}
                                                                onSubmit={(e) => {
                                                                    if (
                                                                        !confirm(
                                                                            'Are you sure you want to submit this annexure?'
                                                                        )
                                                                    ) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                            >
                                                                <input
                                                                    type="hidden"
                                                                    name="_token"
                                                                    value={
                                                                        document.querySelector(
                                                                            'meta[name="csrf-token"]'
                                                                        )?.content
                                                                    }
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    className="text-green-600 hover:text-green-800"
                                                                >
                                                                    <Send className="w-4 h-4" />
                                                                </button>
                                                            </form>
                                                        ) : null}

                                                        {annexure.status !== 'draft' &&
                                                        annexure.pdf_id ? (
                                                            <Link
                                                                href={route(
                                                                    'faculty.annexures.download-pdf',
                                                                    annexure
                                                                )}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </Link>
                                                        ) : null}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 px-4 text-center text-gray-600">
                                                No annexures found. Create one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {dataSource.last_page > 1 && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex gap-2">
                                    {Array.from({ length: dataSource.last_page }, (_, i) => i + 1).map(
                                        (page) => (
                                            <Link
                                                key={page}
                                                href={`${window.location.pathname}?page=${page}${
                                                    search ? '&search=' + search : ''
                                                }${status ? '&status=' + status : ''}${
                                                    template ? '&template=' + template : ''
                                                }`}
                                                className={`px-3 py-1 rounded ${
                                                    dataSource.current_page === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
