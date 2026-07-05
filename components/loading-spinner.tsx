"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function LoadingSpinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('relative', sizes[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-pink-soft opacity-25" />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-transparent border-t-purple-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-pink-400"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

export function LoadingOverlay({ message }: { message?: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="glass-card p-8 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </motion.div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('glass-card p-6 animate-pulse', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100" />
          <div className="w-24 h-4 rounded bg-gray-100" />
        </div>
        <div className="w-16 h-16 rounded-full bg-gray-100" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="w-full h-2 rounded bg-gray-100" />
        <div className="w-3/4 h-2 rounded bg-gray-100" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full border-4 border-pink-soft border-t-pink-400" />
        </motion.div>
        <motion.p
          className="text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  );
}
