import { Head, Link } from "@inertiajs/react";
import {
    LogOut,
    Users,
    AlertTriangle,
    FileText,
    Award,
    Briefcase,
    BookOpen,
    Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/Layouts/AdminLayout";

export default function AdminDashboard({ auth }) {
    return (
        <AdminLayout>
            <Head title="Dean of Faculty Affairs | FMS" />

            {/* Top Navigation / Header */}
            <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-900/50">
                            <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-white tracking-tight uppercase">
                            Faculty Affairs
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-bold tracking-widest text-indigo-300 uppercase bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-800/50">
                            Dean Access
                        </span>
                        <Link href={route("logout")} method="post" as="button">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 hover:text-white hover:bg-white/10"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">
                            Institute Overview
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            Institute-wide faculty metrics and administrative
                            workflows.
                        </p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md shadow-indigo-200">
                        Generate Institute Report
                    </Button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Active Faculty
                            </CardTitle>
                            <Users className="h-4 w-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                312
                            </div>
                            <p className="text-xs text-emerald-600 mt-1 font-bold">
                                +5 joined this semester
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Pending Requests
                            </CardTitle>
                            <Clock className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                14
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                NOCs & Sabbaticals
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                Active Appraisals
                            </CardTitle>
                            <Award className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                28
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                Under Admin review
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-rose-200 shadow-sm bg-rose-50/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                                Escalations
                            </CardTitle>
                            <AlertTriangle className="h-4 w-4 text-rose-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-rose-700">
                                2
                            </div>
                            <p className="text-xs text-rose-600 mt-1 font-bold">
                                Require immediate attention
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Activity & Actions Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Institute Activity */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-slate-200 shadow-sm bg-white h-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-black text-slate-900">
                                    Recent Institute Activity
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-sm border-b border-slate-100 pb-4">
                                        <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0"></div>
                                        <p className="text-slate-500 w-24 shrink-0">
                                            10 mins ago
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            <span className="font-bold text-indigo-600">
                                                HOD Physics
                                            </span>{" "}
                                            approved a travel grant for Dr. A.
                                            Sharma. Awaiting Admin final
                                            sign-off.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm border-b border-slate-100 pb-4">
                                        <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0"></div>
                                        <p className="text-slate-500 w-24 shrink-0">
                                            1 hour ago
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            <span className="font-bold text-indigo-600">
                                                Dr. M. Patel (CSE)
                                            </span>{" "}
                                            submitted joining report after
                                            completing sabbatical leave.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm pb-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 shrink-0"></div>
                                        <p className="text-slate-500 w-24 shrink-0">
                                            Yesterday
                                        </p>
                                        <p className="font-medium text-slate-900">
                                            Annual Appraisal Cycle 2026
                                            successfully initiated for all
                                            departments.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Config / Admin Actions */}
                    <div className="space-y-6">
                        <Card className="border-slate-200 shadow-sm bg-white h-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-black text-slate-900">
                                    Administrative Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                >
                                    <Users className="h-4 w-4" />
                                    Master Faculty Directory
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                >
                                    <FileText className="h-4 w-4" />
                                    Review Pending NOCs
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                >
                                    <Award className="h-4 w-4" />
                                    Appraisal Dashboards
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start gap-3 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                >
                                    <BookOpen className="h-4 w-4" />
                                    Update Institute Policies
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </AdminLayout>
    );
}
