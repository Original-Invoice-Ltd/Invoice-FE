"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle, AlertCircle } from "lucide-react";

interface InvoiceLimitNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  type: "warning" | "blocked";
  invoicesRemaining?: number;
  onUpgrade: () => void;
}

const InvoiceLimitNotification = ({ 
  isVisible, 
  onClose, 
  type, 
  invoicesRemaining = 0,
  onUpgrade 
}: InvoiceLimitNotificationProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Auto-hide after 10 seconds for warning, 15 seconds for blocked
      const timer = setTimeout(() => {
        handleClose();
      }, type === "blocked" ? 15000 : 10000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, type]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const getNotificationContent = () => {
    if (type === "blocked") {
      return {
        title: "0 Invoices Left",
        message: "Upgrade to the Paid Plan to keep sending invoices, track payments, and unlock more business features.",
        icon: <AlertCircle size={16} className="text-[#EF4444]" />,
        iconBg: "bg-[#FEE2E2]"
      };
    } else {
      return {
        title: `${invoicesRemaining} Invoice${invoicesRemaining === 1 ? '' : 's'} Left`,
        message: "Upgrade anytime to keep sending invoices without limits.",
        icon: <AlertTriangle size={16} className="text-[#F59E0B]" />,
        iconBg: "bg-[#FEF3C7]"
      };
    }
  };

  const content = getNotificationContent();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className={`
          bg-white rounded-2xl shadow-lg border border-[#E4E7EC] p-6 relative
          transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        `}
        style={{ width: '359px', minHeight: '147px' }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#667085] hover:text-[#344054] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full ${content.iconBg} flex items-center justify-center`}>
            {content.icon}
          </div>

          {/* Text content */}
          <div className="flex-1 pr-6">
            <h3 className="text-[18px] font-semibold text-[#101828] mb-2">
              {content.title}
            </h3>
            <p className="text-[14px] text-[#667085] leading-5 mb-4">
              {content.message}
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

export default InvoiceLimitNotification;