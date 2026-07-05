"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  ChevronRight
} from 'lucide-react';
import { PastelButton } from '@/components/pastel-button';
import { ProgressBar } from '@/components/progress-bar';
import { FloatingCirclesMini } from '@/components/floating-circles';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

const jobRoles = [
  'Software Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
];

const mockAnalysis = {
  role: 'Full Stack Developer',
  matchPercentage: 68,
  matchedSkills: [
    { name: 'JavaScript', level: 85 },
    { name: 'React', level: 80 },
    { name: 'Node.js', level: 70 },
    { name: 'Git', level: 90 },
    { name: 'SQL', level: 75 },
    { name: 'HTML/CSS', level: 88 },
    { name: 'REST APIs', level: 72 },
    { name: 'Problem Solving', level: 78 },
  ],
  missingSkills: [
    { name: 'TypeScript', importance: 'High', description: 'Essential for modern full-stack development' },
    { name: 'Docker', importance: 'High', description: 'Required for containerization and DevOps' },
    { name: 'AWS/Cloud', importance: 'Medium', description: 'Important for scalable deployments' },
    { name: 'MongoDB', importance: 'Medium', description: 'NoSQL database skills' },
    { name: 'GraphQL', importance: 'Low', description: 'Modern API query language' },
  ],
  radarData: [
    { skill: 'Frontend', score: 85 },
    { skill: 'Backend', score: 65 },
    { skill: 'Database', score: 70 },
    { skill: 'DevOps', score: 40 },
    { skill: 'Testing', score: 55 },
    { skill: 'Cloud', score: 30 },
  ],
  pieData: [
    { name: 'Matched Skills', value: 68, color: '#B5EAD7' },
    { name: 'Missing Skills', value: 32, color: '#FFD1DC' },
  ],
};

export default function SkillAnalysisPage() {
  const [selectedRole, setSelectedRole] = useState(mockAnalysis.role);
  const [analysis, setAnalysis] = useState(mockAnalysis);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalysis({ ...mockAnalysis, role: selectedRole });
      setAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative pb-20">
      <div className="grid lg:grid-cols-[280px_1fr] gap-0 min-h-[calc(100vh-4rem)]">
        <aside className="border-r border-white/30 bg-blue-soft/20 p-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Target Role</p>
            <h1 className="text-xl font-bold text-gray-800 mb-1">Skill Gap Analysis</h1>
            <p className="text-sm text-gray-500 mb-6">Compare your skills against job requirements</p>
            <label className="block text-sm font-medium text-gray-600 mb-2">Select Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full input-pastel mb-4"
            >
              {jobRoles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <PastelButton
              onClick={handleAnalyze}
              loading={analyzing}
              icon={<Search className="w-4 h-4" />}
              className="w-full"
            >
              Analyze Skills
            </PastelButton>
            <Link href="/roadmap" className="block mt-4">
              <PastelButton variant="outline" className="w-full" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                View Roadmap
              </PastelButton>
            </Link>
          </motion.div>
        </aside>

        <div className="p-4 sm:p-6 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Match Percentage Card */}
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              Skill Match
            </h3>

            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analysis.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {analysis.pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-4xl font-bold text-gray-800"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {analysis.matchPercentage}%
                  </motion.span>
                  <span className="text-sm text-gray-500">Match</span>
                </div>
              </div>

              <Link href="/roadmap" className="w-full mt-6">
                <PastelButton className="w-full" icon={<ChevronRight className="w-4 h-4" />} iconPosition="right">
                  View Learning Path
                </PastelButton>
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Skill Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={analysis.radarData}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  />
                  <Radar
                    name="Skills"
                    dataKey="score"
                    stroke="#E8DFF5"
                    fill="#E8DFF5"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Matched Skills */}
          <motion.div
            className="glass-card p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Your Skills ({analysis.matchedSkills.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-hide">
              {analysis.matchedSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-gray-500">{skill.level}%</span>
                  </div>
                  <ProgressBar
                    value={skill.level}
                    color="bg-gradient-to-r from-mint to-teal-400"
                    showLabel={false}
                    size="sm"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Missing Skills Section */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Skills to Learn ({analysis.missingSkills.length})
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.missingSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{skill.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      skill.importance === 'High' ? 'bg-red-100 text-red-600' :
                      skill.importance === 'Medium' ? 'bg-amber-100 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {skill.importance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{skill.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          className="mt-8 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="glass-card p-6 rounded-2xl bg-gradient-to-r from-pink-soft/20 via-lavender-soft/20 to-blue-soft/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Recommendations
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl glass">
                <p className="font-medium text-gray-800 mb-2">Priority Focus</p>
                <p className="text-sm text-gray-600">
                  Start with TypeScript and Docker. These are essential skills for the {analysis.role} role.
                </p>
              </div>
              <div className="p-4 rounded-xl glass">
                <p className="font-medium text-gray-800 mb-2">Estimated Time</p>
                <p className="text-sm text-gray-600">
                  8-12 weeks of dedicated learning to reach proficiency in missing skills.
                </p>
              </div>
              <div className="p-4 rounded-xl glass">
                <p className="font-medium text-gray-800 mb-2">Career Impact</p>
                <p className="text-sm text-gray-600">
                  Adding these skills could increase your match to 85%+.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </div>
  );
}
