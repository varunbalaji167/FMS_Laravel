import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Building2,
    Lock,
    Mail,
    Eye,
    EyeOff,
    Loader2,
    User,
    Shield,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import ToastListener from "@/Components/ToastListener";

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("faculty");

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        role: "faculty",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            preserveScroll: true,
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="flex min-h-screen bg-white">
            <ToastListener />
            <Head title="FMS Login | IIT Indore" />

            {/* Left Panel - Branding & Visuals */}
            <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between bg-slate-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2866&auto=format&fit=crop"
                    alt="IIT Indore Campus"
                    className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale-[0.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-900/60" />

                <div className="relative z-10 flex flex-col justify-between h-full p-12">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm tracking-tight uppercase">
                                IIT Indore
                            </p>
                            <p className="text-xs font-medium text-slate-300">
                                Faculty Management Portal
                            </p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <h1 className="font-serif text-4xl font-bold text-white leading-tight">
                            Your Academic Workspace
                        </h1>
                        <p className="mt-4 text-base leading-relaxed text-slate-300">
                            Access your profile, manage leave applications,
                            track research metrics, and handle departmental
                            workflows securely.
                        </p>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <blockquote className="text-sm text-slate-300 italic leading-relaxed">
                            &ldquo;Efficiency is doing better what is already
                            being done. Innovation is doing things
                            differently.&rdquo;
                        </blockquote>
                        <p className="mt-2 text-xs font-medium text-blue-300">
                            - Portal Administration
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:w-[45%] selection:bg-blue-100 selection:text-blue-900">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="mb-8 flex items-center gap-3 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm uppercase">
                                IIT Indore
                            </p>
                            <p className="text-xs font-medium text-slate-500">
                                FMS Portal
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-serif text-2xl font-bold text-slate-900">
                            Secure Authentication
                        </h2>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Select your portal role and enter your credentials.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                            {status}
                        </div>
                    )}

                    {/* Role Selector */}
                    <div className="mb-6">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                            Access Level
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("faculty");
                                    setData("role", "faculty");
                                    reset("email", "password");
                                }}
                                className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                                    role === "faculty"
                                        ? "border-blue-600 bg-blue-50 ring-4 ring-blue-600/10 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-sm ${
                                        role === "faculty"
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p
                                        className={`text-sm font-bold ${role === "faculty" ? "text-blue-700" : "text-slate-700"}`}
                                    >
                                        Faculty
                                    </p>
                                    <p
                                        className={`text-[10px] font-bold uppercase tracking-wider ${role === "faculty" ? "text-blue-600/70" : "text-slate-400"}`}
                                    >
                                        Profile & Leave
                                    </p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setRole("admin");
                                    setData("role", "admin");
                                    reset("email", "password");
                                }}
                                className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200 ${
                                    role === "admin"
                                        ? "border-slate-900 bg-slate-50 ring-4 ring-slate-900/10 shadow-sm"
                                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg shadow-sm ${
                                        role === "admin"
                                            ? "bg-slate-900 text-white"
                                            : "bg-slate-100 text-slate-500"
                                    }`}
                                >
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div>
                                    <p
                                        className={`text-sm font-bold ${role === "admin" ? "text-slate-900" : "text-slate-700"}`}
                                    >
                                        Admin / HOD
                                    </p>
                                    <p
                                        className={`text-[10px] font-bold uppercase tracking-wider ${role === "admin" ? "text-slate-600" : "text-slate-400"}`}
                                    >
                                        System Access
                                    </p>
                                </div>
                            </button>
                        </div>

                        {/* Domain Restriction Notice */}
                        <div className="mt-3 flex items-start gap-2 rounded-md bg-slate-50 p-3 border border-slate-200">
                            <AlertCircle className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                            <p className="text-xs font-medium text-slate-600">
                                <strong className="font-bold text-slate-900">
                                    Internal Portal:
                                </strong>{" "}
                                Login is strictly restricted to active{" "}
                                <span className="font-bold text-slate-900">
                                    @iiti.ac.in
                                </span>{" "}
                                institutional accounts.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-semibold text-slate-900"
                            >
                                Institutional Email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder={
                                        role === "admin"
                                            ? "admin@iiti.ac.in"
                                            : "username@iiti.ac.in"
                                    }
                                    className={`pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    disabled={processing}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-slate-900"
                                >
                                    Password
                                </Label>
                                <Link
                                    href={route("password.request")}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className={`pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    disabled={processing}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs font-medium text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className={`h-11 font-bold mt-2 shadow-md hover:shadow-lg transition-all duration-200 ${
                                role === "admin"
                                    ? "bg-slate-900 text-white hover:bg-slate-800"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <Lock className="h-4 w-4 mr-2" /> Login to
                                    Dashboard
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm font-medium text-slate-500">
                            New faculty member?{" "}
                            <Link
                                href={route("register")}
                                className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Register Profile
                            </Link>
                        </p>
                    </div>

                    {/* Developer / Seeded Accounts Card */}
                    <Card className="mt-8 border-dashed border-slate-200 bg-slate-50">
                        <CardContent className="p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 text-center">
                                Development Credentials
                            </p>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div className="bg-white p-2.5 rounded-md border border-slate-100 shadow-sm">
                                    <p className="font-bold text-slate-900 mb-1">
                                        Faculty
                                    </p>
                                    <p
                                        className="text-slate-500 font-medium truncate"
                                        title="user@iiti.ac.in"
                                    >
                                        user@iiti.ac.in
                                    </p>
                                    <p className="text-slate-400">password</p>
                                </div>
                                <div className="bg-white p-2.5 rounded-md border border-slate-100 shadow-sm">
                                    <p className="font-bold text-slate-900 mb-1">
                                        HOD
                                    </p>
                                    <p
                                        className="text-slate-500 font-medium truncate"
                                        title="hod.cse@iiti.ac.in"
                                    >
                                        hod.cse@iiti.ac.in
                                    </p>
                                    <p className="text-slate-400">password</p>
                                </div>
                                <div className="bg-white p-2.5 rounded-md border border-slate-100 shadow-sm">
                                    <p className="font-bold text-slate-900 mb-1">
                                        Admin
                                    </p>
                                    <p
                                        className="text-slate-500 font-medium truncate"
                                        title="admin@iiti.ac.in"
                                    >
                                        admin@iiti.ac.in
                                    </p>
                                    <p className="text-slate-400">password</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            ← Back to Portal Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
