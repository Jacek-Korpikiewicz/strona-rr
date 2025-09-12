-- Clear sample data from database
DELETE FROM announcements WHERE id IN (1, 2, 3);

-- Delete sample voting
DELETE FROM voting_options WHERE voting_id = 1;
DELETE FROM votes WHERE voting_id = 1;
DELETE FROM votings WHERE id = 1;

-- Reset the ID sequence (optional)
ALTER SEQUENCE announcements_id_seq RESTART WITH 1;
ALTER SEQUENCE votings_id_seq RESTART WITH 1;
