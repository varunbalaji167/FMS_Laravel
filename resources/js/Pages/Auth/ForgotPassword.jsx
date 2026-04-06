import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ToastListener from '@/Components/ToastListener';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="flex min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
            <ToastListener />
            <Head title="Forgot Password | FMS" />

            {/* Left Panel */}
            <div className="relative hidden lg:flex lg:w-[55%] flex-col justify-between bg-slate-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2940&auto=format&fit=crop"
                    alt="IIT Indore Library"
                    className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-slate-900/60" />
                <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm shadow-sm">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-sm tracking-tight uppercase">IIT Indore</p>
                            <p className="text-xs font-medium text-slate-300">Faculty Management Portal</p>
                        </div>
                    </div>
                    <div className="max-w-md">
                        <h1 className="font-serif text-4xl font-bold leading-tight">Security & Recovery</h1>
                        <p className="mt-4 text-base text-slate-300 font-medium leading-relaxed">
                            Lost your access? Provide your institutional email and we'll help you securely reset your credentials to get you back to your workspace.
                        </p>
                    </div>
                    <div className="border-t border-white/10 pt-6">
                        <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} IIT Indore. Managed by IT Services.</p>
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-1 flex-col items-center justify-center bg-white px-6 py-12 lg:w-[45%]">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <KeyRound className="h-6 w-6" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-slate-900">Reset your password</h2>
                        <p className="mt-2 text-sm font-medium text-slate-500 italic">
                            Enter your official <span className="font-bold text-slate-900">@iiti.ac.in</span> email below.
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-semibold text-slate-900">Institutional Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="username@iiti.ac.in"
                                    className={`pl-10 h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                    required
                                />
                            </div>
                            {errors.email && <p className="text-xs font-medium text-red-500">{errors.email}</p>}
                        </div>

                        <Button type="submit" className="w-full h-11 bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md transition-all" disabled={processing}>
                            {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Email Reset Link"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <Link href={route('login')} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}