<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        // Policies handled at controller level with ensureOwner() method
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
