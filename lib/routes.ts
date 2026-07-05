import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Map,
  Bot,
  MessageCircle,
  Star,
  Trophy,
  Code,
} from 'lucide-react';

export const APP_ROUTES = [
  '/dashboard',
  '/resume',
  '/skill-analysis',
  '/roadmap',
  '/recruiter',
  '/interview',
  '/feedback',
  '/score',
  '/coding-test',
] as const;

export const PUBLIC_ROUTES = ['/', '/login'] as const;

export function isAppRoute(pathname: string) {
  return APP_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.includes(pathname as (typeof PUBLIC_ROUTES)[number]);
}

export const SIDEBAR_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume', href: '/resume', icon: FileText },
  { name: 'Skill Analysis', href: '/skill-analysis', icon: BarChart3 },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'AI Recruiter', href: '/recruiter', icon: Bot },
  { name: 'Interview', href: '/interview', icon: MessageCircle },
  { name: 'Feedback', href: '/feedback', icon: Star },
  { name: 'Score', href: '/score', icon: Trophy },
  { name: 'Coding Test', href: '/coding-test', icon: Code },
];

export const FEATURE_LINKS = [
  { title: 'Resume Analyzer', href: '/resume', description: 'AI-powered resume feedback' },
  { title: 'Skill Analysis', href: '/skill-analysis', description: 'Identify skill gaps' },
  { title: 'Learning Roadmap', href: '/roadmap', description: 'Personalized learning path' },
  { title: 'Mock Interview', href: '/interview', description: 'Practice with AI recruiter' },
  { title: 'AI Recruiter', href: '/recruiter', description: 'Career guidance chat' },
  { title: 'Placement Score', href: '/score', description: 'Track readiness score' },
];
