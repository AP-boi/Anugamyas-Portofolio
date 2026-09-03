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

-- 7. Insert Seed Data
INSERT INTO public.visitors (id, name, role, company, contact, message, is_guest, is_admin, device, os, browser, city, country, pages_visited, session_count)
VALUES
  ('seed-1', 'Sundar Pichai', 'CEO', 'Alphabet & Google', 'sundar@google.com', 'Remarkable WebGL engineering on the portfolio OS!', false, false, 'Desktop', 'macOS', 'Chrome', 'Mountain View', 'United States', ARRAY['projects', 'github', 'achievements', 'terminal'], 3),
  ('seed-2', 'Tech Recruiter', 'Staff Technical Recruiter', 'Microsoft AI', 'recruiter@microsoft.com', 'Impressed by the Bharat Dekho Gemini AI integration.', false, false, 'Desktop', 'Windows', 'Edge', 'Seattle', 'United States', ARRAY['projects', 'achievements', 'ai-assistant'], 2),
  ('seed-3', 'Open Source Contributor', 'Full Stack Engineer', 'Vercel Ecosystem', 'github.com/developer', 'Smooth 60 FPS liquid glass physics. Loved the Tetris AI!', false, false, 'Mobile', 'iOS', 'Safari', 'San Francisco', 'United States', ARRAY['github', 'tetris', 'camera'], 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.guestbook (id, author, role, company, message, verified)
VALUES
  ('gb-1', 'Sundar Pichai', 'CEO', 'Alphabet', 'Love the creativity and clean Next.js architecture. Great work Anugamya!', true),
  ('gb-2', 'Tech Recruiter', 'Recruiter', 'Microsoft AI', 'Great portfolio! Excited to discuss potential AI software engineering opportunities.', true),
  ('gb-3', 'Guillermo Rauch', 'CEO', 'Vercel', 'Incredible desktop simulator crafted on Next.js 14 and edge rendering.', true)
ON CONFLICT (id) DO NOTHING;
