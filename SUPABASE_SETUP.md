# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Choose your organization
5. Enter project name: `strona-klasowa`
6. Set a database password (save it!)
7. Choose region closest to you
8. Click "Create new project"

## 2. Get Your Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - **Project URL** (starts with https://)
   - **anon public** key (starts with eyJ...)

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Admin Configuration (optional)
ADMIN_PASSWORD_HASH=your_bcrypt_hash_here
```

## 4. Set Up Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database-schema.sql`
3. Click "Run" to create the tables and sample data

## 5. Deploy to Vercel

1. Add environment variables in Vercel:
   - Go to your project settings
   - Add the same environment variables from step 3
2. Deploy your project

## 6. Test the Integration

- Visit your live website
- Try adding announcements in the admin panel
- Try voting on existing votings
- Data should now sync across all devices!
