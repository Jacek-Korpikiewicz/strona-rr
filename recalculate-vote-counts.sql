-- Recalculate vote counts based on actual votes in the votes table
-- This will sync the voting_options.votes with the actual count from votes table

-- First, reset all vote counts to 0
UPDATE voting_options 
SET votes = 0;

-- Then, recalculate based on actual votes
UPDATE voting_options 
SET votes = (
    SELECT COUNT(*) 
    FROM votes 
    WHERE votes.option_id = voting_options.id
);

-- Verify the results
SELECT 
    vo.id,
    vo.text,
    vo.votes as calculated_votes,
    v.title as voting_title,
    (SELECT COUNT(*) FROM votes WHERE votes.option_id = vo.id) as actual_vote_count
FROM voting_options vo
JOIN votings v ON vo.voting_id = v.id
ORDER BY v.id, vo.id;

-- Show total votes per voting
SELECT 
    v.id,
    v.title,
    SUM(vo.votes) as total_votes
FROM votings v
LEFT JOIN voting_options vo ON v.id = vo.voting_id
GROUP BY v.id, v.title
ORDER BY v.id;




