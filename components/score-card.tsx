"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  icon?: React.ReactNode;
  color?: 'pink' | 'blue' | 'lavender' | 'mint' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  description?: string;
  onClick?: () => void;
}

const colorClasses = {
  pink: {
    bg: 'bg-pink-soft/30',
    border: 'border-pink-soft/50',
    text: 'text-pink-500',
    gradient: 'from-pink-400 to-rose-400',
  },
  blue: {
    bg: 'bg-blue-soft/30',
    border: 'border-blue-soft/50',
    text: 'text-blue-500',
    gradient: 'from-blue-400 to-cyan-400',
  },
  lavender: {
    bg: 'bg-lavender-soft/30',
    border: 'border-lavender-soft/50',
    text: 'text-purple-500',
    gradient: 'from-purple-400 to-violet-400',
  },
  mint: {
    bg: 'bg-mint/30',
    border: 'border-mint/50',
    text: 'text-emerald-500',
    gradient: 'from-emerald-400 to-teal-400',
  },
  orange: {
    bg: 'bg-orange-100',
    border: 'border-orange-200',
    text: 'text-orange-500',
    gradient: 'from-orange-400 to-amber-400',
  },
};

const sizeClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function ScoreCard({
  title,
  score,
  maxScore = 100,
  icon,
  color = 'pink',
  size = 'md',
  showAnimation = true,
  description,
  onClick,
}: ScoreCardProps) {
  const colors = colorClasses[color];
  const percentage = (score / maxScore) * 100;

  return (
    <motion.div
      className={cn(
        'relative glass-card overflow-hidden cursor-pointer',
        sizeClasses[size],
        colors.border
      )}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      initial={showAnimation ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-40 -mr-8 -mt-8 bg-gradient-to-br gradient-primary" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-2">
          <div className={cn('p-2 rounded-lg', colors.bg)}>
            {icon}
          </div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            {description && (
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
          </div>
        </div>

        <div className="text-right">
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <svg className="w-20 h-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-gray-100"
              />
              <motion.circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={226}
                strokeDashoffset={226 - (226 * percentage) / 100}
                className={cn`stroke-${color}-400`}
                initial={{ strokeDashoffset: 226 }}
                animate={{ strokeDashoffset: 226 - (226 * percentage) / 100 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={colors.text} stopColor="currentColor" />
                  <stop offset="100%" className={colors.text} stopColor="currentColor" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('text-2xl font-bold', colors.text)}>
                {Math.round(score)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <div className="progress-bar">
          <motion.div
            className={cn('progress-fill bg-gradient-to-r', colors.gradient)}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">
          {score} / {maxScore}
        </p>
      </div>
    </motion.div>
  );
}

export function LargeScoreCard({
  title,
  score,
  subtitle,
  breakdown,
}: {
  title: string;
  score: number;
  subtitle?: string;
  breakdown?: { label: string; score: number; color: string }[];
}) {
  return (
    <motion.div
      className="glass-card p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mb-6">{subtitle}</p>}

      <div className="relative inline-flex items-center justify-center mb-8">
        <svg className="w-48 h-48 -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-100"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ strokeDashoffset: 553 }}
            animate={{ strokeDashoffset: 553 - (553 * score) / 100 }}
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
            className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
          >
            {Math.round(score)}
          </motion.span>
          <span className="text-gray-400 text-sm mt-1">out of 100</span>
        </motion.div>
      </div>

      {breakdown && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {breakdown.map((item, index) => (
            <motion.div
              key={item.label}
              className="glass p-4 rounded-xl text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <p className="text-xs text-gray-400">{item.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${item.score}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700">{item.score}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
