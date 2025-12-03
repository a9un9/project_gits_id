<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Author;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        Author::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'bio' => 'General author'
        ]);

        Author::create([
            'first_name' => 'Agung',
            'last_name' => 'Hutri',
            'bio' => 'Penulis backend'
        ]);
    }
}
