-- Supabase Users Table Schema
-- This schema matches the backend User model for seamless integration

CREATE TABLE IF NOT EXISTS users (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  
  -- Personal information (structured as JSONB for flexibility)
  name JSONB, -- { "first_name": "string", "last_name": "string" }
  phone VARCHAR(20),
  address TEXT,
  
  -- Wallet information
  wallet_address VARCHAR(42), -- Ethereum address format
  ens_name VARCHAR(255),
  is_wallet_verified BOOLEAN DEFAULT false,
  wallet_type VARCHAR(50) DEFAULT 'WalletConnect',
  last_wallet_connection TIMESTAMPTZ,
  
  -- Membership information
  membership_tier_id VARCHAR(50) DEFAULT 'circle', -- References membership tier
  membership_assigned_at TIMESTAMPTZ DEFAULT now(),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_username CHECK (length(username) >= 3 AND username ~* '^[a-zA-Z0-9_-]+$'),
  CONSTRAINT valid_wallet_address CHECK (wallet_address IS NULL OR wallet_address ~* '^0x[a-fA-F0-9]{40}$'),
  CONSTRAINT valid_ens_name CHECK (ens_name IS NULL OR ens_name ~* '\.eth$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_membership_tier ON users(membership_tier_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert" ON users;

-- Users can only see and update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Only authenticated users can insert (signup)
CREATE POLICY "Authenticated users can insert" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Sample membership tiers table (referenced by membership_tier_id)
-- First, alter existing table to add new columns if they don't exist
DO $$ 
BEGIN
  -- Add monthly_price column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_tiers' AND column_name = 'monthly_price') THEN
    ALTER TABLE membership_tiers ADD COLUMN monthly_price DECIMAL(10,2);
  END IF;
  
  -- Add yearly_price column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_tiers' AND column_name = 'yearly_price') THEN
    ALTER TABLE membership_tiers ADD COLUMN yearly_price DECIMAL(10,2);
  END IF;
  
  -- Add description column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'membership_tiers' AND column_name = 'description') THEN
    ALTER TABLE membership_tiers ADD COLUMN description TEXT;
  END IF;
  
  -- Extend id column length if needed
  ALTER TABLE membership_tiers ALTER COLUMN id TYPE VARCHAR(50);
  ALTER TABLE membership_tiers ALTER COLUMN name TYPE VARCHAR(100);
  
  -- Drop NOT NULL constraint on price column if it exists
  ALTER TABLE membership_tiers ALTER COLUMN price DROP NOT NULL;
END $$;

CREATE TABLE IF NOT EXISTS membership_tiers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  monthly_price DECIMAL(10,2) NOT NULL,
  yearly_price DECIMAL(10,2) NOT NULL,
  description TEXT,
  features JSONB NOT NULL, -- Array of feature strings
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert membership tiers matching the new plan structure
INSERT INTO membership_tiers (id, name, monthly_price, yearly_price, description, features) VALUES
  ('circle', 'The Circle', 29.00, 290.00, 'Begin. Belong. Blossom.', '["Community platform & circles", "Intro courses & learning journeys", "Wisdom Exchange content library", "Invitations to free events", "Entry tier: self-paced, no live calls"]'),
  ('legacy-path', 'The Legacy Path', 97.00, 970.00, 'Grow your leadership. Build your legacy.', '["Everything in The Circle", "Full course & learning tracks", "Monthly Book Club", "All session recordings", "Early access to workshops & summits", "Growth tier: complete library, still no live calls"]'),
  ('sun-collective', 'The Sun Collective', 197.00, 1970.00, 'Shine brighter. Share wisdom. Lead with impact.', '["Everything in The Legacy Path", "Quarterly live group calls with Lee", "Exclusive virtual masterminds", "AI Storytelling & Legacy toolkit", "Community spotlight recognition", "Leadership tier: live access, masterminds, storytelling tools"]'),
  ('visionary-circle', 'The Visionary Circle', 497.00, 4970.00, 'Co-create the future. Lead with vision.', '["Everything in The Sun Collective", "Small-group strategy calls with Lee", "VIP retreats & legacy labs", "Partner collaborations", "Visionary Partner recognition", "Visionary tier: high-touch mentorship & exclusive experiences"]')
ON CONFLICT (id) DO NOTHING;

-- Foreign key constraint for membership tier
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_users_membership_tier') THEN
    ALTER TABLE users 
    ADD CONSTRAINT fk_users_membership_tier 
    FOREIGN KEY (membership_tier_id) REFERENCES membership_tiers(id);
  END IF;
END $$;

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts with wallet integration and membership tiers';
COMMENT ON COLUMN users.name IS 'Structured name as JSONB with first_name and last_name';
COMMENT ON COLUMN users.wallet_address IS 'Ethereum wallet address (42 characters including 0x prefix)';
COMMENT ON COLUMN users.ens_name IS 'Ethereum Name Service domain ending in .eth';
COMMENT ON COLUMN users.is_wallet_verified IS 'Whether the wallet has been verified through signature';
COMMENT ON COLUMN users.wallet_type IS 'Type of wallet used (WalletConnect, MetaMask, etc.)';
COMMENT ON COLUMN users.membership_tier_id IS 'References membership_tiers table';