"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

const BillingPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const currentPlan = {
    name: "Enterprise",
    nextBill: "₦24,000",
    nextBillDate: "Jun 10, 2026",
    features: [
      "Up to 10 invoices per month",
      "Auto-fill client & item info",
      "Tax calculator (VAT, WHT, PAYE)",
      "1 custom logo upload",
      "1 company profile",
      "Top-rated mobile app"
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
    // TODO: Navigate to upgrade/pricing page or open upgrade modal
    router.push("/dashboard/pricing");

  };

  const handleViewPricing = () => {
    // TODO: Navigate to pricing page
    router.push("/dashboard/pricing");

  };

  return (
    <div className="p-6">
      <div className="max-w-2xl">
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-white border border-[#E4E7EC] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#101828]">{t("current_plan")}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-[#ECFDF5] text-[#10B981] text-sm font-medium rounded-full">
                    {currentPlan.name}
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