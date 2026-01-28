"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface NotificationState {
  isVisible: boolean;
  type: "warning" | "blocked";
  invoicesRemaining: number;
}

export const useInvoiceLimitNotification = () => {
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: "warning",
    invoicesRemaining: 0
  });

  const showWarningNotification = useCallback((invoicesRemaining: number) => {
    setNotification({
      isVisible: true,
      type: "warning",
      invoicesRemaining
    });
  }, []);

  const showBlockedNotification = useCallback(() => {
    setNotification({
      isVisible: true,
      type: "blocked",
      invoicesRemaining: 0
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const handleUpgrade = useCallback(() => {
    hideNotification();
    router.push("/dashboard/pricing");
  }, [hideNotification, router]);

  return {
    notification,
    showWarningNotification,
    showBlockedNotification,
    hideNotification,
    handleUpgrade
  };
};