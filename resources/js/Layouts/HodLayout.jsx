import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Building2,
    LayoutDashboard,
    Users,
    CheckCircle,
    Award,
    LogOut,
    Menu,
    X,
    BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ToastListener from "@/Components/ToastListener";

export default function HodLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        {
            name: "Dept Dashboard",
            href: route("hod.dashboard"),
            icon: LayoutDashboard,
            active: route().current("hod.dashboard"),
        },
        { name: "Faculty Directory", href: "#", icon: Users, active: false },
        {
            name: "Leave Recommendations",
            href: route("hod.leaves.pending-recommendations"),
            icon: CheckCircle,
            active: route().current("hod.leaves.pending-recommendations"),
        },
        {
            name: "Leave Reports",
            href: route("hod.leaves.report"),
            icon: BarChart3,
            active: route().current("hod.leaves.report"),
        },
        { name: "Appraisal Review", href: "#", icon: Award, active: false },
    ];

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-800">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-600 shadow-sm shadow-indigo-900/50">
                    <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="font-bold tracking-tight text-white">
                        IIT Indore
                    </p>
                    <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
                        HOD Workspace
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navLinks.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${item.active ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 mt-auto">
                <div className="flex items-center gap-3 mb-4 px-2 text-white">
                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400 shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">
                            {user.name}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">
                            Department Head
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                    asChild
                >
                    <Link href={route("logout")} method="post" as="button">
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Link>
                </Button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <ToastListener />
            <aside className="hidden md:flex flex-col w-64 bg-slate-950 fixed inset-y-0 z-50 shadow-2xl">
                <SidebarContent />
            </aside>

            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="md:hidden flex justify-between items-center bg-slate-950 text-white h-16 px-4 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-indigo-500" />
                        <span className="font-bold tracking-tight uppercase text-sm">
                            HOD Workspace
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
                <div
                    className={`fixed top-0 left-0 h-full w-[280px] bg-slate-950 z-[60] flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <SidebarContent />
                </div>

                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
