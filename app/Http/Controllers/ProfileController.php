<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Dependent;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Display the faculty profile page with dependents.
     */
    public function show(): Response
    {
        $user = auth()->user()->load('faculty', 'dependents');
        
        return Inertia::render('Faculty/Profile', [
            'user' => $user,
            'dependents' => $user->dependents,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Store a new dependent.
     */
    public function storeDependents(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|in:spouse,son,daughter,father,mother,brother,sister,other',
            'date_of_birth' => 'nullable|date',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'aadhar_number' => 'nullable|string|max:12',
        ]);

        auth()->user()->dependents()->create($validated);

        return Redirect::route('faculty.profile')->with('success', 'Dependent added successfully.');
    }

    /**
     * Update a dependent.
     */
    public function updateDependents(Request $request, Dependent $dependent): RedirectResponse
    {
        $this->authorize('update', $dependent);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'relationship' => 'required|in:spouse,son,daughter,father,mother,brother,sister,other',
            'date_of_birth' => 'nullable|date',
            'contact_number' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'aadhar_number' => 'nullable|string|max:12',
        ]);

        $dependent->update($validated);

        return Redirect::route('faculty.profile')->with('success', 'Dependent updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Delete a dependent.
     */
    public function destroyDependents(Dependent $dependent): RedirectResponse
    {
        $this->authorize('delete', $dependent);

        $dependent->delete();

        return Redirect::route('faculty.profile')->with('success', 'Dependent removed successfully.');
    }
}
