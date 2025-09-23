-- Создание базы данных для Rating.ru
CREATE DATABASE rating_db;

-- Подключение к созданной базе данных
\c rating_db;

-- Создание расширений (если нужны)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Комментарии для базы данных
COMMENT ON DATABASE rating_db IS 'База данных для проекта Rating.ru';
