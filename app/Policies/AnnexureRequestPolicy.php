<?php

namespace App\Policies;

use App\Models\AnnexureRequest;
use App\Models\User;

class AnnexureRequestPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if ($user->isAdmin() || $user->isHod()) {
            return true;
        }

        return null;
    }

    public function view(User $user, AnnexureRequest $annexureRequest): bool
    {
        return (int) $annexureRequest->user_id === (int) $user->id;
    }

    public function update(User $user, AnnexureRequest $annexureRequest): bool
    {
        return (int) $annexureRequest->user_id === (int) $user->id;
    }

    public function delete(User $user, AnnexureRequest $annexureRequest): bool
    {
        return (int) $annexureRequest->user_id === (int) $user->id;
    }
}
