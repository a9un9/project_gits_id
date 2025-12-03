<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publisher extends Model
{
    protected $fillable = [
        'name',
        'country'
    ];

    public $timestamps = true;

    public function books() { 
        return $this->hasMany(Book::class); 
    }
}
