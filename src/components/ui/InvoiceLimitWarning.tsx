"use client";

import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface InvoiceLimitWarningProps {
  invoicesRemaining: number;
  totalInvoices: number;
  onClose?: () => void;
}

export default function InvoiceLimitWarning({ 
  invoicesRemaining, 
  totalInvoices,
  onClose 
}: InvoiceLimitWarningProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (totalInvoices === -1) {
      setIsVisible(false);
      return;
    }

    const dismissedKey = `invoice-warning-dismissed-${totalInvoices}-${invoicesRemaining}`;
    const wasDismissed = sessionStorage.getItem(dismissedKey);
    
    if (wasDismissed) {
      setIsDismissed(true);
      setIsVisible(false);
      return;
    }

    let shouldShow = false;
    
    if (totalInvoices === 3) {
      shouldShow = invoicesRemaining <= 1;
    } else if (totalInvoices === 10) {
      shouldShow = invoicesRemaining <= 2;
    }

    setIsVisible(shouldShow && !isDismissed);
  }, [invoicesRemaining, totalInvoices, isDismissed]);

  const handleDismiss = () => {
    const dismissedKey = `invoice-warning-dismissed-${totalInvoices}-${invoicesRemaining}`;
    sessionStorage.setItem(dismissedKey, 'true');
    setIsDismissed(true);
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  const getWarningLevel = () => {
    if (invoicesRemaining === 0) return "critical";
    if (totalInvoices === 3 && invoicesRemaining === 1) return "warning";
    if (totalInvoices === 10 && invoicesRemaining <= 2) return "warning";
    return "info";
  };

  const warningLevel = getWarningLevel();
  const isBlocked = invoicesRemaining === 0;

  const getColors = () => {
    switch (warningLevel) {
      case "critical":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: "text-red-600",
          button: "bg-red-600 hover:bg-red-700"
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-800",
          icon: "text-yellow-600",
          button: "bg-yellow-600 hover:bg-yellow-700"
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-800",
          icon: "text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700"
        };
    }
  };

  const colors = getColors();

  const getMessage = () => {
    if (isBlocked) {
      return {
        title: "Invoice Limit Reached",
        description: `You've used all ${totalInvoices} invoices for this month. Upgrade your plan to create more invoices.`
      };
    }
    
    if (totalInvoices === 3) {
      return {
        title: "Almost at Your Invoice Limit",
        description: `You have ${invoicesRemaining} invoice${invoicesRemaining === 1 ? '' : 's'} remaining this month. Upgrade to create unlimited invoices.`
      };
    }
    
    return {
      title: "Approaching Invoice Limit",
      description: `You have ${invoicesRemaining} invoice${invoicesRemaining === 1 ? '' : 's'} remaining out of ${totalInvoices} this month. Consider upgrading for more invoices.`
    };
  };

  const message = getMessage();

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 mb-6 relative`}>
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        <X size={18} />
      </button>
      
      <div className="flex items-start gap-3 pr-8">
        <div className={`${colors.icon} flex-shrink-0 mt-0.5`}>
          <AlertTriangle size={20} />
        </div>
        
        <div className="flex-1">
          <h3 className={`${colors.text} font-semibold text-sm mb-1`}>
            {message.title}
          </h3>
          <p className={`${colors.text} text-sm mb-3`}>
            {message.description}
          </p>
          
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/pricing"
              className={`${colors.button} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors`}
            >
              {isBlocked ? "Upgrade Now" : "View Plans"}
            </Link>
            
            {!isBlocked && (
              <button
                onClick={handleDismiss}
                className={`${colors.text} text-sm font-medium hover:underline`}
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
