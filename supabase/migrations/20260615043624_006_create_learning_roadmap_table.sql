-- Create learning_milestones table
CREATE TABLE IF NOT EXISTS public.learning_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  skill TEXT NOT NULL,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  progress INTEGER DEFAULT 0,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.learning_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "learning_milestones_select_own" ON public.learning_milestones FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "learning_milestones_insert_own" ON public.learning_milestones FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "learning_milestones_update_own" ON public.learning_milestones FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "learning_milestones_delete_own" ON public.learning_milestones FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS learning_milestones_user_id_idx ON public.learning_milestones(user_id);