import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    LayoutDashboard,
    FileText,
    CalendarCheck,
    ChevronRight,
    Building2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Welcome({ auth }) {
    const user = auth?.user;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="flex min-h-screen flex-col bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
            <Head title="Faculty Management Portal | IIT Indore" />

            {/* Glassmorphism Header */}
            <header className="fixed top-0 z-[100] w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl transition-all duration-300">
                <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform duration-300">
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                                IIT INDORE
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                                Faculty Management
                            </span>
                        </div>
                    </div>

                    <nav className="flex items-center gap-6">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="hidden md:block text-sm font-semibold text-slate-500 italic">
                                    Welcome back, {user.name.split(" ")[0]}
                                </span>
                                <Button
                                    className="bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-md rounded-full px-6"
                                    asChild
                                >
                                    <Link href={route(
                                        user.role === 'admin' ? 'admin.dashboard' :
                                        user.role === 'hod' ? 'hod.dashboard' :
                                        'faculty.dashboard'
                                    )}>
                                        Dashboard{" "}
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="hidden sm:block text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
                                >
                                    Admin Access
                                </Link>
                                <Button
                                    className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200 rounded-full px-8 h-11 transition-all hover:-translate-y-0.5"
                                    asChild
                                >
                                    <Link href={route("login")}>
                                        Faculty Login
                                    </Link>
                                </Button>
                            </>
                        )}
                    </nav>
                </div>
            </header>

            <main className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2886&auto=format&fit=crop"
                            alt="Campus Administration"
                            className="h-full w-full object-cover opacity-20 grayscale-[0.3]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="container relative mx-auto px-6 lg:px-12 z-10"
                    >
                        <motion.div
                            variants={itemVariants}
                            className="inline-flex items-center rounded-full border border-slate-400/30 bg-slate-500/10 px-4 py-2 text-xs font-bold text-slate-300 backdrop-blur-md mb-8 tracking-widest uppercase"
                        >
                            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-3 animate-pulse"></span>
                            Internal Portal Active
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl max-w-5xl leading-[1.1]"
                        >
                            Empowering{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                                Academic Excellence
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="mt-8 text-xl leading-relaxed text-slate-300 max-w-2xl font-medium"
                        >
                            The centralized hub for faculty profiles, leave
                            management, research tracking, and institutional
                            administration at IIT Indore.
                        </motion.p>

                        <motion.div
                            variants={itemVariants}
                            className="mt-12 flex flex-wrap items-center gap-6"
                        >
                            {user ? (
                                <Button
                                    size="lg"
                                    className="h-16 px-10 text-lg bg-blue-600 text-white hover:bg-blue-500 rounded-full shadow-2xl shadow-blue-600/30 transition-all group"
                                    asChild
                                >
                                    <Link href={route(
                                        user.role === 'admin' ? 'admin.dashboard' :
                                        user.role === 'hod' ? 'hod.dashboard' :
                                        'faculty.dashboard'
                                    )}>
                                        Access Workspace{" "}
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        size="lg"
                                        className="h-16 px-10 text-lg bg-white text-slate-950 hover:bg-slate-100 rounded-full shadow-2xl transition-all"
                                        asChild
                                    >
                                        <Link href={route("login")}>
                                            Access Faculty Portal
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-16 px-10 text-lg border-2 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 rounded-full transition-all"
                                        asChild
                                    >
                                        <Link href={route("login")}>
                                            HOD Login
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </section>

                {/* System Stats */}
                <section className="bg-white py-12">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-slate-100 py-12">
                            <div className="text-center">
                                <div className="text-4xl font-black text-slate-900">
                                    100%
                                </div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">
                                    Digital Workflows
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-slate-900">
                                    20+
                                </div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">
                                    Academic Departments
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-slate-900">
                                    300+
                                </div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">
                                    Active Faculty Profiles
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-black text-slate-900">
                                    24/7
                                </div>
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">
                                    Portal Accessibility
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FMS Features */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="max-w-3xl mb-16">
                            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.3em] mb-4">
                                Core Modules
                            </h2>
                            <p className="text-4xl font-black text-slate-900">
                                Streamlining daily administration so you can
                                focus on research and teaching.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl"
                            >
                                <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
                                    <LayoutDashboard className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    Comprehensive Profiles
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    Maintain a centralized record of your
                                    publications, ongoing projects, patents, and
                                    academic achievements.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl"
                            >
                                <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8">
                                    <CalendarCheck className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    Leave & Appraisals
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    Seamlessly apply for CL/EL/DL, track
                                    approval statuses, and submit your annual
                                    performance appraisals digitally.
                                </p>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -10 }}
                                className="p-10 rounded-3xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl"
                            >
                                <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8">
                                    <FileText className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    Service Requests
                                </h3>
                                <p className="text-slate-500 leading-relaxed font-medium">
                                    Generate No Objection Certificates (NOCs),
                                    request travel grants, and manage
                                    departmental allowances instantly.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="py-24">
                    <div className="container mx-auto px-6">
                        <div className="rounded-[3rem] bg-gradient-to-br from-slate-800 to-slate-950 p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-slate-200">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                                    Access Your <br /> Administrative Hub
                                </h2>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button
                                        size="lg"
                                        className="h-16 px-12 bg-white text-slate-900 hover:bg-slate-100 rounded-full font-black transition-all shadow-xl"
                                        asChild
                                    >
                                        <Link href={route("login")}>
                                            Log In via SSO
                                        </Link>
                                    </Button>
                                    <Link
                                        href="#"
                                        className="h-16 px-12 inline-flex items-center text-white font-bold hover:underline decoration-2 underline-offset-8"
                                    >
                                        View Portal User Guide
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-50 border-t border-slate-200 py-16">
                <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <Building2 className="h-6 w-6 text-slate-700" />
                            <span className="text-lg font-black tracking-tight text-slate-900">
                                IIT INDORE FMS
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Digitizing administrative workflows and academic
                            lifecycle management for the faculty members of IIT
                            Indore.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">
                            Helpful Links
                        </h4>
                        <ul className="space-y-4 text-sm font-bold text-slate-500">
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    FMS Documentation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    Leave Rules & Guidelines
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="hover:text-blue-600 transition-colors"
                                >
                                    IT Helpdesk Ticket
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-widest text-xs">
                            System Support
                        </h4>
                        <p className="text-slate-500 text-sm font-medium mb-4 italic">
                            Computer Center (CC)
                            <br />
                            Indian Institute of Technology Indore
                            <br />
                            Madhya Pradesh, India
                        </p>
                        <p className="text-blue-600 text-sm font-black">
                            fms-support@iiti.ac.in
                        </p>
                    </div>
                </div>
                <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs font-bold text-slate-400">
                        &copy; {new Date().getFullYear()} IIT Indore. Maintained
                        by IT Infrastructure.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="#"
                            className="text-xs font-bold text-slate-400 hover:text-slate-900"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="#"
                            className="text-xs font-bold text-slate-400 hover:text-slate-900"
                        >
                            System Logs
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
