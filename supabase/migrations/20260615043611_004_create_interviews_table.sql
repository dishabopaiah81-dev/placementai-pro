-- Create interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  questions JSONB DEFAULT '[]',
  total_score INTEGER DEFAULT 0,
  communication_score INTEGER DEFAULT 0,
  confidence_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  clarity_score INTEGER DEFAULT 0,
  professionalism_score INTEGER DEFAULT 0,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "interviews_select_own" ON public.interviews FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "interviews_insert_own" ON public.interviews FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "interviews_update_own" ON public.interviews FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS interviews_user_id_idx ON public.interviews(user_id);