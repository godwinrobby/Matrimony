# Hindu Matrimony — Laravel API

A PHP Laravel (v13) reimplementation of the matrimony backend. It reads the **existing MySQL schema** (`users`, `profiles`, `refresh_tokens`, and all 002 domain tables) on Hostinger — no schema migration required, and existing users (incl. the bcrypt-hashed admin) work as-is.

## Stack
- PHP 8.3 + Laravel 13 (new `bootstrap/app.php` routing)
- MySQL (Hostinger, TLS-required) via PDO
- `firebase/php-jwt` for HS256 access tokens (15 min) + opaque refresh tokens (7 days, sha256-hashed & revocable)
- Native bcrypt (`password_verify`) so `$2a`/`$2b`/`$2y` hashes all verify
- AES-256-GCM field encryption for PII (`contact_email` / `contact_phone`)

## Setup
```bash
composer install
cp .env.example .env    # fill DB_* with Hostinger creds, JWT_SECRET, APP_SECRET
php artisan serve       # dev server on http://127.0.0.1:8000
# production: php artisan serve --port 8000 --host 0.0.0.0  (or use PHP-FPM host)
```

## Endpoints (all under `/api`)

### Auth
| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | — | Creates user (+ profile, PII encrypted) |
| POST | `/api/auth/login` | — | User login → tokens |
| POST | `/api/auth/admin/login` | — | Admin-only login (403 for non-admin) |
| POST | `/api/auth/refresh` | refresh token | Rotates tokens |
| POST | `/api/auth/logout` | — | Revokes refresh token |
| GET | `/api/auth/me` | Bearer JWT | Current user |
| GET | `/api/auth/admin/users` | Bearer JWT (admin) | List users |
| GET | `/api/auth/admin/profiles/{id}` | Bearer JWT (admin) | Profile with decrypted PII |

### Matchmaking / AI (deterministic fallbacks)
| Method | Path | Notes |
|---|---|---|
| POST | `/api/compatibility` | 2-profile compatibility report |
| POST | `/api/horoscope-match` | Ashta Koota Guna Milan |
| POST | `/api/daily-horoscope` | Personalized daily forecast |
| POST | `/api/pundit-chat` | Consultant chat |
| POST | `/api/profile-chat` | Simulated profile chat |
| POST | `/api/ai-search` | Natural-language profile search |
| POST | `/api/cashfree/create-order` | Sandbox payment order |
| POST | `/api/cashfree/verify-payment` | Payment verification stub |

## Security
- Passwords: bcrypt (12 rounds)
- Access tokens: JWT HS256, 15-min expiry (`JWT_SECRET`)
- Refresh tokens: opaque, sha256-hashed at rest, revoked on refresh/logout
- PII: AES-256-GCM at rest (`APP_SECRET`), decrypted only by admin endpoints
- Generate secrets via: `openssl rand -hex 48`

> ⚠️ Change `JWT_SECRET` / `APP_SECRET` to fresh values before production and rotate them from any committed value.
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

In addition, [Laracasts](https://laracasts.com) contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

You can also watch bite-sized lessons with real-world projects on [Laravel Learn](https://laravel.com/learn), where you will be guided through building a Laravel application from scratch while learning PHP fundamentals.

## Agentic Development

Laravel's predictable structure and conventions make it ideal for AI coding agents like Claude Code, Cursor, and GitHub Copilot. Install [Laravel Boost](https://laravel.com/docs/ai) to supercharge your AI workflow:

```bash
composer require laravel/boost --dev

php artisan boost:install
```

Boost provides your agent 15+ tools and skills that help agents build Laravel applications while following best practices.

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
