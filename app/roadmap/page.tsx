"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Video,
  FileText,
  Code,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  Play,
  ExternalLink,
  Award
} from 'lucide-react';
import { PastelButton } from '@/components/pastel-button';
import { ProgressBar } from '@/components/progress-bar';
import { FloatingCirclesMini } from '@/components/floating-circles';

const roadmapSteps = [
  {
    id: 1,
    title: 'Foundation Building',
    description: 'Master the core programming concepts',
    status: 'completed',
    duration: '2 weeks',
    skills: ['JavaScript Basics', 'Data Structures', 'Algorithms'],
    progress: 100,
    resources: [
      { type: 'video', title: 'JavaScript Fundamentals', url: '#', completed: true },
      { type: 'course', title: 'DSA Crash Course', url: '#', completed: true },
      { type: 'project', title: 'Basic Calculator App', url: '#', completed: true },
    ],
  },
  {
    id: 2,
    title: 'Frontend Development',
    description: 'Build modern user interfaces',
    status: 'current',
    duration: '3 weeks',
    skills: ['React', 'HTML/CSS', 'Responsive Design'],
    progress: 60,
    resources: [
      { type: 'video', title: 'React for Beginners', url: '#', completed: true },
      { type: 'course', title: 'Advanced CSS', url: '#', completed: true },
      { type: 'project', title: 'Portfolio Website', url: '#', completed: false },
      { type: 'article', title: 'State Management Guide', url: '#', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Backend Development',
    description: 'Server-side programming and APIs',
    status: 'upcoming',
    duration: '3 weeks',
    skills: ['Node.js', 'REST APIs', 'MongoDB'],
    progress: 0,
    resources: [
      { type: 'video', title: 'Node.js Masterclass', url: '#', completed: false },
      { type: 'course', title: 'REST API Design', url: '#', completed: false },
      { type: 'project', title: 'REST API Project', url: '#', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Database & DevOps',
    description: 'Data management and deployment',
    status: 'upcoming',
    duration: '2 weeks',
    skills: ['SQL', 'Docker', 'AWS Basics'],
    progress: 0,
    resources: [
      { type: 'video', title: 'SQL Fundamentals', url: '#', completed: false },
      { type: 'course', title: 'Docker for Developers', url: '#', completed: false },
      { type: 'article', title: 'AWS Getting Started', url: '#', completed: false },
    ],
  },
  {
    id: 5,
    title: 'Interview Preparation',
    description: 'Ace your technical interviews',
    status: 'upcoming',
    duration: '2 weeks',
    skills: ['System Design', 'Behavioral Questions', 'Mock Interviews'],
    progress: 0,
    resources: [
      { type: 'video', title: 'System Design Primer', url: '#', completed: false },
      { type: 'course', title: 'Interview Mastery', url: '#', completed: false },
      { type: 'project', title: 'Mock Interview Practice', url: '#', completed: false },
    ],
  },
];

const resourceIcons: { [key: string]: React.ReactNode } = {
  video: <Video className="w-4 h-4" />,
  course: <BookOpen className="w-4 h-4" />,
  article: <FileText className="w-4 h-4" />,
  project: <Code className="w-4 h-4" />,
};

const resourceColors: { [key: string]: string } = {
  video: 'bg-pink-soft text-pink-500',
  course: 'bg-blue-soft text-blue-500',
  article: 'bg-lavender-soft text-purple-500',
  project: 'bg-mint/50 text-emerald-600',
};

export default function RoadmapPage() {
  const [expandedStep, setExpandedStep] = useState<number | null>(2);

  const toggleStep = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  const totalProgress = roadmapSteps.reduce((acc, step) => acc + step.progress, 0) / roadmapSteps.length;

  return (
    <div className="min-h-screen relative pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-medium text-purple-600 uppercase tracking-wide mb-2">Learning Path</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Your Roadmap</h1>
          <p className="text-gray-500 mt-2">Vertical timeline — expand each phase to see resources</p>
        </motion.div>
        {/* Progress Overview */}
        <motion.div
          className="glass-card p-6 rounded-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              Overall Progress
            </h3>
            <span className="text-sm font-medium text-gray-600">{Math.round(totalProgress)}%</span>
          </div>
          <ProgressBar value={totalProgress} showLabel={false} size="lg" />

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-xl bg-mint/30">
              <p className="text-2xl font-bold text-emerald-600">
                {roadmapSteps.filter(s => s.status === 'completed').length}
              </p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-lavender-soft/50">
              <p className="text-2xl font-bold text-purple-500">
                {roadmapSteps.filter(s => s.status === 'current').length}
              </p>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gray-100">
              <p className="text-2xl font-bold text-gray-500">
                {roadmapSteps.filter(s => s.status === 'upcoming').length}
              </p>
              <p className="text-xs text-gray-500">Remaining</p>
            </div>
          </div>
        </motion.div>

        {/* Roadmap Steps — Timeline */}
        <div className="relative pl-8 border-l-2 border-lavender-soft space-y-4">
          {roadmapSteps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`glass-card rounded-2xl overflow-hidden ${
                step.status === 'completed' ? 'border-l-4 border-l-emerald-400' :
                step.status === 'current' ? 'border-l-4 border-l-purple-400' :
                ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-gradient-to-br from-emerald-400 to-teal-400' :
                    step.status === 'current' ? 'bg-gradient-to-br from-purple-400 to-violet-400' :
                    'bg-gray-100'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <span className="text-lg font-bold text-gray-500">{step.id}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">{step.progress}%</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {step.duration}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedStep === step.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {expandedStep === step.id && (
                <motion.div
                  className="px-6 pb-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                >
                  <div className="border-t border-gray-100 pt-4">
                    {/* Skills */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Skills Covered</p>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full text-sm bg-pink-soft/50 text-gray-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-700 font-medium">{step.progress}%</span>
                      </div>
                      <ProgressBar
                        value={step.progress}
                        color={
                          step.progress === 100 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                          step.progress > 0 ? 'bg-gradient-to-r from-purple-400 to-violet-400' :
                          'bg-gray-200'
                        }
                        showLabel={false}
                      />
                    </div>

                    {/* Resources */}
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-3">Resources</p>
                      <div className="space-y-2">
                        {step.resources.map((resource, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/50 hover:bg-white transition"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${resourceColors[resource.type]}`}>
                                {resourceIcons[resource.type]}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{resource.title}</p>
                                <p className="text-xs text-gray-400 capitalize">{resource.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {resource.completed ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <PastelButton variant="ghost" size="sm">
                                  <Play className="w-4 h-4" />
                                </PastelButton>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Continue Learning */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/interview">
            <PastelButton className="w-full" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
              Practice Mock Interview
            </PastelButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
