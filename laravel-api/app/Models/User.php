<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'name', 'email', 'phone', 'password_hash', 'role', 'is_active',
    ];

    protected $hidden = [
        'password_hash',
    ];

    /**
     * Laravel's Authenticatable reads the password from getAuthPassword().
     * Map it to our password_hash column (bcrypt) so Hash::check works.
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function profile()
    {
        return $this->hasOne(Profile::class, 'user_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
