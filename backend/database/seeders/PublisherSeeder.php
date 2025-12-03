<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Publisher;

class PublisherSeeder extends Seeder
{
    public function run(): void
    {
        Publisher::create(
            ['name' => 'Gramedia']
        );
        
        Publisher::create(
            ['name' => 'Erlangga']
        );
    }
}
