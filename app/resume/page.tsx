"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Download,
  RefreshCw,
  Star,
  X,
  Play
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { PastelButton } from '@/components/pastel-button';
import { LoadingSpinner } from '@/components/loading-spinner';

type ResumeAnalysis = {
  ats_score: number;
  clarity_score: number;
  technical_score: number;
  impact_score: number;
  structure_score: number;
  total_score: number;
  candidate_name: string;
  detected_role: string;
  detected_skills: string[];
  detected_projects: string[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
};

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAnalysis(null);
      setAnalyzeError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setAnalyzeError(null);

    try {
      const resumeText = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string ?? "");
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
      });

      if (!resumeText || resumeText.trim().length < 50) {
        throw new Error("Could not extract text. Please try a .txt or .docx resume.");
      }

      localStorage.setItem("userResume", resumeText);

      const response = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please try again.");
      }

      const data: ResumeAnalysis = await response.json();

      if (data.candidate_name) localStorage.setItem("candidateName", data.candidate_name);
      if (data.detected_role) localStorage.setItem("detectedRole", data.detected_role);

      setAnalysis(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setAnalyzeError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setAnalyzeError(null);
    localStorage.removeItem("userResume");
    localStorage.removeItem("candidateName");
    localStorage.removeItem("detectedRole");
  };

  return (
    <div className="min-h-screen relative pb-20">
      <div className="bg-gradient-to-r from-pink-soft/60 via-lavender-soft/40 to-transparent border-b border-white/30 px-4 sm:px-6 lg:px-8 py-10 mb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm font-medium text-pink-600 uppercase tracking-wide mb-2">Resume Module</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">AI Resume Analyzer</h1>
            <p className="text-gray-500 mt-2 max-w-xl">
              Upload your resume and get instant AI-powered feedback on ATS compatibility and impact.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-400" />
                Upload Resume
              </h2>

              <AnimatePresence mode="wait">
                {!file ? (
                  <div
                    key="dropzone"
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDragActive
                        ? 'border-pink-400 bg-pink-soft/20'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-soft/10'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-soft to-lavender-soft flex items-center justify-center">
                      <Upload className="w-8 h-8 text-pink-500" />
                    </div>
                    <p className="text-gray-700 font-medium mb-2">
                      {isDragActive ? 'Drop your file here' : 'Drag and drop your resume'}
                    </p>
                    <p className="text-gray-400 text-sm">or click to browse</p>
                    <p className="text-gray-400 text-xs mt-4">Supported: PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                ) : (
                  <div key="file-info" className="relative rounded-2xl p-6 bg-gradient-to-br from-pink-soft/30 to-lavender-soft/30">
                    <button
                      onClick={handleReset}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shadow-soft">
                        <FileText className="w-7 h-7 text-pink-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 truncate max-w-[200px]">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    {!analyzing && !analysis && (
                      <PastelButton
                        className="w-full mt-6"
                        onClick={handleAnalyze}
                        icon={<Star className="w-4 h-4" />}
                      >
                        Analyze with AI
                      </PastelButton>
                    )}
                    {analyzeError && (
                      <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200">
                        <p className="text-sm text-red-600">{analyzeError}</p>
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>

              {analyzing && (
                <motion.div className="mt-6 text-center py-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <LoadingSpinner size="lg" />
                  <p className="text-gray-600 mt-4">Analyzing your resume...</p>
                  <p className="text-sm text-gray-400">This may take a few seconds</p>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-card p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                Analysis Results
              </h2>

              {!analysis ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>Upload and analyze your resume to see results</p>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-400/10 to-teal-400/10 border border-emerald-400/30 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-emerald-800 uppercase">Ready for Interview Stage</p>
                      <p className="text-xs text-gray-600 mt-0.5">AI analyzed your profile as: {analysis.detected_role}</p>
                    </div>
                    <Link href="/interview">
                      <PastelButton variant="primary" className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white" icon={<Play className="w-3.5 h-3.5" />}>
                        Launch Room
                      </PastelButton>
                    </Link>
                  </div>

                  <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-pink-soft via-lavender-soft to-blue-soft">
                    <p className="text-sm text-gray-600 mb-1">Overall Resume Score</p>
                    <p className="text-xs text-gray-500 mb-2">{analysis.candidate_name}</p>
                    <motion.p
                      className="text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                    >
                      {analysis.total_score}
                    </motion.p>
                    <p className="text-gray-500 text-sm mt-1">out of 100</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'ATS Score', score: analysis.ats_score, color: 'from-pink-400 to-rose-400' },
                      { label: 'Clarity', score: analysis.clarity_score, color: 'from-blue-400 to-cyan-400' },
                      { label: 'Technical', score: analysis.technical_score, color: 'from-purple-400 to-violet-400' },
                      { label: 'Impact', score: analysis.impact_score, color: 'from-emerald-400 to-teal-400' },
                      { label: 'Structure', score: analysis.structure_score, color: 'from-orange-400 to-amber-400' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className={`p-3 rounded-xl glass ${index === 4 ? 'col-span-2' : ''}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.label}</span>
                          <span className="font-medium text-gray-700">{item.score}</span>
                        </div>
                        <div className="progress-bar h-1.5">
                          <motion.div
                            className={`progress-fill bg-gradient-to-r ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.score}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {analysis.detected_skills?.length > 0 && (
                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/50">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4 text-blue-500" />
                        Detected Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.detected_skills.map((skill, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-mint/20 border border-mint/30">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {/* ============ FIX: ADD SAFETY CHECK ============ */}
                      {analysis.strengths?.map((strength, index) => (
                        <motion.li key={index} className="text-sm text-gray-700 flex items-start gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
                          {strength}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-orange-100/50 border border-orange-200/50">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Areas to Improve
                    </h4>
                    <ul className="space-y-2">
                      {/* ============ FIX: ADD SAFETY CHECK ============ */}
                      {analysis.weaknesses?.map((weakness, index) => (
                        <motion.li key={index} className="text-sm text-gray-700 flex items-start gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                          {weakness}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-lavender-soft/30 border border-lavender-soft/50">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-purple-500" />
                      AI Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {/* ============ FIX: ADD SAFETY CHECK ============ */}
                      {analysis.improvements?.map((improvement, index) => (
                        <motion.li key={index} className="text-sm text-gray-700 flex items-start gap-2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                          {improvement}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <PastelButton variant="outline" className="flex-1" icon={<RefreshCw className="w-4 h-4" />} onClick={handleReset}>
                      Analyze Again
                    </PastelButton>
                    <PastelButton className="flex-1" icon={<Download className="w-4 h-4" />}>
                      Download Report
                    </PastelButton>
                  </div>

                </motion.div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}