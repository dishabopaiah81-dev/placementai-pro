-- Create coding_assessments table
CREATE TABLE IF NOT EXISTS public.coding_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL,
  question TEXT NOT NULL,
  code TEXT,
  score INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  time_taken INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.coding_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "coding_assessments_select_own" ON public.coding_assessments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "coding_assessments_insert_own" ON public.coding_assessments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "coding_assessments_update_own" ON public.coding_assessments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS coding_assessments_user_id_idx ON public.coding_assessments(user_id);