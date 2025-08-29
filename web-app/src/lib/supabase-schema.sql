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
  membership_tier_id VARCHAR(10) DEFAULT '1', -- References membership tier
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

CREATE TRIGGER update_users_updated_at 
BEFORE UPDATE ON users 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see and update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Only authenticated users can insert (signup)
CREATE POLICY "Authenticated users can insert" ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Sample membership tiers table (referenced by membership_tier_id)
CREATE TABLE IF NOT EXISTS membership_tiers (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL, -- Array of feature strings
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default membership tiers
INSERT INTO membership_tiers (id, name, price, features) VALUES
  ('1', 'Basic', 0.00, '["Basic Support", "Limited API Calls"]'),
  ('2', 'Pro', 29.99, '["Priority Support", "Unlimited API Calls", "Advanced Features"]'),
  ('3', 'Enterprise', 99.99, '["24/7 Support", "Custom Integration", "Advanced Analytics", "Priority Features"]')
ON CONFLICT (id) DO NOTHING;

-- Foreign key constraint for membership tier
ALTER TABLE users 
ADD CONSTRAINT fk_users_membership_tier 
FOREIGN KEY (membership_tier_id) REFERENCES membership_tiers(id);

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts with wallet integration and membership tiers';
COMMENT ON COLUMN users.name IS 'Structured name as JSONB with first_name and last_name';
COMMENT ON COLUMN users.wallet_address IS 'Ethereum wallet address (42 characters including 0x prefix)';
COMMENT ON COLUMN users.ens_name IS 'Ethereum Name Service domain ending in .eth';
COMMENT ON COLUMN users.is_wallet_verified IS 'Whether the wallet has been verified through signature';
COMMENT ON COLUMN users.wallet_type IS 'Type of wallet used (WalletConnect, MetaMask, etc.)';
COMMENT ON COLUMN users.membership_tier_id IS 'References membership_tiers table';