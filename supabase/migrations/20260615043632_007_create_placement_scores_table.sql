-- Create placement_scores table
CREATE TABLE IF NOT EXISTS public.placement_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  resume_score INTEGER DEFAULT 0,
  skill_score INTEGER DEFAULT 0,
  coding_score INTEGER DEFAULT 0,
  interview_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  is_shortlisted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.placement_scores ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "placement_scores_select_own" ON public.placement_scores FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "placement_scores_insert_own" ON public.placement_scores FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "placement_scores_update_own" ON public.placement_scores FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS placement_scores_user_id_idx ON public.placement_scores(user_id);

-- Create function to update total_score
CREATE OR REPLACE FUNCTION update_total_score()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_score := (NEW.resume_score + NEW.skill_score + NEW.coding_score + NEW.interview_score) / 4;
  NEW.is_shortlisted := NEW.total_score >= 75;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_placement_score_trigger
BEFORE INSERT OR UPDATE ON public.placement_scores
FOR EACH ROW
EXECUTE FUNCTION update_total_score();