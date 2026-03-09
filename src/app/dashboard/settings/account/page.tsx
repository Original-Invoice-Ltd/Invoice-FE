"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const AccountSettingsPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Redirect to business profile as the default settings page
    router.replace("/dashboard/settings/business");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED] mx-auto"></div>
        <p className="mt-2 text-sm text-[#667085]">{t("loading_settings")}</p>
      </div>
    </div>
  );
};

export default AccountSettingsPage;