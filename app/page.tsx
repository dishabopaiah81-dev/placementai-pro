"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileSearch,
  Target,
  MessageSquare,
  Code,
  Route,
  Award,
  ArrowRight,
  Play,
  CheckCircle,
} from 'lucide-react';
import { FloatingCircles } from '@/components/floating-circles';
import { PastelButton } from '@/components/pastel-button';
import { FEATURE_LINKS } from '@/lib/routes';

const stats = [
  { label: 'Students Placed', value: '10,000+' },
  { label: 'Avg Score Increase', value: '+35%' },
  { label: 'Interview Success', value: '85%' },
  { label: 'Companies', value: '500+' },
];

const featureIcons = [FileSearch, Target, MessageSquare, Code, Route, Award];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <FloatingCircles />

      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                PlacementAI Pro
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition text-sm">
                Features
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition text-sm">
                Dashboard
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition text-sm">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <PastelButton variant="outline" size="sm">Login</PastelButton>
              </Link>
              <Link href="/login?register=true">
                <PastelButton size="sm">Get Started</PastelButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-soft/50 text-sm font-medium text-gray-700 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Play className="w-4 h-4" />
                AI-Powered Placement Prep
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-gray-900">Land Your Dream</span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Job with AI
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                A multi-page SaaS platform for resume analysis, skill gaps, mock interviews,
                and placement readiness — each tool on its own dedicated page.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Link href="/login?register=true">
                  <PastelButton size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                    Start Free Trial
                  </PastelButton>
                </Link>
                <Link href="/dashboard">
                  <PastelButton variant="outline" size="lg">
                    Go to Dashboard
                  </PastelButton>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-mint" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-mint" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="glass-card p-6 rounded-3xl shadow-floating">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-pink-soft via-lavender-soft to-blue-soft flex items-center justify-center relative overflow-hidden">
                  <Link href="/interview" className="group">
                    <motion.img
                      src="/ai-girl.png"
                      alt="AI Recruiter"
                      className="w-72 h-72 object-cover rounded-3xl shadow-lg group-hover:scale-105 transition-transform"
                      animate={{ scale: [1, 1.03, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Link>
                  <Link href="/recruiter" className="absolute bottom-4 left-4 glass px-4 py-2 rounded-xl hover:bg-white/80 transition">
                    <p className="text-sm font-medium text-gray-700">AI Recruiter Active</p>
                    <p className="text-xs text-gray-500">Chat with Priya →</p>
                  </Link>
                  <Link href="/score" className="absolute top-4 right-4 glass px-4 py-2 rounded-xl hover:bg-white/80 transition">
                    <p className="text-xs text-gray-500">Overall Score</p>
                    <p className="text-lg font-bold text-gray-800">87/100</p>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 rounded-3xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Platform
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each feature lives on its own page — no scrolling, just focused tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_LINKS.map((feature, index) => {
              const Icon = featureIcons[index] || FileSearch;
              return (
                <Link key={feature.href} href={feature.href}>
                  <motion.div
                    className="glass-card p-6 rounded-2xl card-hover h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                    <span className="text-sm font-medium text-pink-500 inline-flex items-center gap-1">
                      Open page <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 rounded-3xl text-center bg-gradient-to-br from-pink-soft/50 via-lavender-soft/50 to-blue-soft/50">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Get{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Placed?
              </span>
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Sign in and navigate to dedicated pages for every step of your placement journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login?register=true">
                <PastelButton size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                  Start Your Journey
                </PastelButton>
              </Link>
              <Link href="/login">
                <PastelButton variant="outline" size="lg">
                  Sign In
                </PastelButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl text-gray-800">PlacementAI</span>
              </div>
              <p className="text-gray-500 text-sm">
                AI-powered placement preparation platform for students and freshers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/resume" className="hover:text-gray-700">Resume Analyzer</Link></li>
                <li><Link href="/interview" className="hover:text-gray-700">Mock Interview</Link></li>
                <li><Link href="/score" className="hover:text-gray-700">Placement Score</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link></li>
                <li><Link href="/roadmap" className="hover:text-gray-700">Roadmap</Link></li>
                <li><Link href="/feedback" className="hover:text-gray-700">Feedback</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Account</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/login" className="hover:text-gray-700">Login</Link></li>
                <li><Link href="/login?register=true" className="hover:text-gray-700">Register</Link></li>
                <li><Link href="/recruiter" className="hover:text-gray-700">AI Recruiter</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 text-center text-gray-500 text-sm">
            <p>&copy; 2024 PlacementAI Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}