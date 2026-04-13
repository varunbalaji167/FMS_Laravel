<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\LeaveReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});


// ADMIN ROUTES

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard'); 
    })->name('dashboard');
    
    Route::get('/leaves/pending-approvals', [LeaveController::class, 'pendingApprovals'])->name('leaves.pending-approvals');
    Route::post('/leaves/{leave}/approve', [LeaveController::class, 'approveLeave'])->name('leaves.approve');
    Route::get('/leaves/report', [LeaveReportController::class, 'adminReport'])->name('leaves.report');
    Route::get('/leaves/report/export', [LeaveReportController::class, 'exportCSV'])->name('leaves.report.export');
});


// HOD ROUTES

Route::middleware(['auth', 'role:hod'])->prefix('hod')->name('hod.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Hod/Dashboard');
    })->name('dashboard');
    
    Route::get('/leaves/pending-recommendations', [LeaveController::class, 'pendingRecommendations'])->name('leaves.pending-recommendations');
    Route::post('/leaves/{leave}/recommend', [LeaveController::class, 'recommendLeave'])->name('leaves.recommend');
    Route::get('/leaves/report', [LeaveReportController::class, 'hodReport'])->name('leaves.report');
    Route::get('/leaves/report/export', [LeaveReportController::class, 'exportCSV'])->name('leaves.report.export');
});


// FACULTY ROUTES

Route::middleware(['auth', 'role:faculty'])->prefix('faculty')->name('faculty.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Faculty/Dashboard');
    })->name('dashboard');
    
    Route::get('/leaves/apply', [LeaveController::class, 'create'])->name('leaves.create');
    Route::post('/leaves', [LeaveController::class, 'store'])->name('leaves.store');
    Route::get('/leaves', [LeaveController::class, 'index'])->name('leaves.index');
    Route::get('/leaves/report', [LeaveReportController::class, 'facultyReport'])->name('leaves.report');
});


// SHARED AUTH ROUTES (Profile settings, etc)

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';