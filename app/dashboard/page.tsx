"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  BarChart3,
  Code,
  MessageCircle,
  Award,
  TrendingUp,
  Calendar,
  Clock,
  ChevronRight,
  Target,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { ScoreCard } from '@/components/score-card';
import { PastelButton } from '@/components/pastel-button';
import { ProgressRing } from '@/components/progress-bar';
import { FloatingCirclesMini } from '@/components/floating-circles';
import { useAuth } from '@/lib/auth-context';

const quickActions = [
  { title: 'Upload Resume', description: 'Get AI feedback', href: '/resume', icon: FileText, color: 'from-pink-400 to-rose-400' },
  { title: 'Take Interview', description: 'Practice with AI', href: '/interview', icon: MessageCircle, color: 'from-purple-400 to-violet-400' },
  { title: 'Coding Test', description: 'Test your skills', href: '/coding-test', icon: Code, color: 'from-blue-400 to-cyan-400' },
  { title: 'Skill Analysis', description: 'Find your gaps', href: '/skill-analysis', icon: Target, color: 'from-emerald-400 to-teal-400' },
];

const activities = [
  { type: 'resume', title: 'Resume uploaded', description: 'AI analysis completed', time: '2 hours ago', score: 78 },
  { type: 'interview', title: 'Mock interview', description: 'Communication: 85/100', time: '1 day ago', score: 85 },
  { type: 'coding', title: 'Coding assessment', description: 'Python - Two Sum', time: '2 days ago', score: 90 },
  { type: 'skill', title: 'Skill analysis', description: 'Missing 3 skills', time: '3 days ago', score: 72 },
];

const upcomingMilestones = [
  { title: 'Complete React basics', progress: 75, deadline: 'In 3 days' },
  { title: 'Mock interview practice', progress: 40, deadline: 'In 5 days' },
  { title: 'SQL fundamentals', progress: 20, deadline: 'In 7 days' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [scores, setScores] = useState({
    resume: 78,
    skill: 72,
    coding: 85,
    interview: 82,
    total: 79
  });

  return (
    <div className="min-h-screen relative pb-20">
      <FloatingCirclesMini />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Welcome back, {user?.name || 'Student'}!
              </h1>
              <p className="text-gray-500 mt-1">
                Here&apos;s your placement preparation progress
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>
              <Link href="/score">
                <PastelButton variant="outline" size="sm">
                  View Full Score
                </PastelButton>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Overall Score Banner */}
        <motion.div
          className="glass-card p-6 rounded-2xl mb-8 bg-gradient-to-r from-pink-soft/30 via-lavender-soft/30 to-blue-soft/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <ProgressRing value={scores.total} size={100} />
              <div>
                <p className="text-sm text-gray-500 mb-1">Overall Placement Score</p>
                <h2 className="text-3xl font-bold text-gray-800">{scores.total}/100</h2>
                <div className="flex items-center gap-1 mt-2 text-sm text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5 from last week</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="glass px-4 py-3 rounded-xl text-center">
                <p className="text-xs text-gray-500">Resume</p>
                <p className="text-lg font-bold text-pink-500">{scores.resume}</p>
              </div>
              <div className="glass px-4 py-3 rounded-xl text-center">
                <p className="text-xs text-gray-500">Skills</p>
                <p className="text-lg font-bold text-blue-500">{scores.skill}</p>
              </div>
              <div className="glass px-4 py-3 rounded-xl text-center">
                <p className="text-xs text-gray-500">Coding</p>
                <p className="text-lg font-bold text-purple-500">{scores.coding}</p>
              </div>
              <div className="glass px-4 py-3 rounded-xl text-center">
                <p className="text-xs text-gray-500">Interview</p>
                <p className="text-lg font-bold text-emerald-500">{scores.interview}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <motion.div
                    className="glass-card p-4 rounded-xl card-hover cursor-pointer"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ y: -4 }}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{action.description}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-pink-400" />
                Score Breakdown
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/resume">
                  <ScoreCard
                    title="Resume Score"
                    score={scores.resume}
                    icon={<FileText className="w-5 h-5 text-pink-500" />}
                    color="pink"
                  />
                </Link>
                <Link href="/skill-analysis">
                  <ScoreCard
                    title="Skill Match"
                    score={scores.skill}
                    icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
                    color="blue"
                  />
                </Link>
                <Link href="/coding-test">
                  <ScoreCard
                    title="Coding Score"
                    score={scores.coding}
                    icon={<Code className="w-5 h-5 text-purple-500" />}
                    color="lavender"
                  />
                </Link>
                <Link href="/interview">
                  <ScoreCard
                    title="Interview Score"
                    score={scores.interview}
                    icon={<MessageCircle className="w-5 h-5 text-emerald-500" />}
                    color="mint"
                  />
                </Link>
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Recent Activity
              </h3>
              <div className="glass-card rounded-2xl overflow-hidden">
                {activities.map((activity, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-4 p-4 hover:bg-white/50 transition ${
                      index !== activities.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'resume' ? 'bg-pink-soft' :
                      activity.type === 'interview' ? 'bg-lavender-soft' :
                      activity.type === 'coding' ? 'bg-blue-soft' : 'bg-mint/50'
                    }`}>
                      {activity.type === 'resume' && <FileText className="w-5 h-5 text-pink-500" />}
                      {activity.type === 'interview' && <MessageCircle className="w-5 h-5 text-purple-500" />}
                      {activity.type === 'coding' && <Code className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'skill' && <Target className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-700">{activity.score}/100</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Upcoming Milestones */}
            <motion.div
              className="glass-card p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-400" />
                Upcoming Milestones
              </h3>
              <div className="space-y-4">
                {upcomingMilestones.map((milestone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">{milestone.title}</span>
                      <span className="text-gray-400 text-xs">{milestone.deadline}</span>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill bg-gradient-to-r from-pink-400 to-purple-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 * index }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">{milestone.progress}% complete</p>
                  </div>
                ))}
              </div>
              <Link href="/roadmap">
                <PastelButton variant="ghost" className="w-full mt-4" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                  View Roadmap
                </PastelButton>
              </Link>
            </motion.div>

            {/* AI Recruiter Card */}
            <motion.div
              className="glass-card p-6 rounded-2xl bg-gradient-to-br from-lavender-soft to-pink-soft"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-start gap-4">
                <img
                  src="https://images.pexels.com/photos/7749086/pexels-photo-7749086.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Priya"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">Priya</h4>
                  <p className="text-sm text-gray-500">AI Recruiter</p>
                  <p className="text-xs text-gray-600 mt-2">
                    Hi! Need help with interview prep or career guidance?
                  </p>
                </div>
              </div>
              <Link href="/recruiter">
                <PastelButton className="w-full mt-4" size="sm">
                  Chat with Priya
                </PastelButton>
              </Link>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
              className="glass-card p-6 rounded-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-gray-800">Active Learner</h4>
              <p className="text-xs text-gray-500 mt-1">Completed 5 activities this week</p>
              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Keep it up!
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
