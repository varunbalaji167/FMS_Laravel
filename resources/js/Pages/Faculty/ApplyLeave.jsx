import { Head, Link, useForm } from "@inertiajs/react";
import {
    Building2,
    AlertCircle,
    CheckCircle,
    XCircle,
    Upload,
    ChevronRight,
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
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import FacultyLayout from "@/Layouts/FacultyLayout";
import { useState } from "react";

export default function ApplyLeave({
    leaveTypes,
    leaveBalances,
    recommenders,
    approvers,
    currentYear,
    auth,
}) {
    const { data, setData, post, processing, errors } = useForm({
        leave_type: "CL",
        start_date: "",
        end_date: "",
        is_full_day: true,
        reason: "",
        attachment: null,
        recommender_id: recommenders[0]?.id || "",
        approver_id: approvers[0]?.id || "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [calculatedDays, setCalculatedDays] = useState(0);

    // Calculate working days
    const calculateDays = (start, end, fullDay) => {
        if (!start || !end) return 0;

        const startDate = new Date(start);
        const endDate = new Date(end);
        let days = 0;

        for (
            let d = new Date(startDate);
            d <= endDate;
            d.setDate(d.getDate() + 1)
        ) {
            // Count Monday to Friday (0 = Sunday, 6 = Saturday)
            if (d.getDay() !== 0 && d.getDay() !== 6) {
                days += fullDay ? 1 : 0.5;
            }
        }

        return days;
    };

    const handleDateChange = (field, value) => {
        setData(field, value);

        if (field === "start_date" || field === "end_date" || field === "is_full_day") {
            const newStart =
                field === "start_date" ? value : data.start_date;
            const newEnd = field === "end_date" ? value : data.end_date;
            const newFullDay =
                field === "is_full_day" ? value : data.is_full_day;

            const days = calculateDays(newStart, newEnd, newFullDay);
            setCalculatedDays(days);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file.name);
            setData("attachment", file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === "attachment" && data[key]) {
                formData.append(key, data[key]);
            } else if (key !== "attachment") {
                formData.append(key, data[key]);
            }
        });

        post(route("faculty.leaves.store"), {
            data: formData,
            forceFormData: true,
        });
    };

    const currentBalance = leaveBalances[data.leave_type];
    const isBalanceSufficient =
        currentBalance && currentBalance.balance >= calculatedDays;

    return (
        <FacultyLayout>
            <Head title="Apply for Leave | FMS" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Apply for Leave
                        </h1>
                        <p className="text-slate-600 text-sm">
                            Submit your leave request for {currentYear}
                        </p>
                    </div>
                </div>

                {/* Leave Balance Overview */}
                <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                        <CardTitle className="text-lg text-blue-900">
                            Leave Balance Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {Object.entries(leaveTypes).map(([code, info]) => {
                                const balance = leaveBalances[code];
                                return (
                                    <div
                                        key={code}
                                        className="bg-white rounded-lg p-3 border border-blue-200"
                                    >
                                        <p className="text-sm font-medium text-slate-600">
                                            {code} - {info.name}
                                        </p>
                                        <p className="text-2xl font-bold text-blue-600 mt-1">
                                            {balance
                                                ? balance.balance.toFixed(1)
                                                : info.annual}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Days available
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Application Form</CardTitle>
                        <CardDescription>
                            Fill in all the required fields and select your
                            recommender and approver
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Leave Type */}
                                <div>
                                    <InputLabel htmlFor="leave_type">
                                        Leave Type <span className="text-red-500">*</span>
                                    </InputLabel>
                                    <select
                                        id="leave_type"
                                        value={data.leave_type}
                                        onChange={(e) => {
                                            setData("leave_type", e.target.value);
                                        }}
                                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {Object.entries(leaveTypes).map(([code, info]) => (
                                            <option key={code} value={code}>
                                                {code} - {info.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.leave_type} className="mt-1" />
                                </div>

                                {/* Start Date */}
                                <div>
                                    <InputLabel htmlFor="start_date">
                                        Start Date <span className="text-red-500">*</span>
                                    </InputLabel>
                                    <input
                                        type="date"
                                        id="start_date"
                                        value={data.start_date}
                                        onChange={(e) =>
                                            handleDateChange("start_date", e.target.value)
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <InputError message={errors.start_date} className="mt-1" />
                                </div>

                                {/* End Date */}
                                <div>
                                    <InputLabel htmlFor="end_date">
                                        End Date <span className="text-red-500">*</span>
                                    </InputLabel>
                                    <input
                                        type="date"
                                        id="end_date"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            handleDateChange("end_date", e.target.value)
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <InputError message={errors.end_date} className="mt-1" />
                                </div>

                                {/* Full Day Toggle */}
                                <div className="flex items-end gap-4">
                                    <div className="flex-1">
                                        <InputLabel htmlFor="is_full_day">
                                            Duration
                                        </InputLabel>
                                        <select
                                            id="is_full_day"
                                            value={data.is_full_day ? "full" : "half"}
                                            onChange={(e) =>
                                                handleDateChange(
                                                    "is_full_day",
                                                    e.target.value === "full"
                                                )
                                            }
                                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="full">Full Day</option>
                                            <option value="half">Half Day</option>
                                        </select>
                                    </div>

                                    {/* Days Preview */}
                                    {calculatedDays > 0 && (
                                        <div className="text-center pb-2">
                                            <p className="text-sm text-slate-600">
                                                Total Days
                                            </p>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {calculatedDays.toFixed(1)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Balance Check Alert */}
                            {calculatedDays > 0 && currentBalance && (
                                <div
                                    className={`p-4 rounded-lg border flex items-start gap-3 ${
                                        isBalanceSufficient
                                            ? "bg-green-50 border-green-200"
                                            : "bg-red-50 border-red-200"
                                    }`}
                                >
                                    {isBalanceSufficient ? (
                                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p
                                            className={`font-medium ${
                                                isBalanceSufficient
                                                    ? "text-green-800"
                                                    : "text-red-800"
                                            }`}
                                        >
                                            {isBalanceSufficient
                                                ? "Balance Sufficient"
                                                : "Insufficient Balance"}
                                        </p>
                                        <p
                                            className={`text-sm mt-1 ${
                                                isBalanceSufficient
                                                    ? "text-green-700"
                                                    : "text-red-700"
                                            }`}
                                        >
                                            You have{" "}
                                            <span className="font-bold">
                                                {currentBalance.balance.toFixed(1)}
                                            </span>{" "}
                                            days available but requesting{" "}
                                            <span className="font-bold">
                                                {calculatedDays.toFixed(1)}
                                            </span>{" "}
                                            days.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Reason */}
                            <div>
                                <InputLabel htmlFor="reason">
                                    Reason for Leave <span className="text-red-500">*</span>
                                </InputLabel>
                                <textarea
                                    id="reason"
                                    value={data.reason}
                                    onChange={(e) => setData("reason", e.target.value)}
                                    placeholder="Provide details about why you need this leave..."
                                    rows="4"
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <InputError message={errors.reason} className="mt-1" />
                            </div>

                            {/* Attachment */}
                            <div>
                                <InputLabel htmlFor="attachment">
                                    Attachments (Optional)
                                </InputLabel>
                                <div className="mt-2 border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                    <label
                                        htmlFor="attachment"
                                        className="cursor-pointer"
                                    >
                                        <span className="text-blue-600 font-medium hover:underline">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </label>
                                    <input
                                        type="file"
                                        id="attachment"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        className="hidden"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">
                                        PDF, DOC, DOCX, JPG or PNG (Max 5MB)
                                    </p>
                                    {selectedFile && (
                                        <p className="text-sm text-green-600 font-medium mt-2">
                                            ✓ {selectedFile}
                                        </p>
                                    )}
                                </div>
                                <InputError message={errors.attachment} className="mt-1" />
                            </div>

                            {/* Recommender */}
                            <div>
                                <InputLabel htmlFor="recommender_id">
                                    Recommender (HOD) <span className="text-red-500">*</span>
                                </InputLabel>
                                <select
                                    id="recommender_id"
                                    value={data.recommender_id}
                                    onChange={(e) =>
                                        setData("recommender_id", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select HOD</option>
                                    {recommenders.map((rec) => (
                                        <option key={rec.id} value={rec.id}>
                                            {rec.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.recommender_id} className="mt-1" />
                                <p className="text-xs text-slate-500 mt-1">
                                    Your HOD will review and recommend your leave
                                </p>
                            </div>

                            {/* Approver */}
                            <div>
                                <InputLabel htmlFor="approver_id">
                                    Approver (Admin/Dean) <span className="text-red-500">*</span>
                                </InputLabel>
                                <select
                                    id="approver_id"
                                    value={data.approver_id}
                                    onChange={(e) =>
                                        setData("approver_id", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Admin/Dean</option>
                                    {approvers.map((app) => (
                                        <option key={app.id} value={app.id}>
                                            {app.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.approver_id} className="mt-1" />
                                <p className="text-xs text-slate-500 mt-1">
                                    Final approval from admin/dean is required
                                </p>
                            </div>

                            {/* Approval Workflow */}
                            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                <p className="text-sm font-medium text-slate-900 mb-3">
                                    Approval Workflow
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="text-center">
                                        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mx-auto">
                                            1
                                        </div>
                                        <p className="text-xs font-medium text-slate-700 mt-2">
                                            You Submit
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400" />
                                    <div className="text-center">
                                        <div className="h-10 w-10 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold mx-auto">
                                            2
                                        </div>
                                        <p className="text-xs font-medium text-slate-700 mt-2">
                                            HOD Reviews
                                        </p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-slate-400" />
                                    <div className="text-center">
                                        <div className="h-10 w-10 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold mx-auto">
                                            3
                                        </div>
                                        <p className="text-xs font-medium text-slate-700 mt-2">
                                            Admin Approves
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
                                <Link href={route("faculty.dashboard")}>
                                    <Button variant="outline">Cancel</Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !isBalanceSufficient ||
                                        calculatedDays === 0
                                    }
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Submit Leave Request
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Policy Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Leave Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <p>
                                <strong>Casual Leave (CL):</strong> 12 days per year,
                                no medical certificate required
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <p>
                                <strong>Sick Leave (SL):</strong> 10 days per year, medical
                                certificate may be required
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <p>
                                <strong>Earned Leave (EL):</strong> 20 days per year,
                                accumulates if unused
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <p>
                                <strong>Note:</strong> Minimum notice period of 3 days is
                                recommended
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </FacultyLayout>
    );
}
