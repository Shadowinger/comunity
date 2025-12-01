FROM php:8.2-cli

# Install PostgreSQL PDO extension
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

WORKDIR /app

CMD ["php", "-S", "0.0.0.0:8080", "-t", "public", "public/index.php"]
