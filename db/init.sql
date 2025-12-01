-- Init SQL for MasvingoClearance
-- Run with: psql -f db/init.sql

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password text NOT NULL,
  full_name text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text NOT NULL UNIQUE,
  full_name text NOT NULL,
  id_number text NOT NULL,
  phone_number text NOT NULL,
  email text,
  property_address text NOT NULL,
  stand_number text NOT NULL,
  property_type text NOT NULL,
  reason text NOT NULL,
  documents text[] DEFAULT ARRAY[]::text[],
  uploaded_documents text[] DEFAULT ARRAY[]::text[],
  status text NOT NULL DEFAULT 'submitted',
  submitted_date timestamp NOT NULL DEFAULT now(),
  review_date timestamp,
  completed_date timestamp,
  admin_notes text,
  reviewed_by text
);

-- Sample admin (WARNING: password is plaintext for demo; hash in production)
INSERT INTO admins (username, password, full_name)
VALUES ('admin', 'admin123', 'System Administrator')
ON CONFLICT (username) DO NOTHING;
