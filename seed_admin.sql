-- CBAAC admin seed
--
-- Usage (PowerShell):
--   $env:CBAAC_ADMIN_PASSWORD = "choose-a-long-unique-password"
--   psql "$env:DATABASE_URL" -f .\seed_admin.sql
--
-- The password is read from the CBAAC_ADMIN_PASSWORD environment variable and
-- hashed by PostgreSQL with bcrypt. It is never stored in this file.

\getenv ADMIN_PASSWORD CBAAC_ADMIN_PASSWORD

\if :{?ADMIN_PASSWORD}
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  BEGIN;

  INSERT INTO "User1" (
    "id",
    "email",
    "password",
    "role",
    "verified",
    "isApproved",
    "createdAt",
    "updatedAt"
  )
  VALUES (
    gen_random_uuid(),
    'admin@cback.com',
    crypt(:'ADMIN_PASSWORD', gen_salt('bf', 12)),
    'Admin',
    TRUE,
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT ("email") DO UPDATE
  SET
    "password" = EXCLUDED."password",
    "role" = 'Admin',
    "verified" = TRUE,
    "isApproved" = TRUE,
    "deletedAt" = NULL,
    "updatedAt" = NOW();

  COMMIT;

  \echo 'Admin account seeded: admin@cback.com'
\else
  \echo 'Missing CBAAC_ADMIN_PASSWORD.'
  \echo 'Set it in the environment, then run this file again.'
  \quit 1
\endif
