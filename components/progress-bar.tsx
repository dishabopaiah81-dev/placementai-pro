"use client";

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  label?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color,
  showLabel = true,
  size = 'md',
  animated = true,
  label,
}: ProgressBarProps) {
  const percentage = (value / max) * 100;
  const defaultColor = `bg-gradient-to-r ${
    percentage >= 75 ? 'from-mint to-teal-400' :
    percentage >= 50 ? 'from-blue-soft to-cyan-400' :
    percentage >= 25 ? 'from-orange-200 to-orange-400' :
    'from-red-200 to-red-400'
  }`;

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showLabel && (
            <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full rounded-full bg-gray-100 overflow-hidden', heights[size])}>
        <motion.div
          className={cn('h-full rounded-full', color || defaultColor)}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 10,
  color,
  showValue = true,
  label,
}: {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showValue?: boolean;
  label?: string;
}) {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const defaultGradient = `
    M${strokeWidth/2},${size/2}
    a${radius},${radius} 0 1,0 ${radius*2},0
    a${radius},${radius} 0 1,0 -${radius*2},0
  `;

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color || 'url(#ringGradient)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD1DC" />
            <stop offset="50%" stopColor="#E8DFF5" />
            <stop offset="100%" stopColor="#B5EAD7" />
          </linearGradient>
        </defs>
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(value)}
          </motion.span>
          {label && <span className="text-xs text-gray-400">{label}</span>}
        </div>
      )}
    </div>
  );
}

export function StepProgress({
  steps,
  currentStep,
}: {
  steps: { label: string; completed?: boolean }[];
  currentStep: number;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      {steps.map((step, index) => (
        <div key={index} className="flex-1 flex items-center">
          <div className="flex items-center gap-2 flex-1">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index < currentStep || step.completed
                  ? 'bg-gradient-to-r from-mint to-teal-400 text-white'
                  : index === currentStep
                    ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {index < currentStep || step.completed ? '✓' : index + 1}
            </motion.div>
            <span className={`text-sm ${
              index <= currentStep ? 'text-gray-700' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-gray-100 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-400 to-purple-400"
                initial={{ width: 0 }}
                animate={{ width: index < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
