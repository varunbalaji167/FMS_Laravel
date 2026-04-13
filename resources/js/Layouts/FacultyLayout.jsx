import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Building2,
    LayoutDashboard,
    FileText,
    User,
    LogOut,
    Menu,
    X,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ToastListener from "@/Components/ToastListener";

export default function FacultyLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user || {};
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        {
            name: "Dashboard",
            href: route("faculty.dashboard"),
            icon: LayoutDashboard,
            active: route().current("faculty.dashboard"),
        },
        { name: "My Profile", href: "#", icon: User, active: false },
        {
            name: "Leaves",
            href: route("faculty.leaves.index"),
            icon: Calendar,
            active: route().current("faculty.leaves.index"),
        },
        { name: "Service Requests", href: "#", icon: FileText, active: false },
    ];

    const SidebarContent = () => (
        <>
            <div className="flex items-center gap-3 px-6 h-20 border-b border-slate-800">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600 shadow-sm">
                    <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="font-bold tracking-tight text-white">
                        IIT Indore
                    </p>
                    <p className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                        Faculty Portal
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                {navLinks.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-colors ${item.active ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 mt-auto">
                <div className="flex items-center gap-3 mb-4 px-2 text-white">
                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            {user.email}
                        </p>
                    </div>
                </div>
                <Button
                    variant="destructive"
                    className="w-full bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white border-none transition-all"
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

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-slate-900 fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                <header className="md:hidden flex justify-between items-center bg-slate-900 text-white h-16 px-4 sticky top-0 z-40 shadow-lg">
                    <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-blue-500" />
                        <span className="font-bold tracking-tight uppercase text-sm">
                            Faculty Portal
                        </span>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-slate-300 hover:text-white transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </header>

                {/* Mobile Drawer Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-white p-2 bg-slate-800 rounded-full"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Mobile Drawer */}
                <div
                    className={`fixed top-0 left-0 h-full w-[280px] bg-slate-900 z-[60] flex flex-col transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <SidebarContent />
                </div>

                <main className="flex-1 p-4 md:p-8">{children}</main>
            </div>
        </div>
    );
}
