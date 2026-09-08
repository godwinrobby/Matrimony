<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\RefreshToken;
use App\Models\User;
use App\Services\FieldCrypto;
use App\Services\TokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    private function issueTokens(User $user): array
    {
        $accessToken = TokenService::signAccess($user->id, $user->role, $user->name);
        $rt = TokenService::createRefreshToken();
        DB::table('refresh_tokens')->insert([
            'user_id'    => $user->id,
            'token_hash' => $rt['hash'],
            'expires_at' => now()->addDays(TokenService::REFRESH_TOKEN_TTL_DAYS),
            'revoked'    => 0,
        ]);
        return ['accessToken' => $accessToken, 'refreshToken' => $rt['token']];
    }

    private function toUserArray(User $user): array
    {
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role];
    }

    /** POST /api/auth/register */
    public function register(Request $request)
    {
        $data = $request->json()->all() ?? [];
        $name = $data['name'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$name || !$email || !$password) {
            return response()->json(['error' => 'name, email and password are required'], 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return response()->json(['error' => 'Invalid email address'], 400);
        }
        if (strlen((string) $password) < 8) {
            return response()->json(['error' => 'Password must be at least 8 characters'], 400);
        }

        $email = mb_strtolower(trim($email));
        if (User::where('email', $email)->exists()) {
            return response()->json(['error' => 'An account with this email already exists'], 409);
        }

        $passwordHash = TokenService::hashPassword((string) $password);
        $user = User::create([
            'name'          => trim($name),
            'email'         => $email,
            'phone'         => $data['phone'] ?? null,
            'password_hash' => $passwordHash,
            'role'          => 'user',
            'is_active'     => 1,
        ]);

        if (!empty($data['gender']) && !empty($data['date_of_birth'])) {
            Profile::create([
                'user_id'        => $user->id,
                'full_name'      => trim($name),
                'gender'         => $data['gender'],
                'date_of_birth'  => $data['date_of_birth'],
                'contact_email'  => FieldCrypto::encrypt($email),
                'contact_phone'  => !empty($data['phone']) ? FieldCrypto::encrypt((string) $data['phone']) : null,
            ]);
        }

        return response()->json(array_merge(
            ['user' => $this->toUserArray($user)],
            $this->issueTokens($user)
        ), 201);
    }

    /** Shared login. $role null = any, 'admin' = admin only. */
    private function doLogin(Request $request, ?string $role = null)
    {
        $data = $request->json()->all() ?? [];
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return response()->json(['error' => 'email and password are required'], 400);
        }

        $user = User::where('email', mb_strtolower(trim($email)))->first();
        if (!$user || !$user->is_active || !TokenService::verifyPassword((string) $password, $user->password_hash)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }
        if ($role === 'admin' && !$user->isAdmin()) {
            return response()->json(['error' => 'Admin privileges required'], 403);
        }

        return response()->json(array_merge(
            ['user' => $this->toUserArray($user)],
            $this->issueTokens($user)
        ));
    }

    /** POST /api/auth/login */
    public function login(Request $request)
    {
        return $this->doLogin($request);
    }

    /** POST /api/auth/admin/login */
    public function adminLogin(Request $request)
    {
        return $this->doLogin($request, 'admin');
    }

    /** POST /api/auth/refresh — rotates the refresh token. */
    public function refresh(Request $request)
    {
        $refreshToken = $request->json('refreshToken');
        if (!$refreshToken) {
            return response()->json(['error' => 'refreshToken is required'], 400);
        }
        $tokenHash = TokenService::hashToken((string) $refreshToken);
        $row = RefreshToken::where('token_hash', $tokenHash)->first();
        if (!$row || $row->revoked || $row->expires_at->lt(now())) {
            return response()->json(['error' => 'Invalid or expired refresh token'], 401);
        }
        $user = User::find($row->user_id);
        if (!$user || !$user->is_active) {
            return response()->json(['error' => 'Account unavailable'], 401);
        }
        $row->update(['revoked' => 1]);

        return response()->json($this->issueTokens($user));
    }

    /** POST /api/auth/logout — revokes a refresh token. */
    public function logout(Request $request)
    {
        $refreshToken = $request->json('refreshToken');
        if ($refreshToken) {
            RefreshToken::where('token_hash', TokenService::hashToken((string) $refreshToken))
                ->update(['revoked' => 1]);
        }
        return response()->json(['ok' => true]);
    }

    /** GET /api/auth/me */
    public function me(Request $request)
    {
        $user = $request->attributes->get('auth_user');
        return response()->json(['user' => $this->toUserArray($user)]);
    }

    /** GET /api/auth/admin/users */
    public function adminUsers(Request $request)
    {
        $users = User::orderByDesc('created_at')->limit(200)->get()->map(fn ($u) => $this->toUserArray($u));
        return response()->json(['users' => $users]);
    }

    /** GET /api/auth/admin/profiles/{userId} — decrypts PII. */
    public function adminProfile(Request $request, int $userId)
    {
        $profile = Profile::where('user_id', $userId)->first();
        if (!$profile) {
            return response()->json(['error' => 'Profile not found'], 404);
        }
        $arr = $profile->toArray();
        $arr['contact_email'] = FieldCrypto::decryptFromDb($profile->contact_email);
        $arr['contact_phone'] = FieldCrypto::decryptFromDb($profile->contact_phone);
        unset($arr['contact_email_binary'], $arr['contact_phone_binary']);
        return response()->json(['profile' => $arr]);
    }
}