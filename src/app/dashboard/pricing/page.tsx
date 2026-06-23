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
    }).catch(() => {
      // console.error('[Pricing] API error:', err);
      setPlansLoading(false);
    });
  }, []);

  useEffect(() => {
    const urlBillingCycle = searchParams?.get('billingCycle') as 'monthly' | 'yearly';
    if (urlBillingCycle && (urlBillingCycle === 'monthly' || urlBillingCycle === 'yearly')) {
      setBillingCycle(urlBillingCycle);
    }
  }, [searchParams]);

  const formatPrice = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row justify-center items-center p-3 w-12 h-12">
            <Link href="/dashboard/overview" className="text-[#2F80ED] hover:opacity-80 transition-opacity">
              <ArrowLeft size={24} strokeWidth={1.5} />
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-[20px] font-semibold leading-[120%] text-[#000000] font-inter-tight">
              Pricing
            </h1>
          </div>
        </div>
      </div>

      {/* Current Plan Banner */}
      {currentSubscription && currentSubscription.plan !== "FREE" && (
        <div className="mb-8 bg-white rounded-lg border border-[#E4E7EC] p-6 max-w-[1115px] mx-auto">
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

      {/* Main Container */}
      <div className="flex flex-col items-start gap-4 max-w-[1115px] mx-auto">
        {/* White Container with Border */}
        <div className="flex flex-col items-center pt-5 gap-6 w-full bg-white border border-[#EDEDED] rounded-lg">
          {/* Actions - Toggle Section */}
          <div className="flex flex-row justify-center items-center gap-3 w-full px-4">
            <div className="flex flex-row items-center gap-6">
              <span 
                className={`text-[16px] md:text-[22px] font-medium leading-[120%] text-center font-inter-tight cursor-pointer whitespace-nowrap ${
                  billingCycle === 'monthly' ? 'text-[#000000]' : 'text-[#7D7F81]'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </span>
              
              {/* Toggle Switch */}
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`flex flex-row items-center p-0.5 w-11 h-6 rounded-full relative transition-all ${
                  billingCycle === 'yearly' ? 'bg-[#2F80ED]' : 'bg-[#E8E9ED]'
                }`}
              >
                <div 
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              
              <span 
                className={`text-[16px] md:text-[22px] font-medium leading-[120%] text-center font-inter-tight cursor-pointer whitespace-nowrap ${
                  billingCycle === 'yearly' ? 'text-[#000000]' : 'text-[#7D7F81]'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Annually
              </span>
            </div>
            
            {/* Save Chip - Always visible */}
            <div className="flex flex-row justify-center items-center px-2 gap-1 h-6 bg-[#E7FEF8] border-[0.5px] border-[#40C4AA] rounded-md whitespace-nowrap">
              <span className="text-[12px] font-medium leading-[140%] tracking-[0.01em] text-[#40C4AA] font-lato">
                Save up to 17%
              </span>
            </div>
          </div>

          {/* Pricing Cards Container */}
          <div className="relative w-full pb-8">
            {plansLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[#667085] text-lg font-medium">No plans available</p>
                <p className="text-[#98A2B3] text-sm mt-2">Please check back later or contact support.</p>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-6 flex-wrap px-4">
                {plans.map((plan) => {
                  const planKey = plan.name?.toUpperCase();
                  const isFree = plan.monthlyPrice === 0 && plan.annualPrice === 0;
                  const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
                  const monthlySavings = plan.monthlyPrice * 12 - plan.annualPrice;
                  const isCurrent = isCurrentPlan(planKey);
                  const features: string[] = Array.isArray(plan.features) ? plan.features : [];

                  return (
                    <div 
                      key={plan.id ?? plan.name} 
                      className={`relative flex flex-col items-start w-[344px] bg-white rounded-2xl ${
                        isFree ? 'border border-[#2F80ED]' : 'border border-[#E9EAEB]'
                      } shadow-[0px_5px_13px_-5px_rgba(10,9,11,0.05),0px_2px_4px_-1px_rgba(10,9,11,0.02)]`}
                    >
                      {/* Call out for Free Plan */}
                      {isFree && (
                        <div className="absolute -top-6 right-[85px] flex items-center">
                          <span className="text-[14px] font-semibold leading-5 text-[#2F80ED] font-sans">
                            Active Plan
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="flex flex-col items-center pt-6 px-8 gap-4 w-full">
                        {/* Price */}
                        <div className="text-[48px] font-semibold leading-[60px] tracking-[-0.02em] text-center text-[#000000] font-inter-tight">
                          {isFree ? "₦0" : formatPrice(price ?? 0)}
                        </div>
                        
                        {/* Heading and supporting text */}
                        <div className="flex flex-col items-start gap-1 w-full">
                          <h3 className="text-[20px] font-semibold leading-[30px] text-center text-[#000000] w-full font-inter-tight">
                            {plan.name}
                          </h3>
                          <p className="text-[16px] font-normal leading-[140%] tracking-[0.01em] text-center text-[#333436] w-full font-inter-tight">
                            {isFree 
                              ? "for 3 invoices" 
                              : billingCycle === 'monthly' 
                                ? "/year" 
                                : plan.description || "Perfect for small businesses and freelancers"
                            }
                          </p>
                          {!isFree && billingCycle === 'yearly' && monthlySavings > 0 && (
                            <p className="text-[14px] font-normal leading-[140%] tracking-[0.01em] text-center text-[#2F80ED] w-full font-inter-tight">
                              Save {formatPrice(monthlySavings)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col items-start pt-8 px-8 pb-10 gap-6 w-full">
                        {/* Check items */}
                        {features.length > 0 && (
                          <div className="flex flex-col items-start gap-4 w-full">
                            {features.slice(0, 6).map((feature, i) => (
                              <div key={i} className="flex flex-row items-start gap-3 w-full">
                                {/* Icon */}
                                <div className="w-6 h-6 flex-shrink-0 relative">
                                  <Check size={20} className="text-[#2F80ED] absolute top-1 left-1" strokeWidth={1.5} />
                                </div>
                                {/* Text */}
                                <div className="flex flex-col items-start flex-1">
                                  <span className="text-[16px] font-normal leading-[140%] tracking-[0.01em] text-[#333436] font-inter-tight">
                                    {feature}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Max Invoices/Logos Grid */}
                        <div className="grid grid-cols-2 gap-2 w-full text-xs text-[#667085]">
                          <div className="bg-[#F9FAFB] rounded p-2 text-center">
                            <p className="font-semibold text-[#344054]">{plan.maxInvoices >= 999 ? "∞" : plan.maxInvoices}</p>
                            <p>Max Invoices</p>
                          </div>
                          <div className="bg-[#F9FAFB] rounded p-2 text-center">
                            <p className="font-semibold text-[#344054]">{plan.maxLogos >= 999 ? "∞" : plan.maxLogos}</p>
                            <p>Max Logos</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col items-start px-8 pb-3 gap-3 w-full">
                        {/* Button */}
                        <button
                          onClick={() => !isFree && !isCurrent && handleSubscribe(planKey as "ESSENTIALS" | "PREMIUM")}
                          disabled={isCurrent || isLoading === planKey || isFree}
                          className={`flex flex-row justify-center items-center py-3 px-4 gap-2 w-full h-[46px] rounded-lg transition-colors ${
                            isFree
                              ? "bg-[#EFF8FF] text-[#3A97F7]"
                              : isCurrent
                                ? "bg-[#F9FAFB] text-[#667085] border border-[#E4E7EC] cursor-not-allowed"
                                : "bg-[#2F80ED] text-white hover:bg-[#1E6FCC] disabled:opacity-50 disabled:cursor-not-allowed"
                          }`}
                        >
                          <span className="text-[16px] font-medium leading-[140%] tracking-[0.01em] text-center font-inter-tight">
                            {isCurrent 
                              ? t("current_plan_label") 
                              : isFree 
                                ? "Current Plan" 
                                : isLoading === planKey 
                                  ? t("processing") 
                                  : `Upgrade Now`
                            }
                          </span>
                        </button>
                        
                        {/* Supporting text */}
                        <p className="text-[14px] font-normal leading-[140%] tracking-[0.01em] text-center text-[#333436] w-full font-inter-tight">
                          {isFree 
                            ? "No credit card required" 
                            : plan.description || "Perfect for small businesses and freelancers"
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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