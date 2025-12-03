FROM php:8.2-fpm
RUN apt-get update && apt-get install -y \
    git zip unzip libpq-dev libonig-dev libzip-dev
RUN docker-php-ext-install pdo pdo_pgsql
# install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
