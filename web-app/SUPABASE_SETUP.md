# Supabase Setup Guide

This guide will help you set up Supabase for the JenGen web application.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Choose a name like "genjen-production" or "genjen-dev"
4. Set a secure database password
5. Choose a region close to your users

## 2. Get Project Credentials

Once your project is ready:

1. Go to **Settings** > **API** in your Supabase dashboard
2. Copy the **Project URL** and **anon/public key**
3. Update your `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `src/lib/supabase-schema.sql`
3. Run the SQL to create tables and policies

## 4. Configure Authentication

1. Go to **Authentication** > **Settings** in Supabase
2. Enable **Email** provider (already enabled by default)
3. Configure other providers as needed (Google, GitHub, etc.)
4. Set your site URL to `http://localhost:3000` for development

## 5. Test Connection

Run your Next.js app:

```bash
npm run dev
```

Try creating an account through the signup form to test the Supabase integration.

## Database Structure

The app uses these main tables:

- **users**: User profiles with personal info, wallet data, and membership
- **membership_tiers**: Available subscription plans

## Row Level Security (RLS)

The database is secured with RLS policies:
- Users can only view/edit their own data
- Authentication required for all operations
- Admin access can be configured separately

## Environment Variables Required

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Existing Reown/WalletConnect
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_id
REOWN_SECRET_KEY=your_reown_secret
```

## Next Steps

After setup:
1. Test user registration
2. Configure wallet connection flow
3. Set up membership tier management
4. Add ENS support in user settings (future feature)