<?php
// Quick test script to verify annexure system setup

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use App\Models\AnnexureTemplate;
use App\Models\AnnexureRequest;

echo "\n=== ANNEXURE SYSTEM TEST ===\n\n";

// Check if faculty user exists
$faculty = User::where('role', 'faculty')->first();
if ($faculty) {
    echo "✓ Faculty user found: {$faculty->name}\n";
    echo "  Email: {$faculty->email}\n";
} else {
    echo "✗ No faculty user found\n";
    exit(1);
}

// Check templates
$templates = AnnexureTemplate::active()->get();
echo "\n✓ Active templates: {$templates->count()}\n";
foreach ($templates as $t) {
    echo "  - {$t->name} ({$t->code})\n";
}

if ($templates->count() < 5) {
    echo "✗ Expected 5 templates, got {$templates->count()}\n";
    exit(1);
}

echo "\n✓ System is ready for creating annexure requests\n";
echo "\n=== TEST PASSED ===\n\n";
