import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import {
    Building2,
    Lock,
    Mail,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ToastListener from "@/Components/ToastListener";

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="flex min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
            <ToastListener />
            <Head title="Reset Password | FMS" />

            {/* Left Panel */}
            <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between bg-slate-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940&auto=format&fit=crop"
                    alt="Institutional Security"
                    className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-slate-900/80 to-slate-900/60" />
                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-sm">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-tight uppercase">
                                IIT Indore
                            </p>
                            <p className="text-xs font-medium text-blue-200">
                                Faculty Management Portal
                            </p>
                        </div>
                    </div>
                    <div className="max-w-md">
                        <h1 className="font-serif text-4xl font-bold leading-tight">
                            Create New Credentials
                        </h1>
                        <p className="mt-4 text-base text-slate-300 font-medium leading-relaxed">
                            Your password must be unique and secure. Once reset,
                            your new credentials will be active across all FMS
                            modules immediately.
                        </p>
                    </div>
                    <div className="border-t border-white/10 pt-6">
                        <p className="text-xs font-medium text-blue-300 italic">
                            Centralized Authentication System v2.0
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:w-[45%]">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-slate-900">
                            Set new password
                        </h2>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Please choose a strong password for{" "}
                            <span className="font-bold text-slate-900">
                                {email}
                            </span>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
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
                                    className="pl-10 h-11 bg-slate-100 border-slate-200 cursor-not-allowed opacity-70"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-semibold text-slate-900"
                            >
                                New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className={`pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    required
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

                        <div className="space-y-2">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-sm font-semibold text-slate-900"
                            >
                                Confirm New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="password_confirmation"
                                    type={showPassword ? "text" : "password"}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    className="pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-slate-900 text-white hover:bg-blue-600 font-bold shadow-md transition-all mt-4"
                            disabled={processing}
                        >
                            {processing ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                "Update Password"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
