-- Add IP address column to votes table
ALTER TABLE votes ADD COLUMN ip_address TEXT;

-- Add index for better performance on IP lookups
CREATE INDEX idx_votes_ip_address ON votes(ip_address);

-- Add unique constraint to prevent duplicate votes from same IP for same voting
-- This will prevent the same IP from voting multiple times on the same voting
ALTER TABLE votes ADD CONSTRAINT unique_vote_per_ip_per_voting 
UNIQUE (voting_id, ip_address);

-- Update the increment_vote_count function to handle IP-based deduplication
CREATE OR REPLACE FUNCTION increment_vote_count(voting_id_param INTEGER, option_id_param TEXT, voter_ip TEXT)
RETURNS VOID AS $$
DECLARE
    existing_vote_count INTEGER;
BEGIN
    -- Check if this IP has already voted on this voting
    SELECT COUNT(*) INTO existing_vote_count
    FROM votes 
    WHERE voting_id = voting_id_param AND ip_address = voter_ip;
    
    -- Only proceed if this IP hasn't voted on this voting yet
    IF existing_vote_count = 0 THEN
        -- Insert the vote
        INSERT INTO votes (voting_id, option_id, voter_id, ip_address, timestamp)
        VALUES (voting_id_param, option_id_param, 'ip_' || voter_ip, voter_ip, NOW());
        
        -- Update the vote count
        UPDATE voting_options 
        SET votes = votes + 1 
        WHERE id = option_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql;
