"use client";

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { isAppRoute, isPublicRoute } from '@/lib/routes';

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isLogin = pathname === '/login';
  const isApp = isAppRoute(pathname);

  return (
    <main
      className={cn(
        'min-h-screen',
        !isLanding && 'pt-16',
        isApp && 'pb-8',
        isLogin && 'flex items-center'
      )}
    >
      {children}
    </main>
  );
}
