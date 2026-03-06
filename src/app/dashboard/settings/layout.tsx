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
  const [showContent, setShowContent] = useState(false);

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

  const handleMobileBack = () => {
    setShowContent(false);
  };

  const handleMobileNavClick = (path: string) => {
    router.push(path);
    setShowContent(true);
  };

  const isOnSettingsSubpage = pathname !== "/dashboard/settings" && pathname.startsWith("/dashboard/settings");

  return (
    <>
      <div className="hidden md:block min-h-screen bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 p-6">
            <div className="flex flex-col gap-6">
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

      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-white">
        {/* Show sidebar menu when showContent is false */}
        {!showContent && (
          <div className="min-h-screen bg-white">
            <div className="p-4 border-b border-[#E4E7EC]">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-[#667085] hover:text-[#101828] transition-colors"
              >
                <div className="w-[25px] h-[25px] border border-black rounded flex items-center justify-center">
                  <ArrowLeft size={16} />
                </div>
                <span className="text-base font-medium">{t("account_settings")}</span>
              </button>
            </div>

            <div className="p-4">
              <div className="space-y-1">
                {settingsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMobileNavClick(item.path)}
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
            </div>
          </div>
        )}

        {/* Show content when showContent is true */}
        {showContent && (
          <div className="min-h-screen bg-white">
            {/* Back Button Header */}
            <div className="p-4 border-b border-[#E4E7EC]">
              <button
                onClick={handleMobileBack}
                className="flex items-center gap-2 text-[#667085] hover:text-[#101828] transition-colors"
              >
                <div className="w-[25px] h-[25px] border border-black rounded flex items-center justify-center">
                  <ArrowLeft size={16} />
                </div>
                <span className="text-base font-medium">{getCurrentPageTitle()}</span>
              </button>
            </div>

            {/* Content */}
            <div className="bg-white">
              {children}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SettingsLayout;