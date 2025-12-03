

1. Struktur folder backend

backend/
app/
  Models/
    Author.php
    Book.php
    Publisher.php
    User.php
  Http/
    Controllers/
      AuthController.php
      AuthorController.php
      BookController.php
      PublisherController.php
      Controller.php
  database/
    migrations/
      0001_01_01_000000_create_users_table.php
      0001_01_01_000001_create_cache_table.php
      0001_01_01_000002_create_jobs_table.php
      2025_12_02_072833_create_publishers_table.php
      2025_12_02_072905_create_authors_table.php
      2025_12_02_072919_create_books_table.php

  seeders/
    AuthorSeeder.php
    BookSeeder.php
    PublisherSeeder.php
    UserSeeder.php
    DatabaseSeeder.php

  routes/
    api.php

  .env.example
  composer.json
  docker-compose.yml
  openapi.yml
  README.md


2. .env.example ubah menjadi .env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=root
DB_PASSWORD=

3. Instructions to run locally
# Laravel Backend API

Clone repository
```bash
git clone <repo-url>
cd backend

composer install
copy .env.example menjadi .env
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider
php artisan jwt:secret // Perintah ini otomatis membuat JWT secret key dan menambahkan ke file .env
JWT_SECRET=generated_random_key_here // setelah perintah ini php artisan jwt:secret, akan otomatis muncul disini

4. Seeder and migration scripts.
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve

5. Postman collection or Swagger documentation.
untuk Postman collection ada di file openapi.yml didalam folder backend, tinggal import di postman




1. Struktur folder frontend
frontend/
  public/
    favicon.ico
  app/
    dashboard/
      page.tsx
    login/
      page.tsx
    register/
      page.tsx
    favicon.ico
    globals.css
    layout.tsx
    page.tsx          
  components/
    DashboardLayout.tsx
  services/
    api.js
    authServices.ts
    authorServices.ts
    bookServices.ts
    publisherServices.ts
  .env.example
  package.json
  next.config.js
  tailwind.config.js
  postcss.config.js
  README.md

2. .env.example ubah menjadi .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api

3. Instructions to run locally
# Nextjs FrontEnd

Clone repo:
```bash
git clone <repo-url>
cd frontend

npm install

npm run dev


