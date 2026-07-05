"use client";

import { motion } from 'framer-motion';

const circles = [
  { size: 300, top: '10%', left: '5%', color: 'bg-pink-soft', delay: 0, duration: 8 },
  { size: 250, top: '60%', left: '10%', color: 'bg-blue-soft', delay: 2, duration: 10 },
  { size: 200, top: '20%', right: '15%', color: 'bg-lavender-soft', delay: 1, duration: 9 },
  { size: 280, bottom: '10%', right: '20%', color: 'bg-mint', delay: 3, duration: 7 },
  { size: 180, top: '40%', left: '40%', color: 'bg-pink-soft/60', delay: 4, duration: 11 },
  { size: 150, bottom: '30%', left: '30%', color: 'bg-blue-soft/50', delay: 2.5, duration: 12 },
];

export function FloatingCircles() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {circles.map((circle, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${circle.color} opacity-30 blur-3xl`}
          style={{
            width: circle.size,
            height: circle.size,
            top: circle.top,
            left: circle.left,
            right: circle.right,
            bottom: circle.bottom,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function FloatingCirclesMini() {
  const miniCircles = [
    { size: 60, top: '20%', right: '10%', color: 'bg-pink-soft' },
    { size: 40, top: '50%', right: '25%', color: 'bg-blue-soft' },
    { size: 50, top: '70%', right: '5%', color: 'bg-lavender-soft' },
    { size: 30, top: '80%', right: '15%', color: 'bg-mint' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {miniCircles.map((circle, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${circle.color} opacity-40 blur-xl`}
          style={{
            width: circle.size,
            height: circle.size,
            top: circle.top,
            right: circle.right,
          }}
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 6 + index,
            delay: index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
