"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy } from 'lucide-react';
import { SIDEBAR_ITEMS } from '@/lib/routes';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 glass-strong border-r border-white/20">
      <div className="flex items-center gap-2 h-16 px-6 border-b border-white/20">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg text-gray-800">PlacementAI</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-gray-900 shadow-soft'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-900'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-pink-500' : 'text-gray-400')} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <div className="glass-card p-3 rounded-xl bg-gradient-to-br from-lavender-soft/40 to-pink-soft/40">
          <p className="text-xs font-medium text-gray-700">Need help?</p>
          <p className="text-xs text-gray-500 mt-1">Chat with Priya anytime</p>
          <Link
            href="/recruiter"
            className="inline-block mt-2 text-xs font-medium text-pink-500 hover:text-pink-600"
          >
            Open AI Recruiter →
          </Link>
        </div>
      </div>
    </aside>
  );
}
