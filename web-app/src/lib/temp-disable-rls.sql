-- Temporarily disable RLS for development testing
-- This allows user creation without authentication context

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- You can re-enable it later with:
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;