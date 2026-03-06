"use client";


import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useToast } from '@/hooks/useToast';
import { ApiClient } from '@/lib/api';
import Toast from '@/components/ui/Toast';
import { useTranslation } from "react-i18next";
import { usePlanAccess } from '@/hooks/usePlanAccess';
import Link from 'next/link';

const NotificationsPage = () => {
  const { t } = useTranslation();
  const { hasAccess, getFeatureUpgradeMessage } = usePlanAccess();
  const [settings, setSettings] = useState({
    paymentRecorded: true,
    invoiceSent: true,
    invoiceReminder: true,
    clientAdded: true,
    systemAlerts: true,
    weeklyReports: false,
    monthlyReports: false,
    customAlerts: false,
    smsNotifications: false,
  });

  
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const handleToggle = (field: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      const response = await ApiClient.updateNotificationPreference(settings);
      if (response.status === 200) {
        showSuccess(t("notification_settings_updated"));
      } else {
        showError(t("failed_update_notification"));
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      showError(t("unexpected_error_occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      setIsLoadingData(true);
      const response = await ApiClient.getNotificationPreference();
      if (response.status === 200 && response.data) {
        const responseData = response.data as { data: typeof settings };
        setSettings(responseData.data);
      } else {
        console.error("Failed to load notification settings:", response);
        showError(t("failed_update_notification"));
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
      showError(t("failed_update_notification"));
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const notificationItems = [
    {
      key: 'paymentRecorded' as keyof typeof settings,
      title: t('payment_recorded'),
      description: t('get_notified_payment'),
      isPremium: false
    },
    {
      key: 'invoiceSent' as keyof typeof settings,
      title: t('invoice_sent'),
      description: t('get_notified_invoice_sent'),
      isPremium: false
    },
    {
      key: 'invoiceReminder' as keyof typeof settings,
      title: t('invoice_reminder'),
      description: t('get_notified_invoice_reminder'),
      isPremium: false
    },
    {
      key: 'clientAdded' as keyof typeof settings,
      title: t('client_added'),
      description: t('get_notified_client_added'),
      isPremium: false
    },
    {
      key: 'systemAlerts' as keyof typeof settings,
      title: t('system_alerts'),
      description: t('get_notified_system_alerts'),
      isPremium: false
    },
  ];

  const advancedNotificationItems = [
    {
      key: 'weeklyReports' as keyof typeof settings,
      title: 'Weekly Reports',
      description: 'Receive weekly summary of your invoices and payments',
      isPremium: true
    },
    {
      key: 'monthlyReports' as keyof typeof settings,
      title: 'Monthly Reports',
      description: 'Get detailed monthly analytics and insights',
      isPremium: true
    },
    {
      key: 'customAlerts' as keyof typeof settings,
      title: 'Custom Alerts',
      description: 'Set up custom notification rules and triggers',
      isPremium: true
    },
    {
      key: 'smsNotifications' as keyof typeof settings,
      title: 'SMS Notifications',
      description: 'Receive important alerts via SMS',
      isPremium: true
    },
  ];


  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
            <span className="ml-3 text-[#667085]">{t("loading_notification_settings")}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Notification Settings */}
          <div>
            <h2 className="text-lg font-semibold text-[#101828] mb-4">Basic Notifications</h2>
            <div className="space-y-4">
              {notificationItems.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3">
                  <div>
                    <h3 className="text-sm font-medium text-[#101828]">{item.title}</h3>
                    <p className="text-xs text-[#667085] mt-1">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings[item.key] ? 'bg-[#2F80ED]' : 'bg-[#D0D5DD]'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Notification Settings (PREMIUM) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#101828]">Advanced Notifications</h2>
              {!hasAccess('advancedAnalytics') && (
                <span className="text-xs px-2 py-1 bg-[#FEF3C7] text-[#F59E0B] rounded-full font-medium">
                  Premium Only
                </span>
              )}
            </div>
            <div className="space-y-4">
              {advancedNotificationItems.map((item) => {
                const isLocked = !hasAccess('advancedAnalytics');
                return (
                  <div 
                    key={item.key} 
                    className={`flex items-center justify-between py-3 relative ${isLocked ? 'opacity-60' : ''}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-[#101828]">{item.title}</h3>
                        {isLocked && (
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 7V5C12 2.79086 10.2091 1 8 1C5.79086 1 4 2.79086 4 5V7M8 10V12M5 15H11C12.1046 15 13 14.1046 13 13V9C13 7.89543 12.1046 7 11 7H5C3.89543 7 3 7.89543 3 9V13C3 14.1046 3.89543 15 5 15Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>
                      <p className="text-xs text-[#667085] mt-1">{item.description}</p>
                      {isLocked && (
                        <Link 
                          href="/dashboard/pricing"
                          className="text-xs text-[#2F80ED] hover:underline mt-1 inline-block"
                        >
                          Upgrade to Premium
                        </Link>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => !isLocked && handleToggle(item.key)}
                      disabled={isLocked}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isLocked ? 'cursor-not-allowed bg-[#E4E7EC]' :
                        settings[item.key] ? 'bg-[#2F80ED]' : 'bg-[#D0D5DD]'
                      }`}
                      title={isLocked ? getFeatureUpgradeMessage('advancedAnalytics') : ''}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Message */}
          <div className="flex items-start gap-3 p-4 bg-[#EFF8FF] border border-[#B9E6FE] rounded-lg">
            <Info size={20} className="text-[#2F80ED] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#2F80ED]">
              {t("email_notification_info")}
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("saving_settings") : t("save_settings")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationsPage;