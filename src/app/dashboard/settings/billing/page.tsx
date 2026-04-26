"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

const BillingPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
 
  // Plan pricing configuration - Monthly prices first, yearly with 10% discount
  const planPricing = {
    essentials: {
      monthly: 24000,
      yearly: Math.round(24000 * 12 * 0.9) // 10% discount on yearly
    },
    premium: {
      monthly: 120000,
      yearly: Math.round(120000 * 12 * 0.9) // 10% discount on yearly
    }
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

  const currentPlan = {
    name: "Enterprise",
    nextBill: billingCycle === 'monthly' ? "₦24,000" : "₦240,000",
    nextBillDate: "Jun 10, 2026",
    features: [
      t("up_to_10_invoices"),
      t("autofill_client_item"),
      t("tax_calculator_vat_wht_paye"),
      t("one_custom_logo"),
      t("one_company_profile"),
      t("top_rated_mobile_app")
    ]
  };

  const handleCancelPlan = async () => {
    if (!confirm(t("cancel_plan_question"))) {
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement plan cancellation API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(t("plan_cancelled_successfully"));
    } catch (error) {
      console.error("Error cancelling plan:", error);
      alert(t("failed_to_cancel_plan"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    // Pass the selected billing cycle to the pricing page
    const params = new URLSearchParams({ billingCycle });
    router.push(`/dashboard/pricing?${params.toString()}`);
  };

  const handleViewPricing = () => {
    // TODO: Navigate to pricing page
    router.push("/dashboard/pricing");
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <div className="space-y-6">
          {/* Billing Cycle Toggle */}
          <div className="bg-white border border-[#E4E7EC] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#101828]">{t("billing_cycle") || "Billing Cycle"}</h3>
                <p className="text-sm text-[#667085] mt-1">
                  {billingCycle === 'yearly' 
                    ? (t("save_with_yearly_billing") || "Save with yearly billing") 
                    : (t("flexible_monthly_billing") || "Flexible monthly billing")
                  }
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center bg-[#F9FAFB] rounded-lg p-1 border border-[#E4E7EC]">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    billingCycle === 'monthly'
                      ? 'bg-white text-[#2F80ED] shadow-sm border border-[#E4E7EC]'
                      : 'text-[#667085] hover:text-[#344054]'
                  }`}
                >
                  {t("monthly") || "Monthly"}
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
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

            {/* Pricing Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E4E7EC]">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-[#101828] mb-1">{t("essentials") || "Essentials"}</h4>
                  <div className="text-2xl font-bold text-[#101828]">
                    {formatPrice(planPricing.essentials[billingCycle])}
                  </div>
                  <p className="text-xs text-[#667085]">
                    {billingCycle === 'monthly' ? (t("per_month") || "per month") : (t("per_year") || "per year")}
                  </p>
                  {billingCycle === 'yearly' && (
                    <p className="text-xs text-[#10B981] mt-1">
                      {t("save") || "Save"} {formatPrice(getYearlyDiscount(planPricing.essentials.monthly, planPricing.essentials.yearly).savings)}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E4E7EC]">
                <div className="text-center">
                  <h4 className="text-sm font-medium text-[#101828] mb-1">{t("premium") || "Premium"}</h4>
                  <div className="text-2xl font-bold text-[#101828]">
                    {formatPrice(planPricing.premium[billingCycle])}
                  </div>
                  <p className="text-xs text-[#667085]">
                    {billingCycle === 'monthly' ? (t("per_month") || "per month") : (t("per_year") || "per year")}
                  </p>
                  {billingCycle === 'yearly' && (
                    <p className="text-xs text-[#10B981] mt-1">
                      {t("save") || "Save"} {formatPrice(getYearlyDiscount(planPricing.premium.monthly, planPricing.premium.yearly).savings)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Current Plan */}
          <div className="bg-white border border-[#E4E7EC] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#101828]">{t("current_plan")}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-[#ECFDF5] text-[#10B981] text-sm font-medium rounded-full">
                    {currentPlan.name}
                  </span>
                  <span className="px-2 py-1 bg-[#EFF8FF] text-[#2F80ED] text-xs font-medium rounded-full">
                    {billingCycle === 'monthly' ? (t("monthly") || "Monthly") : (t("yearly") || "Yearly")}
                  </span>
                </div>
              </div>
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 bg-[#2F80ED] text-white text-sm font-medium rounded-lg hover:bg-[#2563EB] transition-colors"
              >
                {t("upgrade_now_button")}
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-[#667085]">
                {t("next_bill")} <span className="font-semibold text-[#101828]">{currentPlan.nextBill}</span> {t("charged_on")}{" "}
                <span className="font-semibold text-[#101828]">{currentPlan.nextBillDate}</span>
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#101828] mb-3">{t("plan_details")}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check size={16} className="text-[#10B981] flex-shrink-0" />
                    <span className="text-sm text-[#667085]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E4E7EC]">
              <button
                onClick={handleCancelPlan}
                disabled={isLoading}
                className="text-sm text-[#EF4444] hover:text-[#DC2626] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("cancelling_plan") : t("cancel_plan")}
              </button>
            </div>
          </div>

          {/* Pricing Link */}
          <div className="bg-[#F9FAFB] border border-[#E4E7EC] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-[#101828] mb-1">
                  {t("view_all_plans")}
                </h3>
                <p className="text-xs text-[#667085]">
                  {t("compare_plans")}
                </p>
              </div>
              <button
                onClick={handleViewPricing}
                className="flex items-center gap-2 text-sm text-[#2F80ED] font-medium hover:text-[#2563EB] transition-colors"
              >
                <span>{t("pricing_page")}</span>
                <ExternalLink size={16} />
              </button>
            </div>
          </div>

          {/* Billing History */}
          <div className="bg-white border border-[#E4E7EC] rounded-lg p-6">
            
            <h3 className="text-lg font-semibold text-[#101828] mb-4">{t("billing_history")}</h3>
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-[#F9FAFB] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm text-[#667085]">{t("no_billing_history")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;