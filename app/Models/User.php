<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    // --- DEFINISI ROLE AGAR KONSISTEN ---
    const ROLE_SUPER_ADMIN = 'super_admin'; // Bisa akses Web Profile & Inventaris
    const ROLE_HUMAS = 'humas';             // Web Profile
    const ROLE_KEPALA_RT = 'kepala_rt';     // Web Inventaris
    const ROLE_STAFF_RT = 'staff_rt';       // Web Inventaris
    const ROLE_DIREKTUR = 'direktur';       // Web Inventaris
    const ROLE_KEUANGAN = 'keuangan';       // Web Inventaris

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // <--- TAMBAHKAN INI
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    
    // Helper untuk cek role (Opsional, tapi sangat membantu di controller/blade)
    public function hasRole($role)
    {
        return $this->role === $role;
    }
}
