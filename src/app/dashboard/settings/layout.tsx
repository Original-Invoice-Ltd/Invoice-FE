"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Calculator, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard 
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const settingsItems = [
    {
      id: "business",
      label: t("business_profile"),
      icon: Building2,
      path: "/dashboard/settings/business",
    },
    {
      id: "personal",
      label: t("personal_profile"),
      icon: User,
      path: "/dashboard/settings/personal",
    },
    {
      id: "tax",
      label: t("tax_settings"),
      icon: Calculator,
      path: "/dashboard/settings/tax",
    },
    {
      id: "notifications",
      label: t("notification"),
      icon: Bell,
      path: "/dashboard/settings/notifications",
    },
    {
      id: "security",
      label: t("security"),
      icon: Shield,
      path: "/dashboard/settings/security",
    },
    {
      id: "language",
      label: t("language"),
      icon: Globe,
      path: "/dashboard/settings/language",
    },
    {
      id: "billing",
      label: t("plan_billing"),
      icon: CreditCard,
      path: "/dashboard/settings/billing",
    },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = settingsItems.find(item => pathname === item.path);
    return currentItem?.label || t("account_settings");
  };

  const handleBack = () => {
    router.push("/dashboard/overview");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 p-6">
          {/* Left Section */}
          <div className="flex flex-col gap-6">
            {/* Header - Outside container */}
            <button
              onClick={handleBack}
              className="flex items-center gap-3 text-[#667085] hover:text-[#101828] transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-lg font-semibold">{getCurrentPageTitle()}</span>
            </button>

            {/* Navigation Container */}
            <div className="w-[260px] h-[444px] bg-white border border-[#E4E7EC] rounded-lg">
              <nav className="p-4">
                <div className="space-y-1">
                  {settingsItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => router.push(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                          isActive
                            ? "bg-[#EFF8FF] text-[#2F80ED] border border-[#2F80ED]"
                            : "text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828]"
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content - White Container */}
          <div className="flex-1 bg-white border border-[#E4E7EC] rounded-lg">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;