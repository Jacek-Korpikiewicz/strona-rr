# Supabase Storage Setup for Lesson Plans

## Step 1: Add Database Column

Run this SQL in your Supabase SQL Editor:

```sql
-- Add image_url column to announcements table
ALTER TABLE announcements 
ADD COLUMN image_url TEXT;
```

## Step 2: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Set bucket name: `announcements`
5. Set to **Public**: ✅ (checked)
6. Click **"Create bucket"**

## Step 3: Set Up RLS Policies

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access for announcements
CREATE POLICY "Public read access for announcements" ON storage.objects
FOR SELECT USING (bucket_id = 'announcements');

-- Allow authenticated users to upload announcements
CREATE POLICY "Authenticated users can upload announcements" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'announcements' AND auth.role() = 'authenticated');

-- Allow authenticated users to update announcements
CREATE POLICY "Authenticated users can update announcements" ON storage.objects
FOR UPDATE USING (bucket_id = 'announcements' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete announcements
CREATE POLICY "Authenticated users can delete announcements" ON storage.objects
FOR DELETE USING (bucket_id = 'announcements' AND auth.role() = 'authenticated');
```

## Step 4: Test the Setup

1. Go to your admin panel
2. Create a new announcement
3. Set category to "Plan"
4. Upload a JPG/PNG image
5. Submit the form

The image should now upload successfully!

## Troubleshooting

If you still get errors:

1. **Check bucket exists**: Go to Storage → Buckets and verify "announcements" bucket is there
2. **Check permissions**: Make sure the RLS policies are applied
3. **Check console**: Open browser dev tools and check for detailed error messages
4. **Test with small image**: Try uploading a small test image first

## File Size Limits

- Supabase free tier: 1GB total storage
- Individual file limit: 50MB
- Recommended image size: Under 5MB for lesson plans
