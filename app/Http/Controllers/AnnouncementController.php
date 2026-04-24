<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $announcements = Announcement::with('publisher')
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = trim($request->string('search'));
                $query->where(function ($subQuery) use ($search) {
                    $subQuery->where('title', 'like', "%{$search}%")
                        ->orWhere('body', 'like', "%{$search}%");
                });
            })
            ->when($user->role === 'faculty', function ($query) {
                $query->where('is_active', true)
                    ->where(function ($subQuery) {
                        $subQuery->whereIn('audience', ['faculty', 'all'])
                            ->orWhere('audience', 'faculty');
                    });
            })
            ->latest('published_at')
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'filters' => $request->only(['search']),
            'canPublish' => in_array($user->role, ['admin', 'hod'], true),
            'role' => $user->role,
        ]);
    }

    public function create(Request $request)
    {
        abort_unless(in_array($request->user()->role, ['admin', 'hod'], true), 403);

        return Inertia::render('Announcements/Create', [
            'role' => $request->user()->role,
        ]);
    }

    public function store(Request $request)
    {
        abort_unless(in_array($request->user()->role, ['admin', 'hod'], true), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'audience' => ['required', 'in:faculty,hod,admin,all'],
        ]);

        Announcement::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'body' => $validated['body'],
            'audience' => $validated['audience'],
            'is_active' => true,
            'published_at' => now(),
        ]);

        $routeName = $request->user()->role . '.announcements.index';

        return redirect()->route($routeName)->with('success', 'Announcement published successfully.');
    }
}