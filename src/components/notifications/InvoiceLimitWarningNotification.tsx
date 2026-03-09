"use client";

import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

interface InvoiceLimitWarningNotificationProps {
  isVisible: boolean;
  invoicesRemaining: number;
  onClose: () => void;
  onUpgrade: () => void;
}

const InvoiceLimitWarningNotification = ({
  isVisible,
  invoicesRemaining,
  onClose,
  onUpgrade
}: InvoiceLimitWarningNotificationProps) => {
  // Auto-hide after 10 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div 
        className="bg-white rounded-2xl shadow-lg border border-[#E4E7EC] p-6 relative"
        style={{ width: '359px', minHeight: '147px' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#667085] hover:text-[#344054] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          {/* Warning icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center">
            <AlertTriangle size={16} className="text-[#F59E0B]" />
          </div>

          {/* Text content */}
          <div className="flex-1 pr-6">
            <h3 className="text-[18px] font-semibold text-[#101828] mb-2">
              {invoicesRemaining} Invoice{invoicesRemaining === 1 ? '' : 's'} Left
            </h3>
            <p className="text-[14px] text-[#667085] leading-5 mb-4">
              Upgrade anytime to keep sending invoices without limits.
            </p>

            {/* Upgrade button */}
            <button
              onClick={onUpgrade}
              className="w-full bg-[#2F80ED] text-white text-[14px] font-medium py-2.5 px-4 rounded-lg hover:bg-[#1E6FCC] transition-colors"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLimitWarningNotification;