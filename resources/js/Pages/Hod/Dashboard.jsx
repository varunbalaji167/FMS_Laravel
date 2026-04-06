import { Head, Link } from "@inertiajs/react";
import {
    Building2,
    LogOut,
    Users,
    CheckCircle,
    AlertCircle,
    BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HodLayout from "@/Layouts/HodLayout";

export default function HodDashboard({ auth }) {
    return (
        <HodLayout>
            <Head title="HOD Dashboard | FMS" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-white tracking-tight">
                            Department Administration
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-400">
                            HOD:{" "}
                            <span className="font-bold text-white">
                                {auth.user.name}
                            </span>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">
                            Department Overview
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            Computer Science and Engineering
                        </p>
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        Generate Report
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Total Faculty
                            </CardTitle>
                            <Users className="h-4 w-4 text-indigo-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                42
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm bg-amber-50/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-amber-700 uppercase tracking-wider">
                                Pending Leaves
                            </CardTitle>
                            <AlertCircle className="h-4 w-4 text-amber-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-amber-700">
                                5
                            </div>
                            <p className="text-xs text-amber-600 mt-1 font-bold">
                                Require immediate action
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Faculty on Leave
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                3
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                Appraisals
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-slate-900">
                                85%
                            </div>
                            <p className="text-xs text-slate-500 mt-1 font-medium">
                                Submission rate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Items List */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-black text-slate-900">
                            Action Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                                        AL
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">
                                            Dr. Ada Lovelace
                                        </p>
                                        <p className="text-xs font-medium text-slate-500">
                                            Requested 3 days of Casual Leave
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 border-emerald-200"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </HodLayout>
    );
}
