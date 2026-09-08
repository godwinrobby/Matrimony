<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MatchmakingController;
use App\Http\Controllers\Api\AssistantController;
use App\Http\Controllers\Api\HoroscopeController;
use App\Http\Controllers\Api\DailyHoroscopeController;
use App\Http\Controllers\Api\AiSearchController;
use Illuminate\Support\Facades\Route;

// Public auth endpoints
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/admin/login', [AuthController::class, 'adminLogin']);
Route::post('/auth/refresh', [AuthController::class, 'refresh']);
Route::post('/auth/logout', [AuthController::class, 'logout']);

// Public matchmaking / AI endpoints
Route::post('/compatibility', [MatchmakingController::class, 'compatibility']);
Route::post('/horoscope-match', [HoroscopeController::class, 'match']);
Route::post('/daily-horoscope', [DailyHoroscopeController::class, 'generate']);
Route::post('/pundit-chat', [AssistantController::class, 'punditChat']);
Route::post('/profile-chat', [AssistantController::class, 'profileChat']);
Route::post('/ai-search', [AiSearchController::class, 'search']);
Route::post('/cashfree/create-order', [AssistantController::class, 'createOrder']);
Route::post('/cashfree/verify-payment', [AssistantController::class, 'verifyPayment']);

// Protected endpoints
Route::middleware('auth')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
});

// Admin-protected endpoints
Route::middleware('auth:admin')->group(function () {
    Route::get('/auth/admin/users', [AuthController::class, 'adminUsers']);
    Route::get('/auth/admin/profiles/{userId}', [AuthController::class, 'adminProfile']);
});