import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Shield,
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ToastListener from "@/Components/ToastListener";

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        {
            name: "DOFA Overview",
            href: route("admin.dashboard"),
            icon: LayoutDashboard,
            active: route().current("admin.dashboard"),
        },
        { name: "Master Directory", href: "#", icon: Users, active: false },
        { name: "Institute Reports", href: "#", icon: FileText, active: false },
        { name: "Global Settings", href: "#", icon: Settings, active: false },
    ];

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-800 bg-slate-950">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-600 shadow-lg shadow-rose-900/50">
                    <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="font-bold tracking-tight text-white leading-none mb-1">
                        FMS Core
                    </p>
                    <p className="text-[10px] font-black tracking-widest text-rose-500 uppercase">
                        Root Access
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 bg-slate-950 overflow-y-auto">
                {navLinks.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${item.active ? "bg-rose-600 text-white shadow-md shadow-rose-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950 mt-auto">
                <div className="flex items-center gap-3 mb-4 px-2 text-white">
                    <div className="h-10 w-10 rounded-full bg-rose-950 border border-rose-900 flex items-center justify-center font-bold text-rose-400 shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">
                            {user.name}
                        </p>
                        <p className="text-[10px] text-rose-500 font-black uppercase">
                            DOFA Root
                        </p>
                    </div>
                </div>
                <Button
                    variant="destructive"
                    className="w-full bg-rose-950/30 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-900/50 transition-all"
                    asChild
                >
                    <Link href={route("logout")} method="post" as="button">
                        <LogOut className="h-4 w-4 mr-2" /> Terminate Session
                    </Link>
                </Button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">
            <ToastListener />

            <aside className="hidden md:flex flex-col w-64 bg-slate-950 fixed inset-y-0 z-50 border-r border-slate-800 shadow-2xl">
                <SidebarContent />
            </aside>

            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="md:hidden flex justify-between items-center bg-slate-950 text-white h-16 px-4 sticky top-0 z-40 border-b border-rose-900/20">
                    <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 text-rose-500" />
                        <span className="font-bold tracking-tight uppercase text-xs">
                            Faculty Affairs Portal
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}
                <div
                    className={`fixed top-0 left-0 h-full w-[280px] bg-slate-950 z-[60] flex flex-col transform transition-transform duration-300 ease-in-out md:hidden border-r border-rose-900/30 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <SidebarContent />
                </div>

                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
