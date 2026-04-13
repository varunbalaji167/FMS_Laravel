import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Plus,
    Calendar,
    User,
    FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import FacultyLayout from "@/Layouts/FacultyLayout";

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
            return <Clock className="h-4 w-4" />;
        case "pending_approver":
            return <Clock className="h-4 w-4" />;
        default:
            return <AlertCircle className="h-4 w-4" />;
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
    const leaveTypeInfo = leaveTypes[leave.leave_type];
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
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                    {leave.leave_type}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                        status
                                    )}`}
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
                                {leave.total_days}
                            </p>
                            <p className="text-xs text-slate-500">Days</p>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span>
                            {startDate} to {endDate}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span>{leave.is_full_day ? "Full Day" : "Half Day"}</span>
                    </div>

                    {/* Reason */}
                    <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">
                            Reason
                        </p>
                        <p className="text-sm text-slate-700 line-clamp-2">
                            {leave.reason}
                        </p>
                    </div>

                    {/* Approval Status */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-lg p-3">
                        <div>
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
                        <div>
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

                    {/* Comments */}
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

                    {/* Attachment */}
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
            </CardContent>
        </Card>
    );
};

export default function MyLeaves({ leaves, leaveBalances, leaveTypes, auth }) {
    return (
        <FacultyLayout>
            <Head title="My Leave Requests | FMS" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-blue-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                My Leave Requests
                            </h1>
                            <p className="text-slate-600 text-sm">
                                Track and manage all your leave applications
                            </p>
                        </div>
                    </div>
                    <Link href={route("faculty.leaves.create")}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Apply New Leave
                        </Button>
                    </Link>
                </div>

                {/* Leave Balance Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(leaveTypes).map(([code, info]) => {
                        const balance = leaveBalances[code];
                        const usedPercentage = balance
                            ? ((balance.used / balance.total_allocated) * 100).toFixed(0)
                            : 0;

                        return (
                            <Card key={code} className="border-slate-200">
                                <CardContent className="pt-6">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase">
                                                    {code}
                                                </p>
                                                <p className="text-sm font-medium text-slate-700">
                                                    {info.name}
                                                </p>
                                            </div>
                                            <span className="text-xl font-bold text-blue-600">
                                                {balance
                                                    ? balance.balance.toFixed(1)
                                                    : info.annual}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${usedPercentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {balance ? balance.used.toFixed(1) : 0} used of{" "}
                                            {balance ? balance.total_allocated : info.annual} days
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Leave Requests */}
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">
                        All Requests ({leaves.data.length})
                    </h2>

                    {leaves.data.length === 0 ? (
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-700 mb-1">
                                    No Leave Requests Yet
                                </h3>
                                <p className="text-slate-500 mb-4">
                                    You haven't applied for any leave yet.
                                </p>
                                <Link href={route("faculty.leaves.create")}>
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Apply for Leave
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {leaves.data.map((leave) => (
                                <LeaveCard
                                    key={leave.id}
                                    leave={leave}
                                    leaveTypes={leaveTypes}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </FacultyLayout>
    );
}
