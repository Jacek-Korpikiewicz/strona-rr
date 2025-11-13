-- Create the payments table for storing class payment data
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  class TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('przedszkole', 'szkola')),
  max NUMERIC(10, 2) NOT NULL,
  wplacone NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class, type)
);

-- Create an index on type for faster queries
CREATE INDEX IF NOT EXISTS idx_payments_type ON payments(type);

-- Create an index on class for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_class ON payments(class);

-- Enable Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all SELECT operations (public read access)
CREATE POLICY "Allow public read access" ON payments
  FOR SELECT
  USING (true);

-- Create a policy that allows INSERT operations (for admin updates)
CREATE POLICY "Allow insert operations" ON payments
  FOR INSERT
  WITH CHECK (true);

-- Create a policy that allows UPDATE operations (for admin updates)
CREATE POLICY "Allow update operations" ON payments
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create a policy that allows DELETE operations (for admin cleanup)
CREATE POLICY "Allow delete operations" ON payments
  FOR DELETE
  USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at on row updates
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_payments_updated_at();

