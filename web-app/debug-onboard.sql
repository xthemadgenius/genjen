-- Debug queries to check membership_tiers data and constraints

-- Check if membership_tiers exist and have correct data
SELECT id, name, monthly_price, yearly_price, description FROM membership_tiers ORDER BY monthly_price;

-- Check if the foreign key constraint is working
SELECT constraint_name, table_name, column_name 
FROM information_schema.key_column_usage 
WHERE table_name = 'users' AND column_name = 'membership_tier_id';

-- Check current users table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;