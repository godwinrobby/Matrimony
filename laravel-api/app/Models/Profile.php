<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    public const UPDATED_AT = null;

    protected $table = 'profiles';

    public $timestamps = true;

    protected $fillable = [
        'user_id', 'full_name', 'gender', 'date_of_birth', 'height_cm',
        'religion', 'caste', 'mother_tongue', 'city', 'state',
        'education', 'profession', 'income', 'marital_status', 'about_me',
        'contact_email', 'contact_phone', 'is_premium',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'is_premium' => 'boolean',
    ];

    protected $hidden = ['contact_email', 'contact_phone'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}