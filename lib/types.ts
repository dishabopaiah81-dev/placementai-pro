export type NavigationItem = {
  name: string;
  href: string;
  icon: string;
  active?: boolean;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon: string;
  color: 'pink' | 'blue' | 'lavender' | 'mint';
};

export type ScoreBreakdown = {
  label: string;
  score: number;
  maxScore: number;
  color: string;
};

export type Activity = {
  id: string;
  type: 'resume' | 'interview' | 'coding' | 'skill';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
};

export type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
};

export type RoadmapStep = {
  id: number;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  status: 'completed' | 'current' | 'upcoming';
  resources: {
    type: 'course' | 'video' | 'article' | 'project';
    title: string;
    url: string;
  }[];
};

export type CodingQuestion = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: { [language: string]: string };
  testCases: { input: string; expectedOutput: string }[];
};

export type InterviewCategory = {
  name: string;
  score: number;
  color: string;
};

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type ToastData = {
  title: string;
  description?: string;
  type: NotificationType;
};
