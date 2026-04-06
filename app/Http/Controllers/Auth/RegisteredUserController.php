<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class.'|ends_with:@iiti.ac.in',
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ], [
            'email.ends_with' => 'You must use a valid @iiti.ac.in institutional email address.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Added the ->with() flash messages to trigger the toasts
        return match ($user->role) {
            'admin' => redirect()->route('admin.dashboard')->with('success', 'Admin account provisioned successfully.'),
            'hod' => redirect()->route('hod.dashboard')->with('success', 'HOD account provisioned successfully.'),
            default => redirect()->route('faculty.dashboard')->with('success', 'Your faculty profile has been created successfully!'),
        };
    }
}