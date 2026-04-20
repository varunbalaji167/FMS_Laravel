<?php

use App\Http\Controllers\AnnexureController;
use App\Http\Controllers\AdminAnnexureController;
use Illuminate\Support\Facades\Route;

// Faculty routes
Route::prefix('faculty/annexures')->middleware('auth')->group(function () {
    Route::get('/', [AnnexureController::class, 'index'])->name('faculty.annexures.index');
    Route::get('templates', [AnnexureController::class, 'templates'])->name('faculty.annexures.templates');
    Route::get('create/{template}', [AnnexureController::class, 'create'])->name('faculty.annexures.create');
    Route::post('create/{template}', [AnnexureController::class, 'store'])->name('faculty.annexures.store');
    
    Route::get('{annexureRequest}/edit', [AnnexureController::class, 'edit'])->name('faculty.annexures.edit');
    Route::post('{annexureRequest}/draft', [AnnexureController::class, 'saveDraft'])->name('faculty.annexures.save-draft');
    Route::post('{annexureRequest}/submit', [AnnexureController::class, 'submit'])->name('faculty.annexures.submit');
    
    Route::get('{annexureRequest}', [AnnexureController::class, 'show'])->name('faculty.annexures.show');
    Route::get('{annexureRequest}/download/{versionId}', [AnnexureController::class, 'downloadPdf'])->name('faculty.annexures.download');
    Route::get('{annexureRequest}/timeline', [AnnexureController::class, 'auditTimeline'])->name('faculty.annexures.timeline');
});

// Admin routes
Route::prefix('admin/annexures')->middleware('auth')->group(function () {
    // Annexure requests
    Route::get('/', [AdminAnnexureController::class, 'index'])->name('admin.annexures.index');
    Route::get('my-assignments', [AdminAnnexureController::class, 'myAssignments'])->name('admin.annexures.my-assignments');
    
    Route::get('{annexureRequest}/review', [AdminAnnexureController::class, 'review'])->name('admin.annexures.review');
    Route::post('{annexureRequest}/assign', [AdminAnnexureController::class, 'assign'])->name('admin.annexures.assign');
    Route::post('{annexureRequest}/edit', [AdminAnnexureController::class, 'edit'])->name('admin.annexures.edit');
    Route::post('{annexureRequest}/revision', [AdminAnnexureController::class, 'requestRevision'])->name('admin.annexures.request-revision');
    Route::post('{annexureRequest}/approve', [AdminAnnexureController::class, 'approve'])->name('admin.annexures.approve');
    Route::post('{annexureRequest}/sign', [AdminAnnexureController::class, 'sign'])->name('admin.annexures.sign');
    Route::post('{annexureRequest}/reject', [AdminAnnexureController::class, 'reject'])->name('admin.annexures.reject');
    
    Route::get('{annexureRequest}/download/{versionId}', [AdminAnnexureController::class, 'downloadPdf'])->name('admin.annexures.download');
    Route::get('{annexureRequest}/timeline', [AdminAnnexureController::class, 'auditTimeline'])->name('admin.annexures.timeline');
    
    // Templates
    Route::get('templates/manage', [AdminAnnexureController::class, 'templates'])->name('admin.annexures.templates');
    Route::get('templates/create', [AdminAnnexureController::class, 'createTemplate'])->name('admin.annexures.create-template');
    Route::post('templates', [AdminAnnexureController::class, 'storeTemplate'])->name('admin.annexures.store-template');
    Route::get('templates/{template}/edit', [AdminAnnexureController::class, 'editTemplate'])->name('admin.annexures.edit-template');
    Route::patch('templates/{template}', [AdminAnnexureController::class, 'updateTemplate'])->name('admin.annexures.update-template');
});
