import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import HodLayout from '@/Layouts/HodLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Download, Filter, Search, TrendingUp } from 'lucide-react';

export default function LeaveReport({ leaves = { data: [], links: [] }, summary = {}, filters = {} }) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedLeaveType, setSelectedLeaveType] = useState(filters?.leave_type || 'all');
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || 'all');
    const [selectedYear, setSelectedYear] = useState(filters?.year || new Date().getFullYear());

    const handleFilter = () => {
        router.get(route('hod.leaves.report'), {
            search: searchTerm,
            leave_type: selectedLeaveType,
            status: selectedStatus,
            year: selectedYear,
        }, { preserveScroll: true });
    };

    const handleExport = () => {
        window.location.href = route('hod.leaves.report.export', {
            search: searchTerm,
            leave_type: selectedLeaveType,
            status: selectedStatus,
            year: selectedYear,
        });
    };

    const leaveTypes = {
        'CL': 'Casual Leave',
        'SL': 'Sick Leave',
        'EL': 'Earned Leave',
        'ML': 'Maternity Leave',
        'PL': 'Paternity Leave',
        'BL': 'Bereavement Leave',
        'OL': 'Other Leave',
    };

    const statusBadge = (status) => {
        const classes = {
            'approved': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'rejected': 'bg-red-100 text-red-800',
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <HodLayout>
            <Head title="Leave Report" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Leave Report</h1>
                                <p className="text-gray-600 mt-1">Monitor your department's leave requests and approvals</p>
                            </div>
                            <PrimaryButton onClick={handleExport} className="flex items-center gap-2">
                                <Download size={18} />
                                Export CSV
                            </PrimaryButton>
                        </div>

                        {/* Filter Section */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <button
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center gap-2 text-gray-700 font-semibold hover:text-gray-900"
                            >
                                <Filter size={18} />
                                Filters {filterOpen ? '▼' : '▶'}
                            </button>

                            {filterOpen && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Search Faculty
                                        </label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Name or email..."
                                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Leave Type
                                        </label>
                                        <select
                                            value={selectedLeaveType}
                                            onChange={(e) => setSelectedLeaveType(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">All Types</option>
                                            {Object.entries(leaveTypes).map(([code, name]) => (
                                                <option key={code} value={code}>{name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="all">All Statuses</option>
                                            <option value="approved">Approved</option>
                                            <option value="pending">Pending</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="taken">Taken</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Year
                                        </label>
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                                            <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                                            <option value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex gap-2">
                                <PrimaryButton onClick={handleFilter}>Apply Filters</PrimaryButton>
                                <SecondaryButton onClick={() => {
                                    setSearchTerm('');
                                    setSelectedLeaveType('all');
                                    setSelectedStatus('all');
                                    setSelectedYear(new Date().getFullYear());
                                    router.get(route('hod.leaves.report'));
                                }}>Clear Filters</SecondaryButton>
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <SummaryCard
                            title="Total Requests"
                            value={summary.total_requests}
                            color="blue"
                            icon={<TrendingUp />}
                        />
                        <SummaryCard
                            title="Approved"
                            value={summary.approved}
                            color="green"
                        />
                        <SummaryCard
                            title="Pending"
                            value={summary.pending}
                            color="yellow"
                        />
                        <SummaryCard
                            title="Rejected"
                            value={summary.rejected}
                            color="red"
                        />
                        <SummaryCard
                            title="Total Days"
                            value={summary.total_days}
                            color="purple"
                        />
                    </div>

                    {/* Leave Type Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Leaves by Type</h2>
                            <div className="space-y-3">
                                {Object.entries(summary.by_leave_type).map(([code, data]) => (
                                    <div key={code} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <p className="font-semibold text-gray-900">{data.name}</p>
                                            <p className="text-sm text-gray-600">{data.count} requests • {data.days} days</p>
                                        </div>
                                        <span className="text-sm font-semibold text-green-600">{data.approved} approved</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">By Status</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                    <p className="font-semibold text-gray-900">Approved</p>
                                    <p className="text-lg font-bold text-green-600">{summary.by_status.approved.count}</p>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                                    <p className="font-semibold text-gray-900">Pending Admin</p>
                                    <p className="text-lg font-bold text-yellow-600">{summary.by_status.pending_approver.count}</p>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                                    <p className="font-semibold text-gray-900">Pending HOD</p>
                                    <p className="text-lg font-bold text-orange-600">{summary.by_status.pending_recommender.count}</p>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                    <p className="font-semibold text-gray-900">Rejected</p>
                                    <p className="text-lg font-bold text-red-600">{summary.by_status.rejected.count}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Leaves Table */}
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Leave Requests</h2>

                            {leaves.data.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-lg">No leave requests found.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Faculty</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Leave Type</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Dates</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Days</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">HOD</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Admin</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Applied</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {leaves.data.map((leave) => (
                                                <tr key={leave.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{leave.user.name}</p>
                                                            <p className="text-sm text-gray-600">{leave.user.email}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {leaveTypes[leave.leave_type]}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900">
                                                        {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                                                        {leave.total_days}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(leave.recommender_status)}`}>
                                                            {leave.recommender_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(leave.approver_status)}`}>
                                                            {leave.approver_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {new Date(leave.created_at).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {leaves.links && leaves.links.length > 0 && (
                                <div className="mt-6 flex justify-between items-center">
                                    <p className="text-sm text-gray-600">
                                        Showing {leaves.from} to {leaves.to} of {leaves.total} records
                                    </p>
                                    <div className="flex gap-2">
                                        {leaves.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 rounded text-sm ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </HodLayout>
    );
}

function SummaryCard({ title, value, color, icon }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-900 border-blue-200',
        green: 'bg-green-50 text-green-900 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-900 border-yellow-200',
        red: 'bg-red-50 text-red-900 border-red-200',
        purple: 'bg-purple-50 text-purple-900 border-purple-200',
    };

    return (
        <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
            {icon && <div className="mb-2">{icon}</div>}
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    );
}
