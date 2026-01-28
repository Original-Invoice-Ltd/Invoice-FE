"use client";

import { useState, useEffect } from "react";
import { AlertCircle, X, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentFailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: "ESSENTIALS" | "PREMIUM";
  errorMessage?: string;
  onRetry: () => void;
}

const PaymentFailureModal = ({ 
  isOpen, 
  onClose, 
  plan, 
  errorMessage = "Payment could not be processed",
  onRetry 
}: PaymentFailureModalProps) => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleRetry = () => {
    handleClose();
    onRetry();
  };

  const planDetails = {
    ESSENTIALS: {
      name: "Essentials",
      price: "₦2,000"
    },
    PREMIUM: {
      name: "Premium",
      price: "₦5,000"
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`
          absolute inset-0 bg-black transition-opacity duration-300
          ${isAnimating ? 'opacity-50' : 'opacity-0'}
        `}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className={`
          relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center
          transform transition-all duration-300 ease-out
          ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#101828] mb-2">
          Payment Failed
        </h2>

        {/* Message */}
        <p className="text-[#667085] mb-6">
          {errorMessage}. Please try again or contact support if the problem persists.
        </p>

        {/* Plan Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#667085]">Plan:</span>
            <span className="font-semibold text-[#101828]">{planDetails[plan].name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#667085]">Amount:</span>
            <span className="font-semibold text-[#101828]">{planDetails[plan].price}/month</span>
          </div>
        </div>

        {/* Common Issues */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-semibold text-[#101828] mb-2">Common Issues:</h4>
          <ul className="text-sm text-[#667085] space-y-1">
            <li>• Insufficient funds in your account</li>
            <li>• Card expired or blocked</li>
            <li>• Network connectivity issues</li>
            <li>• Incorrect card details</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          <button
            onClick={() => router.push("/dashboard/payment-method?plan=" + plan)}
            className="w-full px-6 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Change Payment Method
          </button>
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 text-[#667085] hover:text-[#344054] transition-colors font-medium"
          >
            Cancel
          </button>
        </div>

        {/* Support Link */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-[#667085]">
            Need help? {" "}
            <a 
              href="mailto:support@originalinvoice.com" 
              className="text-[#2F80ED] hover:text-[#2563EB] font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailureModal;