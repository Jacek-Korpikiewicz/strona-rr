-- Add image_url column to announcements table
ALTER TABLE announcements 
ADD COLUMN image_url TEXT;

-- Create storage bucket for announcements (run this in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('announcements', 'announcements', true);

-- Set up RLS policies for the storage bucket (run this in Supabase dashboard)
-- CREATE POLICY "Public read access for announcements" ON storage.objects
-- FOR SELECT USING (bucket_id = 'announcements');

-- CREATE POLICY "Authenticated users can upload announcements" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'announcements' AND auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can update announcements" ON storage.objects
-- FOR UPDATE USING (bucket_id = 'announcements' AND auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can delete announcements" ON storage.objects
-- FOR DELETE USING (bucket_id = 'announcements' AND auth.role() = 'authenticated');
