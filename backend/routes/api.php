<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\BookController;


Route::post('auth/register',[AuthController::class,'register']);
Route::post('auth/login',[AuthController::class,'login']);
Route::post('auth/logout',[AuthController::class,'logout'])->middleware('auth:api');
Route::get('/authors/list', [AuthorController::class, 'list']);
Route::get('/publishers/list', [PublisherController::class, 'list']);

Route::middleware('auth:api')->group(function(){
    Route::apiResource('authors', AuthorController::class);
    Route::apiResource('publishers', PublisherController::class);
    Route::apiResource('books', BookController::class);
    Route::post('auth/logout',[AuthController::class,'logout']);
});

