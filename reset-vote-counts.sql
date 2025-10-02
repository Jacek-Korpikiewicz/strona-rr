-- Reset all vote counts in voting_options table
-- This will set all vote counts to 0

UPDATE voting_options 
SET votes = 0;

-- Verify the reset
SELECT 
    vo.id,
    vo.text,
    vo.votes,
    v.title as voting_title
FROM voting_options vo
JOIN votings v ON vo.voting_id = v.id
ORDER BY v.id, vo.id;

-- Also check if there are any remaining votes in the votes table
SELECT COUNT(*) as remaining_votes FROM votes;

-- If you want to also clear all votes from the votes table (optional)
-- DELETE FROM votes;




