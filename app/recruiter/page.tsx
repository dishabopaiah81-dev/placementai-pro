"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  Loader2
} from 'lucide-react';
import { PastelButton } from '@/components/pastel-button';
import { FloatingCirclesMini } from '@/components/floating-circles';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const aiResponses: { [key: string]: string } = {
  'resume': `I'd be happy to help with your resume! Here are my top tips:

1. **Tailor for ATS**: Include keywords from job descriptions
2. **Quantify achievements**: Use numbers (e.g., "Increased sales by 30%")
3. **Keep it concise**: Limit to 1 page for early career
4. **Use action verbs**: Start bullets with "Developed", "Led", "Created"

Would you like me to review a specific section of your resume?`,
  'interview': `Great question! Interview preparation is crucial. Here's my advice:

**Before the interview:**
- Research the company thoroughly
- Practice common questions (I can help with this!)
- Prepare STAR examples for behavioral questions

**During the interview:**
- Listen carefully before answering
- Structure your answers clearly
- Ask thoughtful questions

Want to practice a mock interview question?`,
  'skills': `Let's talk about skill development! For your target role, I recommend:

**Technical Skills:**
- Core programming language proficiency
- Version control (Git)
- Database knowledge

**Soft Skills:**
- Communication
- Problem-solving
- Teamwork

Would you like a detailed learning roadmap for any specific skill?`,
  'career': `Career planning is exciting! Here's my guidance:

**Short-term (0-6 months):**
- Build your portfolio
- Get certifications
- Practice coding challenges

**Medium-term (6-12 months):**
- Network actively
- Apply for internships/jobs
- Gain real project experience

**Long-term (1-3 years):**
- Specialize in an area
- Take leadership roles
- Mentor others

What specific career path are you interested in?`,
  'default': `I'm Priya, your AI Placement Assistant! I can help you with:

- **Resume tips** - ATS optimization, formatting
- **Interview prep** - Mock questions, tips
- **Skill development** - Learning paths, resources
- **Career guidance** - Planning, goal setting

What would you like to discuss today?`
};

const quickPrompts = [
  { label: 'Resume tips', value: 'resume' },
  { label: 'Interview prep', value: 'interview' },
  { label: 'Skill development', value: 'skills' },
  { label: 'Career guidance', value: 'career' },
];

export default function RecruiterChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Priya, your AI Placement Assistant. I'm here to help you prepare for placements. You can ask me about resume tips, interview preparation, skill development, or career guidance. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerInput = input.toLowerCase();
    let response = aiResponses.default;

    if (lowerInput.includes('resume')) response = aiResponses.resume;
    else if (lowerInput.includes('interview')) response = aiResponses.interview;
    else if (lowerInput.includes('skill')) response = aiResponses.skills;
    else if (lowerInput.includes('career')) response = aiResponses.career;

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setLoading(false);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    handleSend();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-lavender-soft/20 to-transparent">
      <div className="border-b border-white/30 px-4 sm:px-6 lg:px-8 py-5 flex items-center gap-4">
        <img
          src="https://images.pexels.com/photos/7749086/pexels-photo-7749086.jpeg?auto=compress&cs=tinysrgb&w=150"
          alt="Priya"
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
        />
        <div>
          <h1 className="text-lg font-bold text-gray-800">Chat with Priya</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Recruiter · Online
          </p>
        </div>
        <Link href="/interview" className="ml-auto hidden sm:block">
          <PastelButton size="sm" variant="outline">Start Mock Interview</PastelButton>
        </Link>
      </div>

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col min-h-0">
        <motion.div
          className="flex-1 glass-card rounded-2xl overflow-hidden flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message.role === 'assistant' && (
                  <img
                    src="https://images.pexels.com/photos/7749086/pexels-photo-7749086.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt="Priya"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl p-4',
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                      : 'bg-white shadow-soft'
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className={cn(
                    'text-xs mt-2',
                    message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <img
                  src="https://images.pexels.com/photos/7749086/pexels-photo-7749086.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Priya"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="bg-white shadow-soft rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-sm text-gray-500">Priya is typing...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-6 pb-4">
              <p className="text-xs text-gray-400 mb-2">Quick start:</p>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt.value}
                    onClick={() => handleQuickPrompt(prompt.label)}
                    className="px-3 py-1.5 rounded-full text-sm bg-pink-soft/50 text-gray-600 hover:bg-pink-soft transition"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 input-pastel"
                disabled={loading}
              />
              <PastelButton
                onClick={handleSend}
                disabled={!input.trim() || loading}
                icon={<Send className="w-4 h-4" />}
              >
                Send
              </PastelButton>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
