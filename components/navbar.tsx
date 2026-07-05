"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import {
  Trophy,
  Menu,
  X,
  LogOut,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { SIDEBAR_ITEMS, isAppRoute, isPublicRoute } from '@/lib/routes';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (pathname === '/') return null;

  const isApp = isAppRoute(pathname);
  const isPublic = isPublicRoute(pathname);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 right-0 z-50 glass-strong border-b border-white/20 h-16',
          isApp ? 'left-0 lg:left-64' : 'left-0'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-3">
              {!isApp && (
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-lg text-gray-800">PlacementAI</span>
                </Link>
              )}
              {isApp && (
                <p className="text-sm text-gray-500 hidden sm:block">
                  Welcome, <span className="font-medium text-gray-700">{user?.name || 'Student'}</span>
                </p>
              )}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {isPublic && pathname === '/login' && (
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition"
                >
                  Back to Home
                </Link>
              )}
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/50">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-white/50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-pink-500 hover:text-pink-600"
                >
                  Sign In
                </Link>
              )}
            </div>

            {isApp && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/50"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {isApp && mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-0 top-16 z-40 md:hidden glass-strong border-b border-white/20 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="px-4 py-4 space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-all',
                    isActive ? 'bg-white shadow-soft' : 'hover:bg-white/50'
                  )}
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-gray-200/50">
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-600 hover:bg-white/50"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
}
