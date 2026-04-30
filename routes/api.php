<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PreBanquaireController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/inscription', [AuthController::class, 'inscription']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/check-email', [AuthController::class, 'checkEmail']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pre-bancaires',       [PreBanquaireController::class, 'index']);
    Route::post('/pre-bancaires',      [PreBanquaireController::class, 'store']);
    Route::put('/pre-bancaires/{id}',  [PreBanquaireController::class, 'update']);
    Route::delete('/pre-bancaires/{id}', [PreBanquaireController::class, 'destroy']);
});
