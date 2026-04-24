import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Megaphone, CalendarDays, User, Plus } from 'lucide-react';
import FacultyLayout from '@/Layouts/FacultyLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import HodLayout from '@/Layouts/HodLayout';
import { Button } from '@/components/ui/button';

const layoutMap = {
    admin: AdminLayout,
    hod: HodLayout,
    faculty: FacultyLayout,
};

export default function AnnouncementsIndex({ announcements = { data: [] }, filters = {}, canPublish = false, role = 'faculty' }) {
    const [search, setSearch] = useState(filters.search || '');
    const Layout = layoutMap[role] || FacultyLayout;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route(`${role}.announcements.index`), search ? { search } : {}, { preserveScroll: true, preserveState: true });
    };

    return (
        <Layout>
            <Head title="Announcements" />

            <div className="max-w-6xl mx-auto py-6 space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
                            <Megaphone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
                            <p className="text-sm text-slate-600 mt-1">Official notices from administration and department heads</p>
                        </div>
                    </div>
                    {canPublish && (
                        <Link href={route(`${role}.announcements.create`)}>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-5 shadow-sm">
                                <Plus className="h-4 w-4 mr-2" /> Publish Notice
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4">
                    <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search announcements..."
                                className="w-full h-11 pl-10 pr-3 rounded-md border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-6">Search</Button>
                    </form>
                </div>

                <div className="space-y-4">
                    {announcements.data.length > 0 ? announcements.data.map((item) => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                            {item.audience.toUpperCase()}
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                                    <p className="text-sm text-slate-700 leading-6 whitespace-pre-line">{item.body}</p>
                                </div>
                                <div className="text-sm text-slate-500 shrink-0 md:text-right">
                                    <div className="flex items-center gap-2 md:justify-end">
                                        <User className="h-4 w-4" /> {item.publisher?.name || '-'}
                                    </div>
                                    <div className="flex items-center gap-2 md:justify-end mt-1">
                                        <CalendarDays className="h-4 w-4" /> {item.published_at ? new Date(item.published_at).toLocaleString() : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-10 text-center text-slate-500">
                            No announcements found.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}