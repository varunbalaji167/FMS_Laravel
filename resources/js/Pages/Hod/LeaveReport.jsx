import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Building2,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Users,
    Calendar,
    TrendingUp,
    Download,
    FileText,
} from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card';
import HodLayout from '@/Layouts/HodLayout';

const getStatusColor = (status) => {
    switch (status) {
        case 'approved':
            return 'text-green-600 bg-green-50';
        case 'rejected':
            return 'text-red-600 bg-red-50';
        case 'pending':
            return 'text-yellow-600 bg-yellow-50';
        default:
            return 'text-gray-600 bg-gray-50';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'approved':
            return <CheckCircle className="h-4 w-4" />;
        case 'rejected':
            return <XCircle className="h-4 w-4" />;
        case 'pending':
            return <Clock className="h-4 w-4" />;
        default:
            return <Clock className="h-4 w-4" />;
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'approved':
            return 'Approved';
        case 'rejected':
            return 'Rejected';
        case 'pending':
            return 'Pending';
        default:
            return 'Pending';
    }
};

export default function LeaveReport({ leaves, leaveTypes, stats = {}, filters = {} }) {
    const leaveItems = Array.isArray(leaves?.data) ? leaves.data : [];
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [leaveTypeFilter, setLeaveTypeFilter] = useState(filters.leave_type || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (leaveTypeFilter) params.append('leave_type', leaveTypeFilter);
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        router.get(route('hod.leaves.report'), Object.fromEntries(params));
    };

    const handleResetFilters = () => {
        setStatusFilter('');
        setLeaveTypeFilter('');
        setFromDate('');
        setToDate('');
        router.get(route('hod.leaves.report'));
    };

    const handleExportPDF = () => {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (leaveTypeFilter) params.append('leave_type', leaveTypeFilter);
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        window.location.href = route('hod.leaves.report.pdf', Object.fromEntries(params));
    };

    const handleExportExcel = () => {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (leaveTypeFilter) params.append('leave_type', leaveTypeFilter);
        if (fromDate) params.append('from_date', fromDate);
        if (toDate) params.append('to_date', toDate);
        window.location.href = route('hod.leaves.report.excel', Object.fromEntries(params));
    };

    return (
        <HodLayout>
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with Export Buttons */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Leave Recommendations Report</h1>
                        <p className="text-gray-600 mt-1">View all leaves you have recommended and their statuses</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleExportPDF}
                            className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Export PDF
                        </Button>
                        <Button
                            onClick={handleExportExcel}
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Export Excel
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Total Recommended</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{stats.approved || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Approved</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">{stats.rejected || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Rejected</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Pending</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{stats.total_days_approved || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Approved Days</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-purple-600">{stats.total_faculty || 0}</p>
                                <p className="text-xs text-gray-500 mt-1">Faculty Members</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter Report
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Leave Type
                                </label>
                                <select
                                    value={leaveTypeFilter}
                                    onChange={(e) => setLeaveTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="">All Types</option>
                                    {Object.entries(leaveTypes || {}).map(([code, info]) => (
                                        <option key={code} value={code}>
                                            {code} - {info.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button
                                onClick={handleApplyFilters}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Apply Filters
                            </Button>
                            {(statusFilter || leaveTypeFilter || fromDate || toDate) && (
                                <Button
                                    onClick={handleResetFilters}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Records Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Records ({leaveItems.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {leaveItems.length === 0 ? (
                            <div className="py-12 text-center">
                                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No leave records found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Faculty</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Leave Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dates</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Days</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Admin Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {leaveItems.map((leave) => {
                                            const startDate = new Date(leave.start_date).toLocaleDateString();
                                            const endDate = new Date(leave.end_date).toLocaleDateString();
                                            const hodStatus = leave.recommender_status;
                                            const adminStatus = leave.approver_status;

                                            return (
                                                <tr key={leave.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="font-medium text-gray-900">{leave.user?.name}</div>
                                                        <div className="text-xs text-gray-500">{leave.user?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                                            {leave.leave_type}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {startDate} to {endDate}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {leave.total_days} days
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(hodStatus)}`}>
                                                            {getStatusIcon(hodStatus)}
                                                            {getStatusLabel(hodStatus)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(adminStatus)}`}>
                                                            {getStatusIcon(adminStatus)}
                                                            {getStatusLabel(adminStatus)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {leaves?.last_page > 1 && (
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                            Page {leaves.current_page} of {leaves.last_page}
                        </div>
                        <div className="flex gap-2">
                            {leaves.current_page > 1 && (
                                <Button
                                    onClick={() => {
                                        const params = new URLSearchParams();
                                        params.append('page', leaves.current_page - 1);
                                        if (statusFilter) params.append('status', statusFilter);
                                        if (leaveTypeFilter) params.append('leave_type', leaveTypeFilter);
                                        if (fromDate) params.append('from_date', fromDate);
                                        if (toDate) params.append('to_date', toDate);
                                        router.get(route('hod.leaves.report'), Object.fromEntries(params));
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700"
                                >
                                    Previous
                                </Button>
                            )}
                            {leaves.current_page < leaves.last_page && (
                                <Button
                                    onClick={() => {
                                        const params = new URLSearchParams();
                                        params.append('page', leaves.current_page + 1);
                                        if (statusFilter) params.append('status', statusFilter);
                                        if (leaveTypeFilter) params.append('leave_type', leaveTypeFilter);
                                        if (fromDate) params.append('from_date', fromDate);
                                        if (toDate) params.append('to_date', toDate);
                                        router.get(route('hod.leaves.report'), Object.fromEntries(params));
                                    }}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700"
                                >
                                    Next
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </HodLayout>
    );
}
