"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { FloatingCirclesMini } from '@/components/floating-circles';
import { PastelButton } from '@/components/pastel-button';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signInWithMagicLink } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    const { error, success } = await signInWithMagicLink(email);

    if (error) {
      setError(error.message || 'Failed to send magic link. Please try again.');
      setLoading(false);
      return;
    }

    if (success) {
      setSuccess(true);
      setEmail('');
      // Keep showing success message for 3 seconds
      setTimeout(() => {
        // User will click link in email to login
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-white via-lavender-soft/20 to-pink-soft/20">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Liquid Glass Card */}
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse" />

          {/* Main Card */}
          <div className="relative backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl p-8 shadow-2xl">
            {/* Gradient overlay */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-pink-500/5 via-transparent to-blue-500/5" />

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-flex items-center justify-center mb-6">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-white text-2xl font-bold">P</span>
                  </motion.div>
                </Link>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  PlacementAI Pro
                </h1>
                <p className="text-gray-600 text-sm">
                  Your AI-powered placement preparation platform
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!success ? (
                  <>
                    {/* Email Input */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative group/input">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-pink-500 transition" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-12 pr-4 py-3 rounded-xl backdrop-blur-sm bg-white/50 border border-white/60 focus:border-pink-400/60 focus:bg-white/70 focus:outline-none focus:ring-2 focus:ring-pink-400/20 transition placeholder-gray-400 text-gray-800"
                          disabled={loading}
                        />
                      </div>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 rounded-xl bg-red-50/80 border border-red-200/60 backdrop-blur-sm"
                      >
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-70 flex items-center justify-center gap-2 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending link...
                        </>
                      ) : (
                        <>
                          Send Magic Link
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </>
                      )}
                    </motion.button>
                  </>
                ) : (
                  /* Success State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="flex justify-center mb-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Check your email!</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      We've sent a magic link to <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mb-6">
                      Click the link in your email to log in. No password needed!
                    </p>
                    <button
                      onClick={() => {
                        setSuccess(false);
                        setEmail('');
                      }}
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Try another email
                    </button>
                  </motion.div>
                )}

                {/* Divider */}
                {!success && (
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200/60" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white/40 text-gray-500 backdrop-blur-sm">
                        First time?
                      </span>
                    </div>
                  </div>
                )}

                {/* Info Text */}
                {!success && (
                  <p className="text-xs text-gray-600 text-center">
                    We'll create your account automatically if you're new. No password needed!
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p>
            By continuing, you agree to our{' '}
            <a href="#" className="text-pink-600 hover:underline font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-pink-600 hover:underline font-medium">
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}