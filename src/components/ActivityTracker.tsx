"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeActivityTracker, cleanupActivityTracker } from '@/lib/activityTracker';

export default function ActivityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Only initialize activity tracker on protected routes (dashboard)
    if (pathname.startsWith('/dashboard')) {
      const tracker = initializeActivityTracker({
        sessionTimeout: 30 * 60 * 1000, // 30 minutes
        extendedTimeout: 60 * 60 * 1000, // 1 hour
        refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
        checkInterval: 60 * 1000, // Check every minute
      });

      return () => {
        cleanupActivityTracker();
      };
    }
  }, [pathname]);

  return null; // This component doesn't render anything
}