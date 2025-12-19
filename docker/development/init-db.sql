-- Buat db jika belum ada
SELECT 'CREATE DATABASE pemerihan_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pemerihan_db')\gexec

-- Buat User jika belum ada
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'migration_user') THEN
        CREATE USER migration_user WITH PASSWORD '12345';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = 'client_user') THEN
        CREATE USER client_user WITH PASSWORD '12345';
    END IF;
END
$$;

ALTER USER migration_user CREATEDB;

\c pemerihan_db

GRANT CONNECT ON DATABASE pemerihan_db TO migration_user;
GRANT CONNECT ON DATABASE pemerihan_db TO client_user;

-- Setup Migration User
GRANT USAGE, CREATE ON SCHEMA public TO migration_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO migration_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO migration_user;

-- Setup Client User
GRANT USAGE ON SCHEMA public TO client_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO client_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO client_user;

-- Default Privileges agar tabel baru dari Alembic bisa dibaca Prod
ALTER DEFAULT PRIVILEGES FOR ROLE migration_user IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO client_user;

ALTER DEFAULT PRIVILEGES FOR ROLE migration_user IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO client_user;
