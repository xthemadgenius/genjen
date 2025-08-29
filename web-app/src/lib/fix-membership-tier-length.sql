-- Fix membership_tier_id length constraint
-- Change from VARCHAR(10) to VARCHAR(50) to accommodate plan names like 'professional'

-- First, drop the foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_membership_tier;

-- Update the column length in users table
ALTER TABLE users ALTER COLUMN membership_tier_id TYPE VARCHAR(50);

-- Update the membership_tiers table id column as well
ALTER TABLE membership_tiers ALTER COLUMN id TYPE VARCHAR(50);

-- Add some additional membership tiers with proper IDs
INSERT INTO membership_tiers (id, name, price, features) VALUES
  ('basic', 'Basic', 0.00, '["Basic Support", "Limited API Calls"]'),
  ('professional', 'Professional', 29.99, '["Priority Support", "Unlimited API Calls", "Advanced Features"]'),
  ('enterprise', 'Enterprise', 99.99, '["24/7 Support", "Custom Integration", "Advanced Analytics", "Priority Features"]')
ON CONFLICT (id) DO NOTHING;

-- Re-add the foreign key constraint with updated column type
ALTER TABLE users 
ADD CONSTRAINT fk_users_membership_tier 
FOREIGN KEY (membership_tier_id) REFERENCES membership_tiers(id);

-- Update default membership tier to use string ID
ALTER TABLE users ALTER COLUMN membership_tier_id SET DEFAULT 'basic';