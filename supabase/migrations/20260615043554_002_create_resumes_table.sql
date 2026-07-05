-- Create resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  ats_score INTEGER DEFAULT 0,
  clarity_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  impact_score INTEGER DEFAULT 0,
  structure_score INTEGER DEFAULT 0,
  feedback JSONB DEFAULT '{"strengths": [], "weaknesses": [], "improvements": []}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "resumes_select_own" ON public.resumes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "resumes_insert_own" ON public.resumes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resumes_update_own" ON public.resumes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resumes_delete_own" ON public.resumes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON public.resumes(user_id);