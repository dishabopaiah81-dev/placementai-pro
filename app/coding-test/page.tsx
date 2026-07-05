"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  Lightbulb
} from 'lucide-react';
import { PastelButton } from '@/components/pastel-button';
import { FloatingCirclesMini } from '@/components/floating-circles';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-full bg-gray-100 animate-pulse rounded-xl" /> }
);

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const questions = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: '' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: '' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9'],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here

}`,
      python: `def twoSum(nums, target):
    # Your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
    },
  },
  {
    id: '2',
    title: 'Reverse String',
    difficulty: 'Easy',
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' },
    ],
    constraints: ['1 <= s.length <= 10^5'],
    starterCode: {
      javascript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    // Your code here
}`,
      python: `def reverseString(s):
    # Your code here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here
    }
}`,
      cpp: `class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your code here
    }
};`,
    },
  },
];

export default function CodingTestPage() {
  const [language, setLanguage] = useState('javascript');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState(questions[0].starterCode.javascript);
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [testResults, setTestResults] = useState<{ passed: number; total: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    setCode(questions[currentQuestion].starterCode[newLang as keyof typeof questions[0]['starterCode']] || '');
  };

  const handleReset = () => {
    setCode(questions[currentQuestion].starterCode[language as keyof typeof questions[0]['starterCode']] || '');
    setResult(null);
    setTestResults(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const passed = Math.floor(Math.random() * 5) + 1;
    const total = 5;
    setTestResults({ passed, total });
    setResult(passed >= total ? 'success' : 'error');
    setSubmitting(false);
  };

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen relative pb-8">
      <FloatingCirclesMini />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Coding Assessment
              </h1>
              <p className="text-gray-500 mt-1">
                Test your coding skills with real interview questions
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
                timeLeft < 600 ? 'bg-red-100 text-red-600' : 'glass'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="input-pastel"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Question Navigation */}
        <motion.div
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => {
                setCurrentQuestion(index);
                setCode(questions[index].starterCode[language as keyof typeof questions[0]['starterCode']] || '');
                setResult(null);
                setTestResults(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                currentQuestion === index
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                  : 'glass text-gray-600 hover:bg-white'
              }`}
            >
              Question {index + 1}
            </button>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <motion.div
            className="glass-card rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-gray-800">{question.title}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  question.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-600' :
                  question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {question.difficulty}
                </span>
              </div>
            </div>
            <div className="p-4 max-h-[500px] overflow-y-auto scrollbar-hide">
              <p className="text-gray-700 whitespace-pre-line mb-6">{question.description}</p>

              <h3 className="font-medium text-gray-800 mb-3">Examples:</h3>
              {question.examples.map((example, index) => (
                <div key={index} className="mb-4 p-3 rounded-xl bg-gray-50">
                  <p className="text-sm"><strong>Input:</strong> {example.input}</p>
                  <p className="text-sm"><strong>Output:</strong> {example.output}</p>
                  {example.explanation && (
                    <p className="text-sm text-gray-500 mt-1">{example.explanation}</p>
                  )}
                </div>
              ))}

              <h3 className="font-medium text-gray-800 mb-3">Constraints:</h3>
              <ul className="space-y-1">
                {question.constraints.map((constraint, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    {constraint}
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-3 rounded-xl bg-lavender-soft/30">
                <p className="text-sm text-gray-600 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <span>Hint: Consider using a hash map for O(n) time complexity.</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Code Editor */}
          <motion.div
            className="glass-card rounded-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-sm text-gray-500 ml-2">{language}</span>
              </div>
              <button onClick={handleReset} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
            <div className="flex-1 min-h-[300px]">
              <MonacoEditor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: true,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                }}
              />
            </div>

            {/* Results */}
            {testResults && (
              <motion.div
                className="p-4 border-t border-gray-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={`flex items-center gap-3 ${
                  result === 'success' ? 'text-emerald-600' : 'text-orange-500'
                }`}>
                  {result === 'success' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {result === 'success' ? 'All tests passed!' : 'Some tests failed'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {testResults.passed}/{testResults.total} test cases passed
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <PastelButton
                variant="outline"
                className="flex-1"
                icon={<Play className="w-4 h-4" />}
              >
                Run Tests
              </PastelButton>
              <PastelButton
                className="flex-1"
                icon={<Send className="w-4 h-4" />}
                onClick={handleSubmit}
                loading={submitting}
              >
                Submit
              </PastelButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
