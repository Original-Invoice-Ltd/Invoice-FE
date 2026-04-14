"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { initializeTransactionWithPlan } from "@/lib/subscription";
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from "react-i18next";
import { useSubscription } from '@/hooks/useSubscription';
import { ApiClient } from '@/lib/api';

export interface CurrentSubscription {
  plan: string;
  planDisplayName: string;
  status: string;
  invoiceLimit: number;
  invoicesUsed: number;
}

const DashboardPricingPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const { toast, showError, hideToast } = useToast();
  const { subscription: currentSubscription, loading: loadingSubscription } = useSubscription();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    ApiClient.get("/api/admin/system-config/plans").then(res => {
      if (res.status === 200 && res.data) {
        const data = res.data as any;
        const list = Array.isArray(data) ? data : data.content ?? data.data ?? [];
        setPlans(list);
      }
    });
  }, []);

  const getPlanPricing = (planName: string) => {
    const plan = plans.find(p => p.name?.toUpperCase() === planName.toUpperCase());
    if (plan) return { monthly: plan.monthlyPrice ?? 0, yearly: plan.annualPrice ?? 0 };
    // Fallback defaults
    if (planName === "ESSENTIALS") return { monthly: 24000, yearly: Math.round(24000 * 12 * 0.9) };
    if (planName === "PREMIUM") return { monthly: 120000, yearly: Math.round(120000 * 12 * 0.9) };
    return { monthly: 0, yearly: 0 };
  };
  useEffect(() => {
    const urlBillingCycle = searchParams?.get('billingCycle') as 'monthly' | 'yearly';
    if (urlBillingCycle && (urlBillingCycle === 'monthly' || urlBillingCycle === 'yearly')) {
      setBillingCycle(urlBillingCycle);
    }
  }, [searchParams]);

  // Plan pricing - fetched from API, with fallback defaults
  const planPricing = {
    essentials: getPlanPricing("ESSENTIALS"),
    premium: getPlanPricing("PREMIUM"),
  };

  const formatPrice = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const getYearlyDiscount = (monthly: number, yearly: number) => {
    const monthlyTotal = monthly * 12;
    const savings = monthlyTotal - yearly;
    const percentage = 10; // Fixed 10% discount
    return { savings, percentage };
  };

  const handleSubscribe = async (plan: "ESSENTIALS" | "PREMIUM") => {
    try {
      setIsLoading(plan);
      // Initialize transaction with plan and selected billing cycle
      const result = await initializeTransactionWithPlan(
        plan,
        billingCycle,
        ["card", "bank_transfer"],
        `${window.location.origin}/dashboard/subscription/success`
      );
      console.log("Payment result : ", result)
      if (result.success && result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      } else {
        console.error("Failed to initialize subscription:", result.message);
        showError("Failed to start subscription process. Please try again.");
      }
    } catch (error: any) {
      console.error("Error starting subscription:", error);
      
      if (error.response?.status === 401) {
        const returnUrl = encodeURIComponent(`/dashboard/pricing?plan=${plan}`);
        router.push(`/signIn?returnUrl=${returnUrl}`);
      } else {
        showError("An error occurred. Please try again.");
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
      return t("current_plan_label");
    }
    if (isLoading === plan) {
      return t("processing");
    }
    return plan === "ESSENTIALS" ? t("upgrade_to_essentials") : t("upgrade_to_premium");
  };

  if (loadingSubscription) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED] mx-auto mb-4"></div>
          <p className="text-[#667085]">{t("loading_subscription_details_text")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
       <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
              />
      {/* Header */}
      <div className="mb-8">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/overview" className="p-2 text-[#2F80ED] hover:bg-[#EFF8FF] rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-[24px] font-semibold text-[#101828]">{t("subscription_plans")}</h1>
              <p className="text-[#667085]">{t("choose_plan_fits")}</p>
            </div>
          </div>
          
          {/* Billing Cycle Toggle - Right Side */}
          <div className="flex items-center bg-[#F9FAFB] rounded-lg p-1 border border-[#E4E7EC]">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#2F80ED] shadow-sm border border-[#E4E7EC]'
                  : 'text-[#667085] hover:text-[#344054]'
              }`}
            >
              {t("monthly") || "Monthly"}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                billingCycle === 'yearly'
                  ? 'bg-white text-[#2F80ED] shadow-sm border border-[#E4E7EC]'
                  : 'text-[#667085] hover:text-[#344054]'
              }`}
            >
              {t("yearly") || "Yearly"}
              <span className="absolute -top-2 -right-1 bg-[#10B981] text-white text-xs px-1.5 py-0.5 rounded-full">
                {getYearlyDiscount(planPricing.essentials.monthly, planPricing.essentials.yearly).percentage}% {t("off") || "off"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard/overview" className="p-2 text-[#2F80ED] hover:bg-[#EFF8FF] rounded-lg transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-[20px] font-semibold text-[#101828]">{t("subscription_plans")}</h1>
              <p className="text-[#667085] text-sm">{t("choose_plan_fits")}</p>
            </div>
          </div>
          
          {/* Billing Cycle Toggle - Centered on Mobile */}
          <div className="flex justify-center">
            <div className="flex items-center bg-[#F9FAFB] rounded-lg p-1 border border-[#E4E7EC]">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-[#2F80ED] shadow-sm border border-[#E4E7EC]'
                    : 'text-[#667085] hover:text-[#344054]'
                }`}
              >
                {t("monthly") || "Monthly"}
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-[#2F80ED] shadow-sm border border-[#E4E7EC]'
                    : 'text-[#667085] hover:text-[#344054]'
                }`}
              >
                {t("yearly") || "Yearly"}
                <span className="absolute -top-2 -right-1 bg-[#10B981] text-white text-xs px-1.5 py-0.5 rounded-full">
                  {getYearlyDiscount(planPricing.essentials.monthly, planPricing.essentials.yearly).percentage}% {t("off") || "off"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Plan Banner */}
      {currentSubscription && currentSubscription.plan !== "FREE" && (
        <div className="mb-8 bg-white rounded-lg border border-[#E4E7EC] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[18px] font-semibold text-[#101828] mb-1">
                {t("current_plan_label")}: {currentSubscription.planDisplayName}
              </h3>
              <p className="text-[#667085]">
                {currentSubscription.invoiceLimit === -1 
                  ? t("unlimited_invoices_text")
                  : `${currentSubscription.invoicesUsed}/${currentSubscription.invoiceLimit} ${t("invoices_used_this_month")}`
                }
              </p>
            </div>
            <div className="px-3 py-1 bg-[#ECFDF5] text-[#10B981] text-sm font-medium rounded-full">
              {t("active")}
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
                  {t("current_plan_label")}
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-[24px] font-semibold text-[#101828] mb-2">{t("free")}</h3>
              <div className="text-[36px] font-bold text-[#101828] mb-1">₦0</div>
              <p className="text-[#667085]">{t("perfect_getting_started")}</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("three_invoices_per_month")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("basic_invoice_templates_text")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("email_whatsapp_sharing_text")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("payment_tracking_text")}</span>
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
              {isCurrentPlan("FREE") ? t("current_plan_label") : t("downgrade_to_free")}
            </button>
          </div>

          {/* Essentials Plan */}
          <div className="bg-white rounded-lg border border-[#E4E7EC] p-6 relative">
            {isCurrentPlan("ESSENTIALS") && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#2F80ED] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {t("current_plan_label")}
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-[24px] font-semibold text-[#101828] mb-2">{t("essentials")}</h3>
              <div className="text-[36px] font-bold text-[#101828] mb-1">
                {formatPrice(planPricing.essentials[billingCycle])}
              </div>
              <p className="text-[#667085]">
                {billingCycle === 'monthly' ? (t("per_month") || "per month") : (t("per_year_text") || "per year")}
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-[#10B981] mt-1">
                  {t("save") || "Save"} {formatPrice(getYearlyDiscount(planPricing.essentials.monthly, planPricing.essentials.yearly).savings)} {t("annually") || "annually"}
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("ten_invoices_per_month")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("custom_logo_upload")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("advanced_templates")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("priority_support")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("tax_compliance_tools")}</span>
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
                  {t("current_plan_label")}
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-[24px] font-semibold text-[#101828] mb-2">{t("premium")}</h3>
              <div className="text-[36px] font-bold text-[#101828] mb-1">
                {formatPrice(planPricing.premium[billingCycle])}
              </div>
              <p className="text-[#667085]">
                {billingCycle === 'monthly' ? (t("per_month") || "per month") : (t("per_year_text") || "per year")}
              </p>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-[#10B981] mt-1">
                  {t("save") || "Save"} {formatPrice(getYearlyDiscount(planPricing.premium.monthly, planPricing.premium.yearly).savings)} {t("annually") || "annually"}
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("unlimited_invoices_text_short")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("multiple_custom_logos_text")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("premium_templates_text")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("priority_support_24_7")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("advanced_analytics")}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                <span className="text-[#344054]">{t("multiple_company_profiles_text")}</span>
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

const DashboardPricingPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED] mx-auto mb-4"></div>
          <p className="text-[#667085]">Loading...</p>
        </div>
      </div>
    }>
      <DashboardPricingPageContent />
    </Suspense>
  );
};

export default DashboardPricingPage;