import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import FacultyLayout from '@/Layouts/FacultyLayout';
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
        <FacultyLayout>
            <Head title="Annexures" />

            <div className="max-w-6xl mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
                            <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Annexures</h2>
                            <p className="text-slate-600 text-sm mt-1">Create, track, and manage annexure submissions</p>
                        </div>
                    </div>
                    <Link href={route('faculty.annexures.create')} className="inline-flex">
                        <Button className="h-11 bg-blue-600 hover:bg-blue-700 text-white px-5 shadow-lg shadow-blue-600/25 border border-blue-700 text-sm font-semibold">
                            <Plus className="w-4 h-4 mr-2" />
                            New Annexure
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="pt-6">
                        <form
                            className="flex flex-col lg:flex-row lg:items-end gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const params = new URLSearchParams();
                                if (search) params.append('search', search);
                                if (status) params.append('status', status);
                                if (template) params.append('template', template);
                                router.get(
                                    route('faculty.annexures.index'),
                                    Object.fromEntries(params.entries()),
                                    { preserveScroll: true, preserveState: true }
                                );
                            }}
                        >
                            <div className="relative flex-1 min-w-0">
                                <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                <TextInput
                                    type="text"
                                    placeholder="Search by name, reference number, or template..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 h-11 text-sm w-full"
                                />
                            </div>

                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full lg:w-48 h-11 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 text-sm"
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
                                className="w-full lg:w-56 h-11 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 text-sm"
                            >
                                <option value="">All Types</option>
                                {templateOptions.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>

                            <Button
                                type="submit"
                                className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white h-11 px-6 shadow-sm whitespace-nowrap"
                            >
                                <Search className="w-4 h-4 mr-2" />
                                Apply Filters
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full lg:w-auto h-11 px-6 border-slate-300 text-slate-700 hover:bg-slate-50 whitespace-nowrap"
                                onClick={() => {
                                    setSearch('');
                                    setStatus('');
                                    setTemplate('');
                                    router.get(route('faculty.annexures.index'), {}, { preserveScroll: true });
                                }}
                            >
                                Reset
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Annexures Table */}
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                    <CardHeader className="border-b border-slate-200 bg-white">
                        <CardTitle className="text-slate-900 text-lg">My Annexures</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase tracking-wider text-xs">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase tracking-wider text-xs">Type</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase tracking-wider text-xs">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase tracking-wider text-xs">Created</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700 uppercase tracking-wider text-xs">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {dataSource.data?.length > 0 ? (
                                        dataSource.data.map((annexure) => (
                                            <tr key={annexure.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                        <div>
                                                            <div className="font-medium text-slate-900 text-sm">{annexure.name}</div>
                                                            <div className="text-xs text-slate-500">#{annexure.reference_number || '-'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-slate-700 text-sm">{annexure.template?.name}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={getStatusBadge(annexure.status)}>
                                                        {getStatusIcon(annexure.status)}
                                                        <span className="ml-1">
                                                            {annexure.status.replace('_', ' ')}
                                                        </span>
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 text-sm">
                                                    {new Date(annexure.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        <Link
                                                            href={route(
                                                                'faculty.annexures.show',
                                                                annexure
                                                            )}
                                                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-blue-700 hover:bg-blue-50 hover:border-blue-200 text-sm"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View
                                                        </Link>

                                                        {annexure.status === 'draft' ||
                                                        annexure.status === 'rejected' ? (
                                                            <Link
                                                                href={route(
                                                                    'faculty.annexures.edit',
                                                                    annexure
                                                                )}
                                                                className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-slate-700 hover:bg-slate-50 hover:border-slate-300 text-sm"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                                Edit
                                                            </Link>
                                                        ) : null}

                                                        {annexure.status === 'draft' ||
                                                        annexure.status === 'rejected' ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to submit this annexure?')) {
                                                                        router.post(route('faculty.annexures.submit', annexure));
                                                                    }
                                                                }}
                                                                className="inline-flex items-center gap-1 rounded-md border border-emerald-200 px-3 py-1.5 text-emerald-700 hover:bg-emerald-50 text-sm"
                                                            >
                                                                <Send className="w-4 h-4" />
                                                                Submit
                                                            </button>
                                                        ) : null}

                                                        {annexure.status !== 'draft' &&
                                                        annexure.pdf_id ? (
                                                            <Link
                                                                href={route(
                                                                    'faculty.annexures.download-pdf',
                                                                    annexure
                                                                )}
                                                                className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-1.5 text-red-700 hover:bg-red-50 text-sm"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                                PDF
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
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
        </FacultyLayout>
    );
}
