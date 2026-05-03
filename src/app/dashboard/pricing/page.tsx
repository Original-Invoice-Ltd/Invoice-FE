"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
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
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    ApiClient.get("/api/admin/system-config/plans/public").then(res => {
      // console.log('[Pricing] API response:', res.status, res.data, res.error);
      if (res.status === 200 && res.data) {
        const data = res.data as any;
        const list = Array.isArray(data) ? data : data.content ?? data.data ?? [];
        // console.log('[Pricing] plans from API:', list);
        setPlans(list);
      }
      setPlansLoading(false);
    }).catch(err => {
      // console.error('[Pricing] API error:', err);
      setPlansLoading(false);
    });
  }, []);

  const getPlanPricing = (planName: string) => {
    const plan = plans.find(p =>
      p.name?.toUpperCase() === planName.toUpperCase() ||
      p.planName?.toUpperCase() === planName.toUpperCase() ||
      p.type?.toUpperCase() === planName.toUpperCase()
    );
    if (plan) {
      // console.log(`[Pricing] found plan for ${planName}:`, plan);
      return {
        monthly: plan.monthlyPrice ?? plan.monthly_price ?? plan.priceMonthly ?? 0,
        yearly: plan.annualPrice ?? plan.annual_price ?? plan.priceYearly ?? plan.yearlyPrice ?? 0
      };
    }
    // Fallback defaults commented out — must come from API
    // if (planName === "ESSENTIALS") return { monthly: 24000, yearly: Math.round(24000 * 12 * 0.9) };
    // if (planName === "PREMIUM") return { monthly: 120000, yearly: Math.round(120000 * 12 * 0.9) };
    return { monthly: 0, yearly: 0 };
  };
  useEffect(() => {
    const urlBillingCycle = searchParams?.get('billingCycle') as 'monthly' | 'yearly';
    if (urlBillingCycle && (urlBillingCycle === 'monthly' || urlBillingCycle === 'yearly')) {
      setBillingCycle(urlBillingCycle);
    }
  }, [searchParams]);

  // Plan pricing - fetched from API, with fallback defaults
  const planPricing = useMemo(() => ({
    essentials: getPlanPricing("ESSENTIALS"),
    premium: getPlanPricing("PREMIUM"),
  }), [plans, billingCycle]);

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
    console.log(`[Dashboard Pricing] User clicked upgrade to plan: ${plan}`);
    try {
      setIsLoading(plan);
      // Initialize transaction with plan and selected billing cycle
      console.log(`[Dashboard Pricing] Initializing transaction for ${plan} (${billingCycle})...`);
      const result = await initializeTransactionWithPlan(
        plan,
        billingCycle,
        ["card", "bank_transfer"],
        `${window.location.origin}/dashboard/subscription/success`
      );
      
      console.log("[Dashboard Pricing] Initialization response:", result);
      
      if (result.success && result.authorizationUrl) {
        console.log(`[Dashboard Pricing] Redirecting to Paystack (payment url): ${result.authorizationUrl}`);
        window.location.href = result.authorizationUrl;
      } else {
        console.error(`[Dashboard Pricing] Failed to initialize subscription: ${result.message}`);
        showError("Failed to start subscription process. Please try again.");
      }
    } catch (error: any) {
      console.error("[Dashboard Pricing] Unexpected error starting subscription:", error);
      
      if (error.response?.status === 401) {
        console.warn("[Dashboard Pricing] 401 Unauthorized. Redirecting to signIn.");
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
        {plansLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-[#E4E7EC]">
            <p className="text-[#667085] text-lg font-medium">No plans available</p>
            <p className="text-[#98A2B3] text-sm mt-2">Please check back later or contact support.</p>
          </div>
        ) : (
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(plans.length, 3)} gap-8`}>
          {plans.map((plan) => {
            const planKey = plan.name?.toUpperCase();
            const isFree = plan.monthlyPrice === 0 && plan.annualPrice === 0;
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
            const monthlySavings = plan.monthlyPrice * 12 - plan.annualPrice;
            const isCurrent = isCurrentPlan(planKey);
            const features: string[] = Array.isArray(plan.features) ? plan.features : [];

            return (
              <div key={plan.id ?? plan.name} className="bg-white rounded-lg border border-[#E4E7EC] p-6 relative">
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#2F80ED] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {t("current_plan_label")}
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-[24px] font-semibold text-[#101828] mb-2">{plan.name}</h3>
                  <div className="text-[36px] font-bold text-[#101828] mb-1">
                    {isFree ? "₦0" : formatPrice(price ?? 0)}
                  </div>
                  {!isFree && (
                    <p className="text-[#667085]">
                      {billingCycle === 'monthly' ? (t("per_month") || "per month") : (t("per_year_text") || "per year")}
                    </p>
                  )}
                  {!isFree && billingCycle === 'yearly' && monthlySavings > 0 && (
                    <p className="text-xs text-[#10B981] mt-1">
                      {t("save") || "Save"} {formatPrice(monthlySavings)} {t("annually") || "annually"}
                    </p>
                  )}
                  {plan.description && <p className="text-[#667085] text-sm mt-1">{plan.description}</p>}
                </div>

                {features.length > 0 && (
                  <ul className="space-y-3 mb-8">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check size={20} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                        <span className="text-[#344054]">{f}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="grid grid-cols-2 gap-2 mb-6 text-xs text-[#667085]">
                  <div className="bg-[#F9FAFB] rounded p-2 text-center">
                    <p className="font-semibold text-[#344054]">{plan.maxInvoices >= 999 ? "∞" : plan.maxInvoices}</p>
                    <p>Max Invoices</p>
                  </div>
                  <div className="bg-[#F9FAFB] rounded p-2 text-center">
                    <p className="font-semibold text-[#344054]">{plan.maxLogos >= 999 ? "∞" : plan.maxLogos}</p>
                    <p>Max Logos</p>
                  </div>
                </div>

                <button
                  onClick={() => !isFree && !isCurrent && handleSubscribe(planKey as "ESSENTIALS" | "PREMIUM")}
                  disabled={isCurrent || isLoading === planKey || isFree}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isCurrent || isFree
                      ? "bg-[#F9FAFB] text-[#667085] border border-[#E4E7EC] cursor-not-allowed"
                      : "bg-[#2F80ED] text-white hover:bg-[#1E6FCC] disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {isCurrent ? t("current_plan_label") : isFree ? t("free") : isLoading === planKey ? t("processing") : `Upgrade to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
        )}
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