<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'bio'
    ];

    public $timestamps = true;

    public function books() { 
        return $this->hasMany(Book::class); 
    }
}
