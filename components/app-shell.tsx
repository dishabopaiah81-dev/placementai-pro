"use client";

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { isAppRoute } from '@/lib/routes';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showAppShell = isAppRoute(pathname);

  if (!showAppShell) {
    return <>{children}</>;
  }

  return (
    <div className="lg:pl-64">
      <AppSidebar />
      {children}
    </div>
  );
}
