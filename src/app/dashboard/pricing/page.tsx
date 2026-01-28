"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { initializeTransactionWithPlan, getCurrentSubscription } from "@/lib/subscription";

interface CurrentSubscription {
  plan: string;
  planDisplayName: string;
  status: string;
  invoiceLimit: number;
  invoicesUsed: number;
}

const DashboardPricingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  // Load current subscription on mount
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const subscription = await getCurrentSubscription();
        setCurrentSubscription(subscription);
      } catch (error) {
        console.error("Error loading subscription:", error);
      } finally {
        setLoadingSubscription(false);
      }
    };

    loadSubscription();
  }, []);

  // Handle subscription for paid plans
  const handleSubscribe = async (plan: "ESSENTIALS" | "PREMIUM") => {
    try {
      setIsLoading(plan);
      
      // Initialize transaction with plan
      const result = await initializeTransactionWithPlan(
        plan,
        ["card", "bank_transfer"],
        `${window.location.origin}/dashboard/subscription/success`
      );

      if (result.success && result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      } else {
        console.error("Failed to initialize subscription:", result.message);
        alert("Failed to start subscription process. Please try again.");
      }
    } catch (error: any) {
      console.error("Error starting subscription:", error);
      
      if (error.response?.status === 401) {
        const returnUrl = encodeURIComponent(`/dashboard/pricing?plan=${plan}`);
        router.push(`/signIn?returnUrl=${returnUrl}`);
      } else {
        alert("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(null);
    }
  };

  const isCurrentPlan = (plan: string) => {
    return currentSubscription?.plan === plan;
  };

  const getButtonText = (plan: string) => {
    if (isCurrentPlan(plan)) {
      return "Current Plan";
    }
    if (isLoading === plan) {
      return "Processing...";
    }
    return plan === "ESSENTIALS" ? "Upgrade to Essentials" : "Upgrade to Premium";
  };

  if (loadingSubscription) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED] mx-auto mb-4"></div>
          <p className="text-[#667085]">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard/overview" className="p-2 text-[#2F80ED] hover:bg-[#EFF8FF] rounded-lg transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-[24px] font-semibold text-[#101828]">Subscription Plans</h1>
          <p className="text-[#667085]">Choose the plan that fits your business needs</p>
        </div>
      </div>

      {/* Current Plan Banner */}
      {currentSubscription && currentSubscription.plan !== "FREE" && (
        <div className="mb-8 bg-white rounded-lg border border-[#E4E7EC] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-[#101828] mb-1">
                Current Plan: {currentSubscription.planDisplayName}
              </h3>
              <p className="text-[#667085]">
                {currentSubscription.invoiceLimit === -1 
                  ? "Unlimited invoices" 
                  : `${currentSubscription.invoicesUsed}/${currentSubscription.invoiceLimit} invoices used this month`
                }
              </p>
            </div>
            <div className="px-3 py-1 bg-[#ECFDF5] text-[#10B981] text-sm font-medium rounded-full">
              Active
            </div>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg border border-[#E4E7EC] p-6 relative">
            {isCurrentPlan("FREE") && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#2F80ED] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-[24px] font-semibold text-[#101828] mb-2">Free</h3>
              <div className="text-[36px] font-bold text-[#101828] mb-1">₦0</div>
              <p className="text-[#667085]">Perfect for getting started</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">3 invoices per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Basic invoice templates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Email & WhatsApp sharing</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Payment tracking</span>
              </li>
            </ul>

            <button
              disabled={isCurrentPlan("FREE")}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isCurrentPlan("FREE")
                  ? "bg-[#F9FAFB] text-[#667085] border border-[#E4E7EC] cursor-not-allowed"
                  : "bg-[#F9FAFB] text-[#344054] border border-[#E4E7EC] hover:bg-[#F2F4F7]"
              }`}
            >
              {isCurrentPlan("FREE") ? "Current Plan" : "Downgrade to Free"}
            </button>
          </div>

          {/* Essentials Plan */}
          <div className="bg-white rounded-lg border border-[#E4E7EC] p-6 relative">
            {isCurrentPlan("ESSENTIALS") && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#2F80ED] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-[24px] font-semibold text-[#101828] mb-2">Essentials</h3>
              <div className="text-[36px] font-bold text-[#101828] mb-1">₦24,000</div>
              <p className="text-[#667085]">per year</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">10 invoices per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Custom logo upload</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Advanced templates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Tax compliance tools</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe("ESSENTIALS")}
              disabled={isCurrentPlan("ESSENTIALS") || isLoading === "ESSENTIALS"}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isCurrentPlan("ESSENTIALS")
                  ? "bg-[#F9FAFB] text-[#667085] border border-[#E4E7EC] cursor-not-allowed"
                  : "bg-[#2F80ED] text-white hover:bg-[#1E6FCC] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {getButtonText("ESSENTIALS")}
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-lg border border-[#E4E7EC] p-6 relative">
            {isCurrentPlan("PREMIUM") && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#2F80ED] text-white px-3 py-1 rounded-full text-sm font-medium">
                  Current Plan
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-[24px] font-semibold text-[#101828] mb-2">Premium</h3>
              <div className="text-[36px] font-bold text-[#101828] mb-1">₦120,000</div>
              <p className="text-[#667085]">per year</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Unlimited invoices</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Multiple custom logos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Premium templates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">24/7 priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Advanced analytics</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">Multiple company profiles</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe("PREMIUM")}
              disabled={isCurrentPlan("PREMIUM") || isLoading === "PREMIUM"}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isCurrentPlan("PREMIUM")
                  ? "bg-[#F9FAFB] text-[#667085] border border-[#E4E7EC] cursor-not-allowed"
                  : "bg-[#2F80ED] text-white hover:bg-[#1E6FCC] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {getButtonText("PREMIUM")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPricingPage;