import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    LogOut,
    User,
    FileText,
    Calendar,
    Clock,
    ArrowRight,
    FileCheck,
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

export default function FacultyDashboard({ auth }) {
    return (
        <FacultyLayout>
            <Head title="Faculty Dashboard | FMS" />

            {/* Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-slate-900 tracking-tight">
                            FMS Workspace
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-600">
                            Welcome,{" "}
                            <span className="font-bold text-slate-900">
                                {auth.user.name}
                            </span>
                        </span>
                        <Link href={route("logout")} method="post" as="button">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-slate-900">
                        Faculty Overview
                    </h1>
                    <p className="text-sm text-slate-500 font-medium">
                        Manage your academic profile and administrative
                        requests.
                    </p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Leave Balance
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                12 Days
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                Casual Leave (CL) remaining
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Active Projects
                            </CardTitle>
                            <FileText className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                3
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                Sponsored research grants
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Pending Requests
                            </CardTitle>
                            <Clock className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                1
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                Awaiting HOD approval
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href={route("profile.edit")}>
                        <Button
                            variant="outline"
                            className="h-24 w-full flex flex-col items-center justify-center gap-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <User className="h-6 w-6 text-blue-600" />
                            <span>Update Profile</span>
                        </Button>
                    </Link>
                    <Link href={route("faculty.leaves.create")}>
                        <Button
                            variant="outline"
                            className="h-24 w-full flex flex-col items-center justify-center gap-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <Calendar className="h-6 w-6 text-blue-600" />
                            <span>Apply for Leave</span>
                        </Button>
                    </Link>
                    <Link href={route("faculty.annexures.create")}>
                        <Button
                            variant="outline"
                            className="h-24 w-full flex flex-col items-center justify-center gap-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
                        >
                            <FileCheck className="h-6 w-6 text-blue-600" />
                            <span>Submit Annexure</span>
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50 transition-all"
                    >
                        <FileText className="h-6 w-6 text-blue-600" />
                        <span>Submit Appraisal</span>
                    </Button>
                </div>
            </main>
        </FacultyLayout>
    );
}
