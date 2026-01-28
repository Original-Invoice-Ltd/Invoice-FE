"use client";

import { useState } from "react";
import { ArrowLeft, CreditCard, Building2, Check } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { initializeCardSubscription, initializeTransactionWithPlan } from "@/lib/subscription";

const PaymentMethodPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") as "ESSENTIALS" | "PREMIUM" || "ESSENTIALS";
  
  const [selectedMethod, setSelectedMethod] = useState<"card" | "transfer" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const planDetails = {
    ESSENTIALS: {
      name: "Essentials",
      price: "₦2,000",
      features: ["10 invoices per month", "Basic templates", "Email support"]
    },
    PREMIUM: {
      name: "Premium", 
      price: "₦5,000",
      features: ["Unlimited invoices", "Premium templates", "Priority support", "Advanced analytics"]
    }
  };

  const handlePaymentMethodSelect = (method: "card" | "transfer") => {
    setSelectedMethod(method);
    setError(null);
  };

  const handleProceedToPayment = async () => {
    if (!selectedMethod) {
      setError("Please select a payment method");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      let result;
      
      if (selectedMethod === "card") {
        // Initialize card-based recurring subscription
        result = await initializeCardSubscription(plan);
      } else {
        // Initialize transaction with bank transfer option
        result = await initializeTransactionWithPlan(
          plan, 
          ["bank_transfer", "ussd"], 
          `${window.location.origin}/dashboard/subscription/success`
        );
      }

      if (result.success && result.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = result.authorizationUrl;
      } else {
        setError(result.message || "Failed to initialize payment");
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      setError("An error occurred while initializing payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/pricing" 
            className="inline-flex items-center gap-2 text-[#2F80ED] hover:text-[#2563EB] mb-4"
          >
            <ArrowLeft size={20} />
            Back to Pricing
          </Link>
          <h1 className="text-2xl font-semibold text-[#101828] mb-2">
            Choose Payment Method
          </h1>
          <p className="text-[#667085]">
            Select how you'd like to pay for your {planDetails[plan].name} subscription
          </p>
        </div>

        {/* Plan Summary */}
        <div className="bg-white rounded-lg border border-[#E4E7EC] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#101828]">
                {planDetails[plan].name} Plan
              </h3>
              <p className="text-2xl font-bold text-[#2F80ED]">
                {planDetails[plan].price}
                <span className="text-sm font-normal text-[#667085]">/month</span>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {planDetails[plan].features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span className="text-sm text-[#667085]">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-[#101828]">Payment Methods</h3>
          
          {/* Card Payment */}
          <div
            onClick={() => handlePaymentMethodSelect("card")}
            className={`
              bg-white rounded-lg border-2 p-6 cursor-pointer transition-all
              ${selectedMethod === "card" 
                ? "border-[#2F80ED] bg-blue-50" 
                : "border-[#E4E7EC] hover:border-[#D0D5DD]"
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${selectedMethod === "card" ? "bg-[#2F80ED] text-white" : "bg-gray-100 text-gray-600"}
              `}>
                <CreditCard size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-[#101828] mb-2">
                  Card Payment (Recommended)
                </h4>
                <p className="text-[#667085] mb-3">
                  Pay with your debit or credit card. Automatic monthly billing for hassle-free subscription management.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                    Automatic Renewal
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    Instant Activation
                  </span>
                </div>
              </div>
              {selectedMethod === "card" && (
                <div className="w-6 h-6 bg-[#2F80ED] rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Bank Transfer */}
          <div
            onClick={() => handlePaymentMethodSelect("transfer")}
            className={`
              bg-white rounded-lg border-2 p-6 cursor-pointer transition-all
              ${selectedMethod === "transfer" 
                ? "border-[#2F80ED] bg-blue-50" 
                : "border-[#E4E7EC] hover:border-[#D0D5DD]"
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                w-12 h-12 rounded-lg flex items-center justify-center
                ${selectedMethod === "transfer" ? "bg-[#2F80ED] text-white" : "bg-gray-100 text-gray-600"}
              `}>
                <Building2 size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-[#101828] mb-2">
                  Bank Transfer / USSD
                </h4>
                <p className="text-[#667085] mb-3">
                  Pay directly from your bank account using bank transfer or USSD code. Manual renewal required each month.
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                    Manual Renewal
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    Bank Account Required
                  </span>
                </div>
              </div>
              {selectedMethod === "transfer" && (
                <div className="w-6 h-6 bg-[#2F80ED] rounded-full flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/dashboard/pricing"
            className="flex-1 px-6 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
          >
            Cancel
          </Link>
          <button
            onClick={handleProceedToPayment}
            disabled={!selectedMethod || isProcessing}
            className={`
              flex-1 px-6 py-3 rounded-lg font-medium transition-colors
              ${selectedMethod && !isProcessing
                ? "bg-[#2F80ED] text-white hover:bg-[#2563EB]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-[#667085] text-center">
            🔒 Your payment information is secure and encrypted. We use Paystack for secure payment processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;