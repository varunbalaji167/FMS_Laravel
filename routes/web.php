<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\LeaveReportController;
use App\Http\Controllers\AnnexureController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AdminAnnexureController;
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
    Route::get('/leaves/report/pdf', [LeaveReportController::class, 'exportPDF'])->name('leaves.report.pdf');
    Route::get('/leaves/report/excel', [LeaveReportController::class, 'exportExcel'])->name('leaves.report.excel');

    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/announcements/create', [AnnouncementController::class, 'create'])->name('announcements.create');
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    
    // Annexure routes
    Route::resource('annexures', AdminAnnexureController::class)->only(['index', 'show']);
    Route::get('/annexures/{annexure}/review', [AdminAnnexureController::class, 'review'])->name('annexures.review');
    Route::post('/annexures/{annexure}/approve', [AdminAnnexureController::class, 'approve'])->name('annexures.approve');
    Route::post('/annexures/{annexure}/reject', [AdminAnnexureController::class, 'reject'])->name('annexures.reject');
    Route::get('/annexures/{annexure}/sign', [AdminAnnexureController::class, 'sign'])->name('annexures.sign');
    Route::post('/annexures/{annexure}/save-signature', [AdminAnnexureController::class, 'saveSignature'])->name('annexures.save-signature');
    Route::get('/annexures/{annexure}/preview-pdf', [AdminAnnexureController::class, 'previewPdf'])->name('annexures.preview-pdf');
    Route::get('/annexures/{annexure}/download-pdf', [AdminAnnexureController::class, 'downloadPdf'])->name('annexures.download-pdf');
    Route::get('/annexures/{annexure}/edit', [AdminAnnexureController::class, 'edit'])->name('annexures.edit');
    Route::patch('/annexures/{annexure}', [AdminAnnexureController::class, 'update'])->name('annexures.update');
    Route::post('/annexures/{annexure}/archive', [AdminAnnexureController::class, 'archive'])->name('annexures.archive');
    Route::get('/annexures/{annexure}/versions', [AdminAnnexureController::class, 'getVersionHistory'])->name('annexures.versions');
    Route::get('/annexures/{annexure}/activities', [AdminAnnexureController::class, 'getActivityHistory'])->name('annexures.activities');
});


// HOD ROUTES

Route::middleware(['auth', 'role:hod'])->prefix('hod')->name('hod.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Hod/Dashboard');
    })->name('dashboard');
    
    Route::get('/leaves/pending-recommendations', [LeaveController::class, 'pendingRecommendations'])->name('leaves.pending-recommendations');
    Route::post('/leaves/{leave}/recommend', [LeaveController::class, 'recommendLeave'])->name('leaves.recommend');
    Route::get('/leaves/report', [LeaveReportController::class, 'hodReport'])->name('leaves.report');
    Route::get('/leaves/report/pdf', [LeaveReportController::class, 'exportPDF'])->name('leaves.report.pdf');
    Route::get('/leaves/report/excel', [LeaveReportController::class, 'exportExcel'])->name('leaves.report.excel');

    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/announcements/create', [AnnouncementController::class, 'create'])->name('announcements.create');
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
});


// FACULTY ROUTES

Route::middleware(['auth', 'role:faculty'])->prefix('faculty')->name('faculty.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Faculty/Dashboard');
    })->name('dashboard');
    
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile');
    Route::post('/profile/dependents', [ProfileController::class, 'storeDependents'])->name('dependents.store');
    Route::patch('/profile/dependents/{dependent}', [ProfileController::class, 'updateDependents'])->name('dependents.update');
    Route::delete('/profile/dependents/{dependent}', [ProfileController::class, 'destroyDependents'])->name('dependents.destroy');
    
    Route::get('/leaves/apply', [LeaveController::class, 'create'])->name('leaves.create');
    Route::post('/leaves', [LeaveController::class, 'store'])->name('leaves.store');
    Route::get('/leaves', [LeaveController::class, 'index'])->name('leaves.index');
    Route::get('/leaves/report', [LeaveReportController::class, 'facultyReport'])->name('leaves.report');

    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    
    // Annexure routes
    Route::resource('annexures', AnnexureController::class);
    Route::post('/annexures/{annexure}/submit', [AnnexureController::class, 'submit'])->name('annexures.submit');
    Route::post('/annexures/{annexure}/restore-draft', [AnnexureController::class, 'restoreDraft'])->name('annexures.restore-draft');
    Route::get('/annexures/{annexure}/latest-draft', [AnnexureController::class, 'getLatestDraft'])->name('annexures.latest-draft');
    Route::get('/annexures/{annexure}/download-pdf', [AnnexureController::class, 'downloadPdf'])->name('annexures.download-pdf');
    Route::get('/annexures/{annexure}/activities', [AnnexureController::class, 'getActivityHistory'])->name('annexures.activities');
});


// SHARED AUTH ROUTES (Profile settings, etc)

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';