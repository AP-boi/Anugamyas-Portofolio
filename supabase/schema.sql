-- ==============================================================================
-- Anugamya Portfolio OS — Supabase PostgreSQL Production Schema
-- Target Database: PostgreSQL 15+ (Supabase Cloud)
-- ==============================================================================

-- 1. Create Visitors Table
CREATE TABLE IF NOT EXISTS public.visitors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Visitor',
  company TEXT DEFAULT 'Independent',
  contact TEXT DEFAULT '',
  message TEXT DEFAULT '',
  is_guest BOOLEAN DEFAULT false,
  is_admin BOOLEAN DEFAULT false,
  login_time TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  device TEXT DEFAULT 'Desktop',
  os TEXT DEFAULT 'macOS',
  browser TEXT DEFAULT 'Chrome',
  city TEXT DEFAULT 'New Delhi',
  country TEXT DEFAULT 'India',
  pages_visited TEXT[] DEFAULT '{}',
  session_count INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast ordering by activity
CREATE INDEX IF NOT EXISTS idx_visitors_last_active ON public.visitors (last_active DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_login_time ON public.visitors (login_time DESC);

-- 2. Create Guestbook Table
CREATE TABLE IF NOT EXISTS public.guestbook (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  role TEXT DEFAULT 'Visitor',
  company TEXT DEFAULT 'Guest',
  message TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guestbook_timestamp ON public.guestbook (timestamp DESC);

-- 3. Create Daily Analytics Table
CREATE TABLE IF NOT EXISTS public.daily_analytics (
  date_key DATE PRIMARY KEY,
  visits INT DEFAULT 0,
  logins INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_analytics ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to allow clean re-application
DROP POLICY IF EXISTS "Allow public select on visitors" ON public.visitors;
DROP POLICY IF EXISTS "Allow public insert on visitors" ON public.visitors;
DROP POLICY IF EXISTS "Allow public update on visitors" ON public.visitors;

DROP POLICY IF EXISTS "Allow public select on guestbook" ON public.guestbook;
DROP POLICY IF EXISTS "Allow public insert on guestbook" ON public.guestbook;

DROP POLICY IF EXISTS "Allow public all on daily_analytics" ON public.daily_analytics;

-- 6. Create Permissive Policies for Web Clients
CREATE POLICY "Allow public select on visitors" ON public.visitors FOR SELECT USING (true);
CREATE POLICY "Allow public insert on visitors" ON public.visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on visitors" ON public.visitors FOR UPDATE USING (true);

CREATE POLICY "Allow public select on guestbook" ON public.guestbook FOR SELECT USING (true);
CREATE POLICY "Allow public insert on guestbook" ON public.guestbook FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public all on daily_analytics" ON public.daily_analytics FOR ALL USING (true);

-- 7. Purge any mock/placeholder records from previous seeds
DELETE FROM public.visitors 
WHERE name IN ('Sundar Pichai', 'Tech Recruiter', 'Open Source Contributor', 'Guillermo Rauch', 'Linus Torvalds', 'Alex River')
   OR company IN ('Alphabet & Google', 'Microsoft AI', 'Vercel Ecosystem', 'Apple CoreOS');

DELETE FROM public.guestbook 
WHERE author IN ('Sundar Pichai', 'Tech Recruiter', 'Open Source Contributor', 'Guillermo Rauch', 'Linus Torvalds', 'Alex River')
   OR company IN ('Alphabet & Google', 'Microsoft AI', 'Vercel Ecosystem', 'Apple CoreOS');


