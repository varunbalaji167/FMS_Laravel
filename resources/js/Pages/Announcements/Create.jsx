import { Head, useForm } from '@inertiajs/react';
import FacultyLayout from '@/Layouts/FacultyLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import HodLayout from '@/Layouts/HodLayout';
import { Button } from '@/components/ui/button';

const layoutMap = {
    admin: AdminLayout,
    hod: HodLayout,
};

export default function AnnouncementCreate({ role }) {
    const Layout = layoutMap[role] || FacultyLayout;
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        body: '',
        audience: 'faculty',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route(`${role}.announcements.store`));
    };

    return (
        <Layout>
            <Head title="Publish Announcement" />

            <div className="max-w-4xl mx-auto py-6">
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Publish Announcement</h1>
                    <p className="text-sm text-slate-600 mb-6">Create a notice for faculty members.</p>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                            <textarea
                                value={data.body}
                                onChange={(e) => setData('body', e.target.value)}
                                rows="6"
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.body && <p className="mt-1 text-xs text-red-600">{errors.body}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Audience</label>
                            <select
                                value={data.audience}
                                onChange={(e) => setData('audience', e.target.value)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="faculty">Faculty</option>
                                <option value="hod">HOD</option>
                                <option value="admin">Admin</option>
                                <option value="all">All Users</option>
                            </select>
                            {errors.audience && <p className="mt-1 text-xs text-red-600">{errors.audience}</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Publish
                            </Button>
                            <Button type="button" variant="outline" onClick={() => window.history.back()} className="border-slate-300 text-slate-700">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}