"use client";

import { useInvoiceLimitNotification } from "@/hooks/useInvoiceLimitNotification";
import InvoiceLimitWarningNotification from "./InvoiceLimitWarningNotification";
import InvoiceLimitBlockedNotification from "./InvoiceLimitBlockedNotification";

interface InvoiceLimitNotificationProviderProps {
  children: React.ReactNode;
}

const InvoiceLimitNotificationProvider = ({ children }: InvoiceLimitNotificationProviderProps) => {
  const {
    notification,
    hideNotification,
    handleUpgrade
  } = useInvoiceLimitNotification();

  return (
    <>
      {children}
      
      {/* Warning notification for 2 or 1 invoices left */}
      {notification.type === "warning" && (
        <InvoiceLimitWarningNotification
          isVisible={notification.isVisible}
          invoicesRemaining={notification.invoicesRemaining}
          onClose={hideNotification}
          onUpgrade={handleUpgrade}
        />
      )}

      {/* Blocked notification for 0 invoices left */}
      {notification.type === "blocked" && (
        <InvoiceLimitBlockedNotification
          isVisible={notification.isVisible}
          onClose={hideNotification}
          onUpgrade={handleUpgrade}
        />
      )}
    </>
  );
};

export default InvoiceLimitNotificationProvider;