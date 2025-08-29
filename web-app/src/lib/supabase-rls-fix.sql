-- Fix RLS policies for wallet-based authentication
-- Since we're using wallet connection instead of traditional Supabase auth,
-- we need to adjust the RLS policies

-- Drop the existing restrictive policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert" ON users;

-- Create more flexible policies for wallet-based auth
-- Allow insert for unauthenticated users (wallet signup)
CREATE POLICY "Allow wallet signup" ON users
  FOR INSERT 
  WITH CHECK (true); -- Allow anyone to create users via wallet connection

-- Allow users to view their own data by wallet address
CREATE POLICY "Users can view own wallet data" ON users
  FOR SELECT 
  USING (wallet_address = current_setting('app.current_wallet_address', true));

-- Allow users to update their own data by wallet address  
CREATE POLICY "Users can update own wallet data" ON users
  FOR UPDATE 
  USING (wallet_address = current_setting('app.current_wallet_address', true));

-- Alternative: Temporarily disable RLS for development
-- Uncomment the line below if you want to completely disable RLS for testing
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;