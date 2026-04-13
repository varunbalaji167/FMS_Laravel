import { Head, useForm } from "@inertiajs/react";
import {
    Building2,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    User,
    MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import HodLayout from "@/Layouts/HodLayout";
import { useState } from "react";

const LeaveRecommendationCard = ({ leave, leaveTypes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        action: "approved",
        comment: "",
    });

    const leaveTypeInfo = leaveTypes?.[leave.leave_type] ?? { name: leave.leave_type };
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

    const handleSubmit = (e, action) => {
        e.preventDefault();
        setData("action", action);

        post(route("hod.leaves.recommend", leave.id), {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                                    {leave.leave_type}
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 bg-yellow-50 text-yellow-600">
                                    <Clock className="h-3 w-3" />
                                    Pending Your Review
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {leave.user?.name ?? "Unknown"}
                            </h3>
                            <p className="text-sm text-slate-500">{leave.user?.email ?? ""}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">
                                {Number(leave.total_days || 0).toFixed(1)}
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

                    {/* Leave Type Info */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-3">
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">
                                Leave Type
                            </p>
                            <p className="text-sm font-medium text-slate-700">
                                {leaveTypeInfo.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-slate-500 mb-1">
                                To Approver
                            </p>
                            <p className="text-sm font-medium text-slate-700">
                                {leave.approver?.name ?? "Admin"}
                            </p>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Reason</p>
                        <p className="text-sm text-slate-700">{leave.reason}</p>
                    </div>

                    {/* Attachment */}
                    {leave.attachment_path && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <MessageSquare className="h-4 w-4" />
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

                    {/* Action Button */}
                    {!isOpen && (
                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                            <Button
                                onClick={() => setIsOpen(true)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                            </Button>
                            <Button
                                onClick={() => setIsOpen(true)}
                                variant="outline"
                                className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                            >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                            </Button>
                        </div>
                    )}

                    {/* Action Form */}
                    {isOpen && (
                        <form className="space-y-4 pt-4 border-t border-slate-200">
                            <div>
                                <InputLabel htmlFor={`action-${leave.id}`}>
                                    Decision
                                </InputLabel>
                                <select
                                    id={`action-${leave.id}`}
                                    value={data.action}
                                    onChange={(e) => setData("action", e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="approved">Approve</option>
                                    <option value="rejected">Reject</option>
                                </select>
                                <InputError message={errors.action} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor={`comment-${leave.id}`}>
                                    Comment (Optional)
                                </InputLabel>
                                <textarea
                                    id={`comment-${leave.id}`}
                                    value={data.comment}
                                    onChange={(e) => setData("comment", e.target.value)}
                                    placeholder="Add any comments for the faculty member..."
                                    rows="3"
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <InputError message={errors.comment} className="mt-1" />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setIsOpen(false);
                                        reset();
                                    }}
                                    disabled={processing}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={(e) => handleSubmit(e, data.action)}
                                    disabled={processing}
                                    className={
                                        data.action === "approved"
                                            ? "flex-1 bg-green-600 hover:bg-green-700"
                                            : "flex-1 bg-red-600 hover:bg-red-700"
                                    }
                                >
                                    {data.action === "approved" ? "Approve" : "Reject"}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default function PendingRecommendations({ leaves, leaveTypes, auth }) {
    const leaveItems = Array.isArray(leaves?.data) ? leaves.data : [];
    const totalRequestedDays = leaveItems
        .reduce((sum, leave) => sum + Number(leave.total_days || 0), 0)
        .toFixed(1);

    return (
        <HodLayout>
            <Head title="Pending Recommendations | FMS" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Leave Recommendations
                        </h1>
                        <p className="text-slate-600 text-sm">
                            Review and recommend leave requests from faculty members
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-slate-900">
                                    {leaveItems.length}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Pending Your Review
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-slate-900">
                                    {new Set(leaveItems.map((l) => l.user_id)).size}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Faculty Members
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-slate-900">
                                    {totalRequestedDays}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Total Days Requested
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Leave Requests */}
                <div>
                    {leaveItems.length === 0 ? (
                        <Card>
                            <CardContent className="pt-12 pb-12 text-center">
                                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-700 mb-1">
                                    All Caught Up!
                                </h3>
                                <p className="text-slate-500">
                                    There are no pending leave requests to review.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {leaveItems.map((leave) => (
                                <LeaveRecommendationCard
                                    key={leave.id}
                                    leave={leave}
                                    leaveTypes={leaveTypes}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </HodLayout>
    );
}
