"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { verifySubscription } from "@/lib/subscription";

const SubscriptionSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [plan, setPlan] = useState<"ESSENTIALS" | "PREMIUM">("ESSENTIALS");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setErrorMessage("No payment reference found");
      return;
    }

    const verifyPayment = async () => {
      try {
        const result = await verifySubscription(reference);
        
        if (result.success) {
          setStatus("success");
          setPlan(result.plan as "ESSENTIALS" | "PREMIUM" || "ESSENTIALS");
          setMessage(result.message || "Subscription activated successfully!");
          
          // Auto-redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard/overview");
          }, 3000);
        } else {
          setStatus("failed");
          setErrorMessage(result.message || "Payment verification failed");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setStatus("failed");
        setErrorMessage("An error occurred while verifying your payment");
      }
    };

    verifyPayment();
  }, [reference, router]);

  const handleContinue = () => {
    router.push("/dashboard/overview");
  };

  const handleRetry = () => {
    router.push("/dashboard/pricing");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EC] p-8 max-w-md w-full mx-4 text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="w-12 h-12 text-[#2F80ED] animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-[#101828] mb-2">
            Verifying Payment
          </h2>
          <p className="text-[#667085]">
            Please wait while we confirm your subscription...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EC] p-8 max-w-md w-full mx-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-[#10B981]" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-[#101828] mb-2">
            Subscription Activated!
          </h2>
          <p className="text-[#667085] mb-6">
            Your {plan} plan has been activated successfully. You can now enjoy all the features of your subscription.
          </p>
          <p className="text-sm text-[#667085] mb-6">
            Redirecting to dashboard in 3 seconds...
          </p>
          <button
            onClick={handleContinue}
            className="w-full bg-[#2F80ED] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1E6FCC] transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm border border-[#E4E7EC] p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#FEF2F2] rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-[#EF4444]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-[#101828] mb-2">
          Payment Failed
        </h2>
        <p className="text-[#667085] mb-6">
          {errorMessage || "There was an issue processing your payment. Please try again."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleRetry}
            className="flex-1 bg-[#2F80ED] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#1E6FCC] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 border border-[#D0D5DD] text-[#344054] py-3 px-4 rounded-lg font-medium hover:bg-[#F9FAFB] transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;