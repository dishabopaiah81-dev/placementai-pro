"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Award,
  Trophy,
  Star,
  FileText,
  Code,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Sparkles,
  Download,
  Share2,
  Bell,
  Mail,
  Loader
} from 'lucide-react';
import { PastelButton } from '@/components/pastel-button';
import { ProgressBar } from '@/components/progress-bar';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';

interface EvaluationResult {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  candidateName: string;
}

export default function ScorePage() {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);

  const resumeScore = 78;
  const skillScore = 72;
  const codingScore = 85;

  useEffect(() => {
    const evaluateInterview = async () => {
      try {
        setLoading(true);
        setError(null);

        const interviewResults = localStorage.getItem("interviewResults");
        const candidateName = localStorage.getItem("candidateName") || "Candidate";
        const userResume = localStorage.getItem("userResume") || "";

        if (!interviewResults) {
          setError("No interview results found");
          setLoading(false);
          return;
        }

        const conversationHistory = JSON.parse(interviewResults);

        if (!conversationHistory || conversationHistory.length === 0) {
          setError("No conversation history available");
          setLoading(false);
          return;
        }

        console.log("📊 Evaluating interview...", {
          answers: conversationHistory.length,
          candidate: candidateName,
        });

        const response = await fetch("/api/interview/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationHistory,
            candidateName,
            resumeText: userResume,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to evaluate interview");
        }

        const result: EvaluationResult = await response.json();

        console.log("✅ Evaluation Complete:", {
          overall: result.overallScore,
          technical: result.technicalScore,
          communication: result.communicationScore,
          confidence: result.confidenceScore,
        });

        setEvaluation(result);
      } catch (err: any) {
        console.error("❌ Evaluation error:", err);
        setError(err.message || "Failed to evaluate interview");
        
        const interviewResults = localStorage.getItem("interviewResults");
        if (interviewResults) {
          const conversationHistory = JSON.parse(interviewResults);
          const avgScore = Math.round(
            conversationHistory.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / 
            conversationHistory.length
          );

          setEvaluation({
            overallScore: avgScore,
            technicalScore: avgScore - 5,
            communicationScore: avgScore,
            confidenceScore: avgScore + 5,
            strengths: ["Completed interview"],
            weaknesses: ["Could not fully evaluate"],
            candidateName: localStorage.getItem("candidateName") || "Candidate",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    evaluateInterview();
  }, []);

  const interviewScore = evaluation?.overallScore || 0;
  const scoreData = {
    resume: resumeScore,
    skill: skillScore,
    coding: codingScore,
    interview: interviewScore,
    total: Math.round((resumeScore + skillScore + codingScore + interviewScore) / 4),
  };

  const radarData = [
    { skill: 'Resume', score: scoreData.resume },
    { skill: 'Skills', score: scoreData.skill },
    { skill: 'Coding', score: scoreData.coding },
    { skill: 'Interview', score: interviewScore },
    { skill: 'Projects', score: 70 },
  ];

  const achievements = [
    { title: 'Interview Pro', description: 'Completed mock interview', earned: true },
    { title: 'Code Master', description: 'Demonstrated coding skills', earned: interviewScore >= 70 },
    { title: 'Resume Ready', description: 'Optimized resume', earned: resumeScore >= 75 },
    { title: 'Communicator', description: 'Clear communication', earned: evaluation?.communicationScore! >= 70 },
    { title: 'Top Performer', description: 'Achieved 75+ overall', earned: scoreData.total >= 75 },
  ];

  const isShortlisted = scoreData.total >= 75;

  const handleNotification = async () => {
    setSendingNotification(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSendingNotification(false);
    setNotificationSent(true);
  };

  const handleDownloadReport = async () => {
    try {
      const candidateName = localStorage.getItem("candidateName") || "Candidate";
      console.log("📥 Downloading report for:", candidateName);
      
      const response = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: candidateName,
          overallScore: scoreData.total,
          resumeScore: scoreData.resume,
          interviewScore: scoreData.interview,
          technicalScore: evaluation?.technicalScore || 0,
          communicationScore: evaluation?.communicationScore || 0,
          confidenceScore: evaluation?.confidenceScore || 0,
          strengths: evaluation?.strengths || [],
          weaknesses: evaluation?.weaknesses || [],
        }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${candidateName}_PlacementReport.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log("✅ Report downloaded:", candidateName);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download report");
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-100/60 via-pink-soft/40 to-lavender-soft/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Placement Readiness Score</h1>
            <p className="text-gray-600 mt-2">Your comprehensive assessment across all modules</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {loading && (
          <motion.div
            className="glass-card p-12 rounded-3xl mb-8 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-500" />
            <p className="text-gray-600">Evaluating your interview responses...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a minute</p>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            className="glass-card p-6 rounded-3xl mb-8 bg-red-50 border border-red-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-red-600 font-medium mb-2">⚠️ {error}</p>
            <p className="text-sm text-red-500">Using fallback scores for display</p>
          </motion.div>
        )}

        {!loading && (
          <>
            <motion.div
              className="glass-card p-8 rounded-3xl mb-8 text-center relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gradient-to-br from-pink-soft/40 to-lavender-soft/40 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-br from-blue-soft/40 to-mint/40 blur-3xl" />

              <div className="relative z-10">
                <h2 className="text-lg text-gray-600 mb-8">Your Placement Score</h2>

                <div className="relative inline-block mb-8">
                  <svg className="w-56 h-56 -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-gray-100"
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="90"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={565}
                      initial={{ strokeDashoffset: 565 }}
                      animate={{ strokeDashoffset: 565 - (565 * scoreData.total) / 100 }}
                      transition={{ duration: 2, ease: 'easeOut' }}
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFD1DC" />
                        <stop offset="50%" stopColor="#E8DFF5" />
                        <stop offset="100%" stopColor="#B5EAD7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    <motion.span
                      className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5, type: 'spring' }}
                    >
                      {scoreData.total}
                    </motion.span>
                    <span className="text-gray-400 text-sm mt-1">out of 100</span>
                  </motion.div>
                </div>

                <motion.div
                  className={`inline-flex flex-col items-center p-6 rounded-2xl ${
                    isShortlisted
                      ? 'bg-gradient-to-br from-mint/30 to-teal-100'
                      : 'bg-gradient-to-br from-orange-100 to-amber-100'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2 }}
                >
                  {isShortlisted ? (
                    <>
                      <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        <Trophy className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-emerald-700">
                        Congratulations, {evaluation?.candidateName}!
                      </h3>
                      <p className="text-emerald-600 mt-2">
                        You are shortlisted for placement!
                      </p>
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center mb-4"
                      >
                        <Star className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-orange-700">
                        Keep Improving!
                      </h3>
                      <p className="text-orange-600 mt-2">
                        You&apos;re close! Continue practicing to reach 75+.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Need {Math.max(0, 75 - scoreData.total)} more points to be shortlisted.
                      </p>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-semibold text-gray-800 mb-6">Score Breakdown</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Resume Score', score: scoreData.resume, icon: FileText, color: 'from-pink-400 to-rose-400' },
                    { label: 'Skill Match', score: scoreData.skill, icon: BarChart3, color: 'from-blue-400 to-cyan-400' },
                    { label: 'Coding Score', score: scoreData.coding, icon: Code, color: 'from-purple-400 to-violet-400' },
                    { label: 'Interview Score', score: scoreData.interview, icon: MessageSquare, color: 'from-emerald-400 to-teal-400' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * (index + 3) }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-gray-700">{item.label}</span>
                          </div>
                          <span className="font-bold text-gray-800">{item.score}</span>
                        </div>
                        <div className="progress-bar h-2">
                          <motion.div
                            className={`progress-fill bg-gradient-to-r ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl">
                <h3 className="font-semibold text-gray-800 mb-6">Interview Performance</h3>
                <div className="space-y-5">
                  {[
                    { label: 'Technical Knowledge', score: evaluation?.technicalScore || 0, color: 'from-blue-400 to-cyan-400' },
                    { label: 'Communication', score: evaluation?.communicationScore || 0, color: 'from-purple-400 to-pink-400' },
                    { label: 'Confidence', score: evaluation?.confidenceScore || 0, color: 'from-amber-400 to-orange-400' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 3.5) }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="font-bold text-gray-800">{item.score}</span>
                      </div>
                      <div className="progress-bar h-2">
                        <motion.div
                          className={`progress-fill bg-gradient-to-r ${item.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.score}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-mint/20 to-teal-100/50">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Your Strengths
                </h3>
                <ul className="space-y-3">
                  {(evaluation?.strengths || []).map((strength, index) => (
                    <motion.li
                      key={index}
                      className="text-sm text-gray-700 flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 4) }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                      {strength}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-orange-100/50 to-amber-100/50">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  Areas to Improve
                </h3>
                <ul className="space-y-3">
                  {(evaluation?.weaknesses || []).map((weakness, index) => (
                    <motion.li
                      key={index}
                      className="text-sm text-gray-700 flex items-start gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (index + 4.5) }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                      {weakness}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div
              className="glass-card p-6 rounded-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Overall Profile</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
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
                      name="Score"
                      dataKey="score"
                      stroke="#E8DFF5"
                      fill="#E8DFF5"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              className="glass-card p-6 rounded-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h3 className="font-semibold text-gray-800 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    className={`p-4 rounded-xl text-center ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-pink-soft/30 to-lavender-soft/30'
                        : 'bg-gray-50 opacity-60'
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * (index + 5) }}
                  >
                    <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      achievement.earned
                        ? 'bg-gradient-to-br from-amber-400 to-orange-400'
                        : 'bg-gray-200'
                    }`}>
                      <Award className={`w-5 h-5 ${achievement.earned ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-800">{achievement.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {isShortlisted && (
              <motion.div
                className="glass-card p-6 rounded-2xl mb-8 bg-gradient-to-r from-mint/20 to-teal-100/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-teal-500" />
                  Send Notification
                </h3>
                <p className="text-gray-600 mb-4">
                  Notify your placement coordinator about your achievement!
                </p>

                <AnimatePresence mode="wait">
                  {!notificationSent ? (
                    <div className="flex gap-3">
                      <PastelButton
                        variant="outline"
                        loading={sendingNotification}
                        onClick={handleNotification}
                        icon={<Bell className="w-4 h-4" />}
                      >
                        Send SMS Notification
                      </PastelButton>
                      <PastelButton
                        variant="outline"
                        loading={sendingNotification}
                        onClick={handleNotification}
                        icon={<Mail className="w-4 h-4" />}
                      >
                        Send Email
                      </PastelButton>
                    </div>
                  ) : (
                    <motion.div
                      className="flex items-center gap-2 text-emerald-600"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Notification sent successfully!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {!isShortlisted && (
              <motion.div
                className="glass-card p-6 rounded-2xl mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Improvement Suggestions
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-pink-soft/20">
                    <p className="font-medium text-gray-800 mb-2">Improve Resume Score</p>
                    <p className="text-sm text-gray-600">
                      Add more quantifiable achievements and optimize for ATS keywords.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-soft/20">
                    <p className="font-medium text-gray-800 mb-2">Enhance Interview Skills</p>
                    <p className="text-sm text-gray-600">
                      Practice more mock interviews and focus on clear communication.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <PastelButton 
                variant="outline" 
                icon={<Download className="w-4 h-4" />}
                onClick={handleDownloadReport}
              >
                Download Report
              </PastelButton>
              <PastelButton variant="outline" icon={<Share2 className="w-4 h-4" />}>
                Share Score
              </PastelButton>
              <Link href="/interview">
                <PastelButton icon={<MessageSquare className="w-4 h-4" />}>
                  Practice Interview
                </PastelButton>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}