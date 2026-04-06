import { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Building2,
    Lock,
    Mail,
    Eye,
    EyeOff,
    Loader2,
    UserPlus,
    ArrowLeft,
    User,
    ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ToastListener from "@/Components/ToastListener";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            preserveScroll: true,
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="flex min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
            <ToastListener />
            <Head title="Faculty Registration | IIT Indore" />

            {/* Left Panel - Branding Area */}
            <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between bg-slate-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2866&auto=format&fit=crop"
                    alt="IIT Indore Administration"
                    className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale-[0.3]"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-900/60" />

                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-sm">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-tight uppercase">
                                IIT Indore
                            </p>
                            <p className="text-xs font-medium text-slate-300">
                                Faculty Management Portal
                            </p>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <h1 className="font-serif text-4xl font-bold leading-tight drop-shadow-sm">
                            Initialize your digital workspace
                        </h1>
                        <p className="mt-4 text-base text-slate-300 font-medium leading-relaxed">
                            Register your institutional account to activate your
                            faculty profile, manage service requests, and access
                            internal departmental workflows.
                        </p>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <p className="text-sm text-slate-300 italic leading-relaxed">
                            &ldquo;Technology is best when it brings people
                            together and streamlines the pursuit of
                            knowledge.&rdquo;
                        </p>
                        <p className="mt-2 text-xs font-medium text-blue-300">
                            - IT Infrastructure
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form Area */}
            <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:w-[45%]">
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

                    <div className="mb-6">
                        <h2 className="font-serif text-2xl font-bold text-slate-900">
                            System Registration
                        </h2>
                        <p className="mt-2 text-sm font-medium text-slate-500">
                            Register as a new faculty member to begin.
                        </p>
                    </div>

                    {/* Domain Restriction Notice */}
                    <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 p-3.5 rounded-xl shadow-sm">
                        <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 text-amber-600" />
                        <p className="text-xs font-medium leading-relaxed">
                            <strong className="font-bold text-amber-900 block mb-1">
                                Security Notice
                            </strong>
                            Access is strictly limited to active faculty. You
                            MUST register using your official{" "}
                            <span className="bg-amber-200 px-1 rounded font-bold text-amber-900">
                                @iiti.ac.in
                            </span>{" "}
                            email address.
                        </p>
                    </div>

                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-semibold text-slate-900"
                            >
                                Full Legal Name
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Dr. John Doe"
                                    className={`pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                    disabled={processing}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs font-medium text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

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
                                    placeholder="username@iiti.ac.in"
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-semibold text-slate-900"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        placeholder="••••••••"
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

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-semibold text-slate-900"
                                >
                                    Confirm
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        id="password_confirmation"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                                        disabled={processing}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="h-11 font-bold mt-4 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                    Provisioning Account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />{" "}
                                    Register Directory Access
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-sm font-medium text-slate-500">
                            Already have access?{" "}
                            <Link
                                href={route("login")}
                                className="font-bold text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Return to Login
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="h-3 w-3" /> Back to Portal
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
