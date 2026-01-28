"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: "ESSENTIALS" | "PREMIUM";
  paymentMethod: "card" | "transfer";
}

const PaymentSuccessModal = ({ isOpen, onClose, plan, paymentMethod }: PaymentSuccessModalProps) => {
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

  const handleGoToDashboard = () => {
    handleClose();
    router.push("/dashboard");
  };

  const planDetails = {
    ESSENTIALS: {
      name: "Essentials",
      price: "₦2,000",
      invoiceLimit: "10 invoices"
    },
    PREMIUM: {
      name: "Premium",
      price: "₦5,000", 
      invoiceLimit: "Unlimited invoices"
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

        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={32} className="text-green-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#101828] mb-2">
          Payment Successful!
        </h2>

        {/* Message */}
        <p className="text-[#667085] mb-6">
          Your {planDetails[plan].name} subscription has been activated successfully. 
          You now have access to {planDetails[plan].invoiceLimit} per month.
        </p>

        {/* Plan Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#667085]">Plan:</span>
            <span className="font-semibold text-[#101828]">{planDetails[plan].name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#667085]">Amount:</span>
            <span className="font-semibold text-[#101828]">{planDetails[plan].price}/month</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#667085]">Payment Method:</span>
            <span className="font-semibold text-[#101828] capitalize">
              {paymentMethod === "card" ? "Card" : "Bank Transfer"}
            </span>
          </div>
        </div>

        {/* Renewal Notice */}
        {paymentMethod === "card" ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-700">
              ✅ Automatic renewal is enabled. Your subscription will renew automatically each month.
            </p>
          </div>
        ) : (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-orange-700">
              ⚠️ Remember to renew your subscription manually before it expires to continue enjoying premium features.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full px-6 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors font-medium"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/dashboard/invoices/create")}
            className="w-full px-6 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Create Your First Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessModal;