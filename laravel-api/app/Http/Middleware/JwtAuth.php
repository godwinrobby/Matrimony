<?php

namespace App\Http\Middleware;

use App\Services\TokenService;
use Closure;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\SignatureInvalidException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JwtAuth
{
    /**
     * Require a valid Bearer JWT. Sets authenticated user on the request.
     */
    public function handle(Request $request, Closure $next, ?string $role = null): Response
    {
        $header = $request->header('Authorization', '');
        $token = str_starts_with($header, 'Bearer ') ? substr($header, 7) : '';

        if ($token === '') {
            return response()->json(['error' => 'Missing bearer token'], 401);
        }

        try {
            $payload = TokenService::verifyAccess($token);
        } catch (ExpiredException $e) {
            return response()->json(['error' => 'Token expired'], 401);
        } catch (SignatureInvalidException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Invalid or expired token'], 401);
        }

        $user = \App\Models\User::find((int) $payload['sub']);
        if (!$user || !$user->is_active) {
            return response()->json(['error' => 'Account unavailable'], 401);
        }

        $request->setUserResolver(fn () => $user);
        $request->attributes->set('auth_user', $user);
        $request->attributes->set('auth_payload', $payload);

        // Optional role gate: 'admin'
        if ($role === 'admin' && !$user->isAdmin()) {
            return response()->json(['error' => 'Admin privileges required'], 403);
        }

        return $next($request);
    }
}