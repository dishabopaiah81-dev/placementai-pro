import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
};

export type Resume = {
  id: string;
  user_id: string;
  file_url: string;
  file_name: string;
  score: number;
  ats_score: number;
  clarity_score: number;
  technical_score: number;
  impact_score: number;
  structure_score: number;
  feedback: ResumeFeedback;
  created_at: string;
};

export type ResumeFeedback = {
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
};

export type Skill = {
  id: string;
  user_id: string;
  skill_name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced';
  has_skill: boolean;
};

export type SkillAnalysis = {
  id: string;
  user_id: string;
  matched_skills: string[];
  missing_skills: string[];
  match_percentage: number;
  target_role: string;
  created_at: string;
};

export type LearningMilestone = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  skill: string;
  status: 'not_started' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  completed_at?: string;
};

export type CodingAssessment = {
  id: string;
  user_id: string;
  language: string;
  question: string;
  code: string;
  score: number;
  passed: boolean;
  time_taken: number;
  created_at: string;
};

export type Interview = {
  id: string;
  user_id: string;
  questions: InterviewQuestion[];
  total_score: number;
  communication_score: number;
  confidence_score: number;
  technical_score: number;
  clarity_score: number;
  professionalism_score: number;
  feedback: string;
  created_at: string;
};

export type InterviewQuestion = {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  category: string;
};

export type PlacementScore = {
  id: string;
  user_id: string;
  resume_score: number;
  skill_score: number;
  coding_score: number;
  interview_score: number;
  total_score: number;
  is_shortlisted: boolean;
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};
