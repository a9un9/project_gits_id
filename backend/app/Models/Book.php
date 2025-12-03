<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    protected $fillable = [
        'title',
        'description',
        'author_id',
        'publisher_id',
        'price',
        'published_year'
    ];

    public $timestamps = true;

    protected $casts = [
        'price' => 'decimal:2',
        'published_year' => 'integer'
    ];

    public function author() { 
        return $this->belongsTo(Author::class); 
    }

    public function publisher() { 
        return $this->belongsTo(Publisher::class); 
    }

}
