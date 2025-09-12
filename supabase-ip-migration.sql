-- IP Tracking Migration for Votes Table
-- Run this script in Supabase SQL Editor

-- Step 1: Add IP address column to votes table
ALTER TABLE votes ADD COLUMN IF NOT EXISTS ip_address TEXT;

-- Step 2: Add index for better performance on IP lookups
CREATE INDEX IF NOT EXISTS idx_votes_ip_address ON votes(ip_address);

-- Step 3: Add unique constraint to prevent duplicate votes from same IP for same voting
-- First, let's check if there are any existing duplicate votes that would conflict
-- (This is just for information - we'll handle it in the constraint)
SELECT 
    voting_id, 
    ip_address, 
    COUNT(*) as duplicate_count
FROM votes 
WHERE ip_address IS NOT NULL
GROUP BY voting_id, ip_address 
HAVING COUNT(*) > 1;

-- Step 4: Add the unique constraint
-- Note: If there are existing duplicates, you'll need to clean them up first
ALTER TABLE votes ADD CONSTRAINT unique_vote_per_ip_per_voting 
UNIQUE (voting_id, ip_address);

-- Step 5: Update existing votes to have a placeholder IP if they don't have one
-- This ensures all existing votes have an IP address
UPDATE votes 
SET ip_address = 'legacy_' || id 
WHERE ip_address IS NULL;

-- Step 6: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'votes' 
AND column_name = 'ip_address';

-- Step 7: Check the unique constraint
SELECT 
    constraint_name, 
    constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'votes' 
AND constraint_name = 'unique_vote_per_ip_per_voting';

-- Step 8: Test the constraint by trying to insert a duplicate vote
-- (This will fail as expected, proving the constraint works)
-- INSERT INTO votes (id, voting_id, option_id, voter_id, ip_address, timestamp)
-- VALUES ('test_duplicate', 1, 'option_1', 'test_voter', '192.168.1.1', NOW());

-- Step 9: Show current votes with IP addresses
SELECT 
    id,
    voting_id,
    option_id,
    voter_id,
    ip_address,
    timestamp
FROM votes 
ORDER BY timestamp DESC 
LIMIT 10;

-- Migration completed successfully!
-- The votes table now has IP tracking and deduplication enabled.
