"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Sparkles,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { PastelButton } from '@/components/pastel-button';
import { RECRUITER_AVATAR } from '@/lib/constants';

interface ConversationMessage {
  question: string;
  answer: string;
}

export default function InterviewPage() {
  const [interviewState, setInterviewState] = useState<'setup' | 'intro' | 'active' | 'feedback'>('setup');
  const [resumeText, setResumeText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [listeningText, setListeningText] = useState('');

  const recognitionRef = useRef<any>(null);
  const femaleVoiceRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    const savedResume = localStorage.getItem("userResume");
    const savedName = localStorage.getItem("candidateName");

    if (savedResume) setResumeText(savedResume);
    if (savedName) setCandidateName(savedName);

    loadFemaleVoice();
    initializeSpeechRecognition();
  }, []);

  const loadFemaleVoice = () => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();

      const preferredVoices = [
        'Google UK English Female',
        'Microsoft Zira',
        'Samantha',
        'Victoria',
      ];

      let selectedVoice: any = null;

      for (const preferred of preferredVoices) {
        selectedVoice = voices.find((voice: SpeechSynthesisVoice) =>
          voice.name.toLowerCase().includes(preferred.toLowerCase())
        );
        if (selectedVoice) break;
      }

      if (!selectedVoice) {
        selectedVoice = voices.find((voice: SpeechSynthesisVoice) =>
          voice.name.toLowerCase().includes('female')
        );
      }

      if (!selectedVoice && voices.length > 0) {
        selectedVoice = voices[1] || voices[0];
      }

      femaleVoiceRef.current = selectedVoice;
    };

    if (speechSynthesis.getVoices().length > 0) {
      loadVoices();
    } else {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  };

  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;
  };

  const speakWithGirlVoice = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    if (femaleVoiceRef.current) {
      utterance.voice = femaleVoiceRef.current;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const startSpeechToText = () => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    isListeningRef.current = true;
    setIsListening(true);

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setListeningText('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setListeningText(interimTranscript);
      }

      if (finalTranscript) {
        setAnswer((prev) => {
          const newAnswer = prev
            ? prev + ' ' + finalTranscript
            : finalTranscript;
          return newAnswer.trim();
        });
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error);
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch (e) {
          console.log('Recognition restart');
        }
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const stopSpeechToText = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setListeningText('');

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Stop');
      }
    }
  };

  // STEP 1: Show intro and ask permission to begin
  const startInterview = () => {
    setInterviewState('intro');
    
    // Generate intro message with candidate name from resume
    const introMessage = `Hello ${candidateName || 'there'}! I'm Priya, your AI recruiter for today's interview. I've carefully reviewed your resume and I'm impressed with your background. Are you ready to begin?`;
    
    setCurrentQuestion(introMessage);
    
    setTimeout(() => {
      speakWithGirlVoice(introMessage);
    }, 500);
  };

  // STEP 2: After user says yes, generate first real question
  const confirmStartInterview = async () => {
    setInterviewState('active');
    setQuestionCount(2);
    
    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          userAnswer: "",
          questionNumber: 2,
          conversationHistory: [],
          isFirstQuestion: true,
          candidateName: candidateName,
        }),
      });

      const data = await res.json();
      setCurrentQuestion(data.nextQuestion);

      setTimeout(() => {
        speakWithGirlVoice(data.nextQuestion);
      }, 500);
    } catch (e) {
      console.error("Error generating first question:", e);
      const fallback = `${candidateName}, can you tell me about yourself and your professional background?`;
      setCurrentQuestion(fallback);

      setTimeout(() => {
        speakWithGirlVoice(fallback);
      }, 500);
    }
  };

  const replayQuestion = () => {
    if (currentQuestion) speakWithGirlVoice(currentQuestion);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    if (isListening) stopSpeechToText();

    try {
      const newHistory = [
        ...conversationHistory,
        { question: currentQuestion, answer: answer },
      ];
      setConversationHistory(newHistory);

      const nextQuestionNum = questionCount + 1;

      // If we've asked 8 questions total, end interview
      if (questionCount >= 8) {
        setInterviewState('feedback');
        localStorage.setItem("interviewResults", JSON.stringify(newHistory));
        setIsSubmitting(false);
        return;
      }

      // Request next question from API
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          userAnswer: answer,
          questionNumber: nextQuestionNum,
          conversationHistory: newHistory,
          isFirstQuestion: false,
          candidateName: candidateName,
        }),
      });

      const data = await res.json();

      setCurrentQuestion(data.nextQuestion);
      setQuestionCount(nextQuestionNum);
      setAnswer('');

      setTimeout(() => {
        speakWithGirlVoice(data.nextQuestion);
      }, 1000);
    } catch (e) {
      console.error("Error:", e);
      
      if (questionCount >= 8) {
        setInterviewState('feedback');
      } else {
        // Fallback question
        setCurrentQuestion("Thank you for that answer. Could you tell me more about that experience?");
        setQuestionCount((prev) => prev + 1);
        setAnswer('');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-lavender-soft/10 via-white to-pink-soft/10">
      <div className="border-b border-white/40 glass-strong px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Mock Interview</h1>
            <p className="text-sm text-gray-500">Live session with AI Recruiter Priya</p>
          </div>
          {interviewState === 'active' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-white/70 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold text-purple-600">
                Question {questionCount} of 8
              </span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* SETUP: Show initial button */}
        {interviewState === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <div className="glass-card p-8 rounded-3xl max-w-lg w-full text-center">
              <img
                src={RECRUITER_AVATAR}
                alt="Priya"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-1">Meet Priya</h2>
              <p className="text-sm text-gray-500 mb-6">
                Senior Technical Recruiter · AI Mock Interview
              </p>
              <PastelButton
                onClick={startInterview}
                icon={<Sparkles className="w-4 h-4" />}
                className="w-full"
              >
                Start Interview
              </PastelButton>
            </div>
          </motion.div>
        )}

        {/* INTRO: Show introduction and ask permission */}
        {interviewState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <div className="glass-card p-8 rounded-3xl max-w-2xl w-full">
              <div className="flex items-start gap-6 mb-6">
                <motion.img
                  src={RECRUITER_AVATAR}
                  alt="Priya"
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg flex-shrink-0"
                  animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: isSpeaking ? Infinity : 0,
                  }}
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">Priya - AI Recruiter</h2>
                  <p className="text-sm text-gray-500 mb-4">Senior Technical Recruiter</p>
                </div>
              </div>
              
              <div className="glass-card rounded-2xl p-6 border border-white/50 mb-6 bg-gradient-to-br from-lavender-soft/20 to-pink-soft/20">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {currentQuestion}
                </p>
              </div>

              <div className="flex gap-3">
                <PastelButton
                  variant="outline"
                  onClick={replayQuestion}
                  icon={<Volume2 className="w-4 h-4" />}
                >
                  🔊 Replay
                </PastelButton>
                <PastelButton
                  onClick={confirmStartInterview}
                  icon={<Sparkles className="w-4 h-4" />}
                  className="flex-1"
                >
                  Yes, I'm Ready!
                </PastelButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* ACTIVE INTERVIEW: Main interview screen */}
        {interviewState === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 grid lg:grid-cols-2 gap-0 min-h-0"
          >
            {/* LEFT SIDE: Question from Priya */}
            <div className="border-r border-white/30 bg-gradient-to-br from-lavender-soft/30 to-pink-soft/20 p-6 lg:p-8 flex flex-col overflow-y-auto">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  AI Recruiter
                </span>
              </div>

              <div className="flex items-start gap-4 mb-8">
                <div className="relative flex-shrink-0">
                  <motion.img
                    src={RECRUITER_AVATAR}
                    alt="Priya"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                    animate={isSpeaking ? { scale: [1, 1.05, 1] } : {}}
                    transition={{
                      duration: 0.5,
                      repeat: isSpeaking ? Infinity : 0,
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Priya</h3>
                  <p className="text-sm text-gray-500">Senior Technical Recruiter</p>
                </div>
              </div>

              <div className="flex-1 glass-card rounded-2xl p-6 border border-white/50 mb-4">
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                  {currentQuestion || "Loading question..."}
                </p>
              </div>

              <PastelButton
                variant="outline"
                className="w-full sm:w-auto"
                onClick={replayQuestion}
                icon={<Volume2 className="w-4 h-4" />}
              >
                🔊 Replay Question
              </PastelButton>
            </div>

            {/* RIGHT SIDE: Answer input */}
            <div className="p-6 lg:p-8 flex flex-col bg-white/40 overflow-y-auto">
              <h3 className="font-semibold text-gray-800 mb-4">Your Answer</h3>

              {isListening && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-3 p-3 rounded-xl bg-blue-50 border border-blue-200"
                >
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    Listening...
                  </p>
                  {listeningText && (
                    <p className="text-xs text-blue-600 mt-2 italic">
                      {listeningText}
                    </p>
                  )}
                </motion.div>
              )}

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer or click Record..."
                className="flex-1 min-h-[280px] w-full p-5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t">
                <PastelButton
                  variant="outline"
                  onClick={() =>
                    isListening ? stopSpeechToText() : startSpeechToText()
                  }
                  icon={
                    isListening ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )
                  }
                  className={isListening ? 'bg-red-50 border-red-200' : ''}
                >
                  {isListening ? '⏹️ Stop' : '🎤 Record'}
                </PastelButton>
                <PastelButton
                  onClick={handleSubmitAnswer}
                  loading={isSubmitting}
                  icon={<Send className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Processing...' : 'Submit'}
                </PastelButton>
              </div>
            </div>
          </motion.div>
        )}

        {/* FEEDBACK: Interview complete */}
        {interviewState === 'feedback' && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 p-8 text-center flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 flex items-center justify-center text-4xl shadow-lg">
                ✅
              </div>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-800 mb-2"
            >
              Interview Complete!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mb-8 max-w-md"
            >
              Thank you for your time. Your responses have been recorded.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/score">
                <PastelButton
                  className="text-lg px-8 py-3"
                  icon={<Sparkles className="w-5 h-5" />}
                >
                  📊 View Results
                </PastelButton>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}