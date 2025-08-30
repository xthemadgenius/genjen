-- Clean up and fix membership tiers data
-- First, delete existing incorrect data
DELETE FROM membership_tiers;

-- Insert the correct membership tiers
INSERT INTO membership_tiers (id, name, monthly_price, yearly_price, description, features) VALUES
  ('circle', 'The Circle', 29.00, 290.00, 'Begin. Belong. Blossom.', '["Community platform & circles", "Intro courses & learning journeys", "Wisdom Exchange content library", "Invitations to free events", "Entry tier: self-paced, no live calls"]'),
  ('legacy-path', 'The Legacy Path', 97.00, 970.00, 'Grow your leadership. Build your legacy.', '["Everything in The Circle", "Full course & learning tracks", "Monthly Book Club", "All session recordings", "Early access to workshops & summits", "Growth tier: complete library, still no live calls"]'),
  ('sun-collective', 'The Sun Collective', 197.00, 1970.00, 'Shine brighter. Share wisdom. Lead with impact.', '["Everything in The Legacy Path", "Quarterly live group calls with Lee", "Exclusive virtual masterminds", "AI Storytelling & Legacy toolkit", "Community spotlight recognition", "Leadership tier: live access, masterminds, storytelling tools"]'),
  ('visionary-circle', 'The Visionary Circle', 497.00, 4970.00, 'Co-create the future. Lead with vision.', '["Everything in The Sun Collective", "Small-group strategy calls with Lee", "VIP retreats & legacy labs", "Partner collaborations", "Visionary Partner recognition", "Visionary tier: high-touch mentorship & exclusive experiences"]');

-- Verify the data
SELECT id, name, monthly_price, yearly_price, description FROM membership_tiers ORDER BY monthly_price;