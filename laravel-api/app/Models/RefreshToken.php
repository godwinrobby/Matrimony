<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefreshToken extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'refresh_tokens';

    public $timestamps = true;

    protected $fillable = [
        'user_id', 'token_hash', 'expires_at', 'revoked',
    ];

    protected $casts = [
        'revoked' => 'boolean',
        'expires_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}