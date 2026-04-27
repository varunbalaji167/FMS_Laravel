import { Head, useForm, router } from "@inertiajs/react";
import {
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Plus,
    Calendar,
    FileText,
    Upload,
    X,
    User,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import FacultyLayout from "@/Layouts/FacultyLayout";
import { useMemo, useState } from "react";

const getStatusColor = (status) => {
    switch (status) {
        case "approved":
            return "text-green-600 bg-green-50";
        case "rejected":
            return "text-red-600 bg-red-50";
        case "pending_recommender":
            return "text-yellow-600 bg-yellow-50";
        case "pending_approver":
            return "text-blue-600 bg-blue-50";
        case "pending":
            return "text-gray-600 bg-gray-50";
        default:
            return "text-slate-600 bg-slate-50";
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case "approved":
            return <CheckCircle className="h-4 w-4" />;
        case "rejected":
            return <XCircle className="h-4 w-4" />;
        case "pending_recommender":
        case "pending_approver":
        default:
            return <Clock className="h-4 w-4" />;
    }
};

const getStatusLabel = (status) => {
    switch (status) {
        case "approved":
            return "Approved";
        case "rejected":
            return "Rejected";
        case "pending_recommender":
            return "Pending HOD Review";
        case "pending_approver":
            return "Pending Admin Approval";
        default:
            return "Pending";
    }
};

const LeaveCard = ({ leave, leaveTypes }) => {
    const [showDetails, setShowDetails] = useState(false);
    const leaveTypeInfo = leaveTypes?.[leave.leave_type] ?? { name: leave.leave_type };
    const status = leave.status;
    const startDate = new Date(leave.start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const endDate = new Date(leave.end_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                    {leave.leave_type}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(status)}`}
                                >
                                    {getStatusIcon(status)}
                                    {getStatusLabel(status)}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {leaveTypeInfo.name}
                            </h3>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">
                                {Number(leave.total_days || 0).toFixed(1)}
                            </p>
                            <p className="text-xs text-slate-500">Days</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 rounded-lg p-3 flex-wrap">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>
                            {startDate} to {endDate}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>{leave.is_full_day ? "Full Day" : "Half Day"}</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500 mb-1">
                                Reason
                            </p>
                            <p className="text-sm text-slate-700 line-clamp-1">
                                {leave.reason}
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowDetails((prev) => !prev)}
                            className="shrink-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            {showDetails ? "Hide" : "View more"}
                        </Button>
                    </div>

                    {showDetails && (
                        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs font-medium text-slate-500 mb-1">
                                        HOD Recommendation
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {leave.recommender_status === "approved" ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : leave.recommender_status === "rejected" ? (
                                            <XCircle className="h-4 w-4 text-red-600" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-yellow-600" />
                                        )}
                                        <span className="text-sm font-medium text-slate-700 capitalize">
                                            {leave.recommender_status}
                                        </span>
                                    </div>
                                    {leave.recommender && (
                                        <p className="text-xs text-slate-500 mt-1">
                                            {leave.recommender.name}
                                        </p>
                                    )}
                                </div>

                                <div className="rounded-lg bg-slate-50 p-3">
                                    <p className="text-xs font-medium text-slate-500 mb-1">
                                        Admin Approval
                                    </p>
                                    <div className="flex items-center gap-2">
                                        {leave.approver_status === "approved" ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : leave.approver_status === "rejected" ? (
                                            <XCircle className="h-4 w-4 text-red-600" />
                                        ) : (
                                            <Clock className="h-4 w-4 text-yellow-600" />
                                        )}
                                        <span className="text-sm font-medium text-slate-700 capitalize">
                                            {leave.approver_status}
                                        </span>
                                    </div>
                                    {leave.approver && (
                                        <p className="text-xs text-slate-500 mt-1">
                                            {leave.approver.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {(leave.recommender_comment || leave.approver_comment) && (
                                <div className="border-t border-slate-200 pt-3">
                                    {leave.recommender_comment && (
                                        <div className="mb-2">
                                            <p className="text-xs font-medium text-slate-500 mb-1">
                                                HOD Comment
                                            </p>
                                            <p className="text-sm text-slate-600 italic">
                                                "{leave.recommender_comment}"
                                            </p>
                                        </div>
                                    )}
                                    {leave.approver_comment && (
                                        <div>
                                            <p className="text-xs font-medium text-slate-500 mb-1">
                                                Admin Comment
                                            </p>
                                            <p className="text-sm text-slate-600 italic">
                                                "{leave.approver_comment}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {leave.attachment_path && (
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <FileText className="h-4 w-4" />
                                    <a
                                        href={`/storage/${leave.attachment_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        View Attachment
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const LeaveApplicationModal = ({
    isOpen,
    onClose,
    leaveTypes,
    leaveBalances,
    recommenders,
    approvers,
    currentYear,
}) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        leave_type: Object.keys(leaveTypes ?? {})[0] || "CL",
        start_date: "",
        end_date: "",
        is_full_day: true,
        reason: "",
        attachment: null,
        recommender_id: recommenders?.[0]?.id || "",
        approver_id: approvers?.[0]?.id || "",
    });
    const [selectedFile, setSelectedFile] = useState(null);

    const calculateDays = (start, end, fullDay) => {
        if (!start || !end) return 0;

        const startDate = new Date(start);
        const endDate = new Date(end);
        let days = 0;

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                days += fullDay ? 1 : 0.5;
            }
        }

        return days;
    };

    const calculatedDays = useMemo(
        () => calculateDays(data.start_date, data.end_date, data.is_full_day),
        [data.start_date, data.end_date, data.is_full_day]
    );

    const currentBalance = leaveBalances?.[data.leave_type];
    const isBalanceSufficient =
        !currentBalance || currentBalance.balance >= calculatedDays;

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file.name);
            setData("attachment", file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("faculty.leaves.store"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSelectedFile(null);
                onClose();
            },
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                            Apply for Leave
                        </h3>
                        <p className="text-sm text-slate-500">
                            Submit a new leave request for {currentYear}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="max-h-[78vh] space-y-5 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="leave_type">Leave Type</InputLabel>
                            <select
                                id="leave_type"
                                value={data.leave_type}
                                onChange={(e) => setData("leave_type", e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                {Object.entries(leaveTypes ?? {}).map(([code, info]) => (
                                    <option key={code} value={code}>
                                        {code} - {info.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.leave_type} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="is_full_day">Duration</InputLabel>
                            <select
                                id="is_full_day"
                                value={data.is_full_day ? "full" : "half"}
                                onChange={(e) => setData("is_full_day", e.target.value === "full")}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                <option value="full">Full Day</option>
                                <option value="half">Half Day</option>
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="start_date">Start Date</InputLabel>
                            <input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData("start_date", e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                            <InputError message={errors.start_date} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="end_date">End Date</InputLabel>
                            <input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData("end_date", e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                            />
                            <InputError message={errors.end_date} className="mt-1" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {calculatedDays > 0 && (
                            <div className={`rounded-xl border p-4 ${isBalanceSufficient ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    {isBalanceSufficient ? (
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                    )}
                                    <p className="font-semibold">
                                        {isBalanceSufficient ? "Balance Sufficient" : "Insufficient Balance"}
                                    </p>
                                </div>
                                <p className="text-sm text-slate-700">
                                    {calculatedDays.toFixed(1)} working days selected.
                                </p>
                                {currentBalance && (
                                    <p className="text-sm text-slate-700 mt-1">
                                        Available: {Number(currentBalance.balance || 0).toFixed(1)} days
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-medium text-slate-500">Current Year</p>
                            <p className="text-lg font-bold text-slate-900">{currentYear}</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Leave balances are tracked yearly.
                            </p>
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="reason">Reason for Leave</InputLabel>
                        <textarea
                            id="reason"
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                            rows={4}
                            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                            placeholder="Provide details about why you need this leave..."
                        />
                        <InputError message={errors.reason} className="mt-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="attachment">Attachment</InputLabel>
                        <div className="mt-2 rounded-xl border-2 border-dashed border-slate-300 p-5 text-center">
                            <Upload className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                            <label htmlFor="attachment" className="cursor-pointer text-blue-600 font-medium hover:underline">
                                Click to upload
                            </label>
                            <input
                                id="attachment"
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <p className="mt-2 text-xs text-slate-500">PDF, DOC, DOCX, JPG or PNG up to 5MB</p>
                            {selectedFile && <p className="mt-2 text-sm text-green-600">✓ {selectedFile}</p>}
                        </div>
                        <InputError message={errors.attachment} className="mt-1" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="recommender_id">Recommender (HOD)</InputLabel>
                            <select
                                id="recommender_id"
                                value={data.recommender_id}
                                onChange={(e) => setData("recommender_id", e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                <option value="">Select HOD</option>
                                {recommenders?.map((rec) => (
                                    <option key={rec.id} value={rec.id}>
                                        {rec.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.recommender_id} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="approver_id">Approver (Admin)</InputLabel>
                            <select
                                id="approver_id"
                                value={data.approver_id}
                                onChange={(e) => setData("approver_id", e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
                            >
                                <option value="">Select Admin</option>
                                {approvers?.map((app) => (
                                    <option key={app.id} value={app.id}>
                                        {app.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.approver_id} className="mt-1" />
                        </div>
                    </div>

                    <div className="sticky bottom-0 -mx-5 flex justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:-mx-6 sm:px-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                            Submit Leave Request
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function Leaves({
    leaves,
    leaveBalances,
    leaveTypes,
    recommenders,
    approvers,
    currentYear,
    filters = {},
}) {
    const leaveItems = Array.isArray(leaves?.data) ? leaves.data : [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [leaveTypeFilter, setLeaveTypeFilter] = useState(filters.leave_type || '');

    const handleFilterChange = () => {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (leaveTypeFilter) params.append('leave_type', leaveTypeFilter);
        router.get(route('faculty.leaves.index'), Object.fromEntries(params));
    };

    const handleResetFilters = () => {
        setStatusFilter('');
        setLeaveTypeFilter('');
        router.get(route('faculty.leaves.index'));
    };

    const stats = {
        total: leaveItems.length,
        approved: leaveItems.filter((leave) => leave.status === "approved").length,
        pending: leaveItems.filter((leave) => leave.status !== "approved" && leave.status !== "rejected").length,
        rejected: leaveItems.filter((leave) => leave.status === "rejected").length,
    };

    return (
        <FacultyLayout>
            <Head title="Leaves | FMS" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Leaves</h1>
                            <p className="text-slate-600 text-sm">
                                View your leave balance, submit new leave requests, and track all statuses.
                            </p>
                        </div>
                    </div>

                    <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Apply for Leave
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            <p className="text-sm text-slate-500">Total Requests</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                            <p className="text-sm text-slate-500">Approved</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            <p className="text-sm text-slate-500">Pending</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                            <p className="text-sm text-slate-500">Rejected</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="text-lg text-blue-900">Leave Balance Overview</CardTitle>
                        <CardDescription>
                            Current balance for each leave type in {currentYear}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {Object.entries(leaveTypes ?? {}).map(([code, info]) => {
                                const balance = leaveBalances?.[code];
                                return (
                                    <div key={code} className="bg-white rounded-lg p-3 border border-blue-200">
                                        <p className="text-sm font-medium text-slate-600">
                                            {code} - {info.name}
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600 mt-1">
                                            {balance ? Number(balance.balance || 0).toFixed(1) : info.annual}
                                        </p>
                                        <p className="text-xs text-slate-500">Days available</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Filter Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Leave Type
                                </label>
                                <select
                                    value={leaveTypeFilter}
                                    onChange={(e) => setLeaveTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    <option value="">All Types</option>
                                    {Object.entries(leaveTypes || {}).map(([code, info]) => (
                                        <option key={code} value={code}>
                                            {code} - {info.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end gap-2">
                                <Button
                                    onClick={handleFilterChange}
                                    className="bg-blue-600 hover:bg-blue-700 flex-1"
                                >
                                    Apply Filters
                                </Button>
                                {(statusFilter || leaveTypeFilter) && (
                                    <Button
                                        onClick={handleResetFilters}
                                        className="bg-slate-300 hover:bg-slate-400 text-slate-700"
                                    >
                                        Reset
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                        All Requests ({leaveItems.length})
                    </h2>

                    {leaveItems.length === 0 ? (
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-700 mb-1">
                                    No Leave Requests Yet
                                </h3>
                                <p className="text-slate-500 mb-4">
                                    You haven't applied for any leave yet.
                                </p>
                                <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Apply for Leave
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {leaveItems.map((leave) => (
                                <LeaveCard key={leave.id} leave={leave} leaveTypes={leaveTypes} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <LeaveApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                leaveTypes={leaveTypes}
                leaveBalances={leaveBalances}
                recommenders={recommenders}
                approvers={approvers}
                currentYear={currentYear}
            />
        </FacultyLayout>
    );
}
