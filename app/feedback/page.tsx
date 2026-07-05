"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  MessageSquare,
  Video,
  Target
} from 'lucide-react';
import { PastelButton } from '@/components/pastel-button';
import { ProgressBar } from '@/components/progress-bar';
import { FloatingCirclesMini } from '@/components/floating-circles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';

const feedbackHistory = [
  {
    date: '2024-01-15',
    type: 'interview',
    score: 82,
    details: 'Strong communication, improve technical depth',
  },
  {
    date: '2024-01-10',
    type: 'interview',
    score: 75,
    details: 'Good confidence, work on structure',
  },
  {
    date: '2024-01-05',
    type: 'interview',
    score: 68,
    details: 'Need more practice with behavioral questions',
  },
];

const progressData = [
  { name: 'Week 1', score: 45 },
  { name: 'Week 2', score: 52 },
  { name: 'Week 3', score: 65 },
  { name: 'Week 4', score: 72 },
  { name: 'Week 5', score: 78 },
  { name: 'Week 6', score: 85 },
];

const categoryScores = [
  { name: 'Communication', score: 85, fill: '#B5EAD7' },
  { name: 'Confidence', score: 78, fill: '#FFD1DC' },
  { name: 'Technical', score: 72, fill: '#D4E6F1' },
  { name: 'Clarity', score: 88, fill: '#E8DFF5' },
  { name: 'Professionalism', score: 82, fill: '#FFEaaC' },
];

const improvementTips = [
  {
    category: 'Communication',
    tips: [
      'Practice speaking slowly and clearly',
      'Use the STAR method for behavioral questions',
      'Avoid filler words (um, uh, like)',
    ],
  },
  {
    category: 'Technical',
    tips: [
      'Study common algorithms and data structures',
      'Practice explaining your thought process',
      'Learn system design fundamentals',
    ],
  },
  {
    category: 'Confidence',
    tips: [
      'Practice mock interviews regularly',
      'Prepare success stories from your experience',
      'Research the company thoroughly',
    ],
  },
];

export default function FeedbackPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'tips'>('overview');

  return (
    <div className="min-h-screen relative pb-20">
      <div className="bg-gradient-to-r from-purple-100/50 via-lavender-soft/30 to-pink-soft/20 border-b border-white/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Feedback Dashboard</h1>
            <p className="text-gray-500 mt-2">Review performance and track improvement over time</p>
          </motion.div>
          <div className="flex gap-2 mt-6">
            {(['overview', 'history', 'tips'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition ${
                  activeTab === tab ? 'bg-white shadow-soft text-gray-900' : 'text-gray-500 hover:bg-white/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">12</p>
            <p className="text-xs text-gray-500">Interviews</p>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-400 to-violet-400 flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">45</p>
            <p className="text-xs text-gray-500">Questions Answered</p>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">+40%</p>
            <p className="text-xs text-gray-500">Progress</p>
          </div>
          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-800">82</p>
            <p className="text-xs text-gray-500">Avg Score</p>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Progress Chart */}
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Score Progress
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#E8DFF5"
                    fill="#E8DFF5"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category Scores */}
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Category Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="80%"
                  data={categoryScores}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
                    background
                    dataKey="score"
                  />
                  <Legend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
          </>
        )}

        {activeTab === 'history' && (
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-semibold text-gray-800 mb-4">Recent Feedback</h3>
            <div className="space-y-3">
              {feedbackHistory.map((item, index) => (
                <motion.div
                  key={item.date}
                  className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-soft transition"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.type === 'interview' ? 'bg-lavender-soft' : 'bg-pink-soft'
                      }`}>
                        {item.type === 'interview' ? (
                          <MessageSquare className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Video className="w-5 h-5 text-pink-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{item.type}</p>
                        <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-emerald-500">{item.score}</p>
                  </div>
                  <p className="text-sm text-gray-600">{item.details}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tips' && (
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Personalized Improvement Tips
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {improvementTips.map((category, index) => (
                <motion.div
                  key={category.category}
                  className="p-4 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <h4 className="font-medium text-gray-800 mb-3">{category.category}</h4>
                  <ul className="space-y-2">
                    {category.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-mint flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="mt-8 flex gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/interview">
            <PastelButton variant="outline" icon={<Video className="w-4 h-4" />}>
              Practice Again
            </PastelButton>
          </Link>
          <Link href="/score">
            <PastelButton icon={<Award className="w-4 h-4" />}>
              View Placement Score
            </PastelButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
