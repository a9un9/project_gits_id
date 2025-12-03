<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Book;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        Book::create([
            'title' => 'Laravel Basics',
            'description' => 'Belajar dasar Laravel',
            'author_id' => 1,
            'publisher_id' => 1,
            'price' => 120000,
            'published_year' => 2024,
        ]);

        Book::create([
            'title' => 'Next.js for Beginners',
            'description' => 'Panduan memulai next.js',
            'author_id' => 2,
            'publisher_id' => 2,
            'price' => 150000,
            'published_year' => 2025,
        ]);
    }
}
