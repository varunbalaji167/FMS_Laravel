<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'role' => ['required', 'string', 'in:faculty,admin'], // Validates the toggle state from frontend
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        // 1. Fetch the user by email first to check their stored role
        $user = User::where('email', $this->email)->first();

        if ($user) {
            $selectedPortal = $this->role; // 'faculty' or 'admin' from the UI toggle

            if ($selectedPortal === 'faculty') {
                // If user chose Faculty Portal, they MUST have the 'faculty' role
                if ($user->role !== 'faculty') {
                    throw ValidationException::withMessages([
                        'email' => 'This account does not have Faculty access. Please use the Admin/HOD portal.',
                    ]);
                }
            } else {
                // If user chose Admin/HOD Portal, they MUST be 'admin' or 'hod'
                if (!in_array($user->role, ['admin', 'hod'])) {
                    throw ValidationException::withMessages([
                        'email' => 'This account does not have Administrative access.',
                    ]);
                }
            }
        }

        // 2. Proceed with standard password/credential verification
        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}