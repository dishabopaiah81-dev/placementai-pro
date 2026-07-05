-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  skill_name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency TEXT DEFAULT 'beginner' CHECK (proficiency IN ('beginner', 'intermediate', 'advanced')),
  has_skill BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create skill_analysis table
CREATE TABLE IF NOT EXISTS public.skill_analysis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  matched_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  match_percentage INTEGER DEFAULT 0,
  target_role TEXT NOT NULL,
  radar_data JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for skills
CREATE POLICY "skills_select_own" ON public.skills FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "skills_insert_own" ON public.skills FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "skills_update_own" ON public.skills FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "skills_delete_own" ON public.skills FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Create policies for skill_analysis
CREATE POLICY "skill_analysis_select_own" ON public.skill_analysis FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "skill_analysis_insert_own" ON public.skill_analysis FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS skills_user_id_idx ON public.skills(user_id);
CREATE INDEX IF NOT EXISTS skill_analysis_user_id_idx ON public.skill_analysis(user_id);