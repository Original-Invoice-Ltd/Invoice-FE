"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { ApiClient } from "@/lib/api";

interface InvoiceLimitContextType {
  canCreateInvoice: boolean;
  invoicesRemaining: number;
  totalInvoices: number;
  isLoading: boolean;
  checkInvoiceLimit: () => Promise<void>;
  incrementInvoiceCount: () => void;
  showLimitNotification: (invoicesRemaining: number) => void;
  showBlockedNotification: () => void;
  notificationState: {
    isVisible: boolean;
    type: "warning" | "blocked";
    invoicesRemaining: number;
  };
  hideNotification: () => void;
}

const InvoiceLimitContext = createContext<InvoiceLimitContextType | undefined>(undefined);

export const useInvoiceLimit = () => {
  const context = useContext(InvoiceLimitContext);
  if (!context) {
    throw new Error("useInvoiceLimit must be used within an InvoiceLimitProvider");
  }
  return context;
};

interface InvoiceLimitProviderProps {
  children: React.ReactNode;
}

export const InvoiceLimitProvider = ({ children }: InvoiceLimitProviderProps) => {
  const [canCreateInvoice, setCanCreateInvoice] = useState(true);
  const [invoicesRemaining, setInvoicesRemaining] = useState(0);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationState, setNotificationState] = useState({
    isVisible: false,
    type: "warning" as "warning" | "blocked",
    invoicesRemaining: 0
  });

  const checkInvoiceLimit = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Get current subscription details
      const subscriptionResponse = await ApiClient.getCurrentSubscription();
      if (subscriptionResponse.status === 200) {
        const subscription = subscriptionResponse.data;
        const limit = subscription.invoiceLimit || 3; // Default to free plan limit
        const used = subscription.invoicesUsed || 0;
        
        // Handle unlimited invoices (Premium plan)
        if (limit === -1) {
          setTotalInvoices(-1);
          setInvoicesRemaining(-1);
          setCanCreateInvoice(true);
        } else {
          const remaining = Math.max(0, limit - used);
          setTotalInvoices(limit);
          setInvoicesRemaining(remaining);
          setCanCreateInvoice(remaining > 0);
        }
        
        return;
      }

      // Fallback: Check if user can create invoice using the new invoice endpoint
      const canCreateResponse = await ApiClient.canCreateInvoice();
      if (canCreateResponse.status === 200) {
        const canCreate = canCreateResponse.data.canCreate;
        setCanCreateInvoice(canCreate);
        
        // Set default values for free plan if no subscription data
        setTotalInvoices(3);
        setInvoicesRemaining(canCreate ? 3 : 0);
      }
    } catch (error) {
      console.error("Error checking invoice limit:", error);
      // Default to allowing invoice creation on error
      setCanCreateInvoice(true);
      setInvoicesRemaining(3);
      setTotalInvoices(3);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const incrementInvoiceCount = useCallback(() => {
    // Don't decrement for unlimited plans
    if (totalInvoices === -1) {
      return;
    }
    
    setInvoicesRemaining(prev => {
      const newRemaining = Math.max(0, prev - 1);
      setCanCreateInvoice(newRemaining > 0);
      return newRemaining;
    });
  }, [totalInvoices]);

  const showLimitNotification = useCallback((remaining: number) => {
    setNotificationState({
      isVisible: true,
      type: "warning",
      invoicesRemaining: remaining
    });
  }, []);

  const showBlockedNotification = useCallback(() => {
    setNotificationState({
      isVisible: true,
      type: "blocked",
      invoicesRemaining: 0
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotificationState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  // Check invoice limit on mount
  useEffect(() => {
    checkInvoiceLimit();
  }, [checkInvoiceLimit]);

  const value: InvoiceLimitContextType = {
    canCreateInvoice,
    invoicesRemaining,
    totalInvoices,
    isLoading,
    checkInvoiceLimit,
    incrementInvoiceCount,
    showLimitNotification,
    showBlockedNotification,
    notificationState,
    hideNotification
  };

  return (
    <InvoiceLimitContext.Provider value={value}>
      {children}
    </InvoiceLimitContext.Provider>
  );
};