<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Apply permissive CORS headers so the React SPA (on a different origin)
 * can call this API from the browser.
 */
class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->header('Origin', '*');
        $allowed = env('CORS_ORIGIN', '*');
        $allow = $allowed === '*' ? '*' : $origin;

        $response = $next($request);
        $response->header('Access-Control-Allow-Origin', $allow);
        $response->header('Access-Control-Allow-Credentials', 'true');
        $response->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        $response->header('Vary', 'Origin');

        return $response;
    }
}