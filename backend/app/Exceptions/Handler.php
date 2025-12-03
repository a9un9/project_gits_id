<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;

class Handler extends ExceptionHandler
{
    public function render($request, Throwable $e)
    {
        if ($request->expectsJson()) {
            $status = 500;
            $message = $e->getMessage();
            if ($e instanceof ModelNotFoundException) {
                $status = 404;
                $message = 'Not Found';
            }
            
            if ($e instanceof ValidationException) {
                return response()->json(['errors' => $e->errors()], 422);
            }
            return response()->json(['error' => $message], $status);
        }
        return parent::render($request, $e);
    }
}