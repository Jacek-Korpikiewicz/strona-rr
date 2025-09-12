-- Create announcements table
CREATE TABLE announcements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votings table
CREATE TABLE votings (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create voting_options table
CREATE TABLE voting_options (
  id VARCHAR(50) PRIMARY KEY,
  voting_id INTEGER REFERENCES votings(id) ON DELETE CASCADE,
  text VARCHAR(255) NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id VARCHAR(50) PRIMARY KEY,
  voting_id INTEGER REFERENCES votings(id) ON DELETE CASCADE,
  option_id VARCHAR(50) REFERENCES voting_options(id) ON DELETE CASCADE,
  voter_id VARCHAR(100) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(voting_id, voter_id) -- Prevent duplicate votes
);

-- Create indexes for better performance
CREATE INDEX idx_announcements_date ON announcements(date DESC);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_votings_end_date ON votings(end_date);
CREATE INDEX idx_votes_voting_id ON votes(voting_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);

-- Insert sample data
INSERT INTO announcements (title, content, date, priority, author, category) VALUES
('Zebranie Rady Rodziców - 15 stycznia 2024', 'Serdecznie zapraszamy na zebranie Rady Rodziców, które odbędzie się 15 stycznia 2024 o godzinie 18:00 w sali konferencyjnej szkoły.', '2024-01-10', 'high', 'Anna Kowalska', 'Zebrania'),
('Zmiana terminu wycieczki klasowej', 'Wycieczka klasowa zaplanowana na 20 stycznia została przeniesiona na 27 stycznia z powodu warunków pogodowych.', '2024-01-08', 'medium', 'Jan Nowak', 'Wycieczki'),
('Nowe zasady dotyczące obiadów', 'Od lutego wprowadzamy nowe zasady dotyczące zamawiania obiadów. Szczegóły zostaną przesłane w osobnym komunikacie.', '2024-01-05', 'low', 'Maria Wiśniewska', 'Obiady');

INSERT INTO votings (title, description, end_date) VALUES
('Prezent na Dzień Chłopaka/Dzień Dziewczyny', 'Dzień chłopaka jest już 30 września - wybierzmy budżet', '2025-09-17T23:59:00Z');

INSERT INTO voting_options (id, voting_id, text, votes) VALUES
('cjhyao6ml', 1, '10-20 PLN', 0),
('bbqf1q5ig', 1, '20-30 PLN', 0),
('38kvfjt1d', 1, '30-40 PLN', 0);

-- Create function to increment vote count
CREATE OR REPLACE FUNCTION increment_vote_count(option_id VARCHAR(50))
RETURNS VOID AS $$
BEGIN
  UPDATE voting_options 
  SET votes = votes + 1 
  WHERE id = option_id;
END;
$$ LANGUAGE plpgsql;
