"use client";

<<<<<<< HEAD
import { useState } from "react";
import { Info } from "lucide-react";
=======
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useToast } from '@/hooks/useToast';
import { ApiClient } from '@/lib/api';
import Toast from '@/components/ui/Toast';
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0

const NotificationsPage = () => {
  const [settings, setSettings] = useState({
    paymentRecorded: true,
    invoiceSent: true,
    invoiceReminder: true,
    clientAdded: true,
    systemAlerts: true,
  });
<<<<<<< HEAD

  const [isLoading, setIsLoading] = useState(false);
=======
  
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0

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
<<<<<<< HEAD
      // TODO: Implement notification settings update API call
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Notification settings saved successfully!");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("Failed to save notification settings. Please try again.");
=======
      const response = await ApiClient.updateNotificationPreference(settings);
      if (response.status === 200) {
        showSuccess("Notification settings updated successfully!");
      } else {
        showError(response.error || "Failed to update notification settings. Please try again.");
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      showError("An unexpected error occurred. Please try again.");
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
=======
  const loadNotificationSettings = async () => {
    try {
      setIsLoadingData(true);
      const response = await ApiClient.getNotificationPreference();
      if (response.status === 200 && response.data) {
        const responseData = response.data as { data: typeof settings };
        setSettings(responseData.data);
      } else {
        console.error("Failed to load notification settings:", response);
        showError("Failed to load notification settings. Please refresh the page.");
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
      showError("Failed to load notification settings. Please refresh the page.");
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadNotificationSettings();
  }, []);

>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
  const notificationItems = [
    {
      key: 'paymentRecorded' as keyof typeof settings,
      title: 'Payment Recorded',
      description: 'Get notified when payments are recorded'
    },
    {
      key: 'invoiceSent' as keyof typeof settings,
      title: 'Invoice Sent',
      description: 'Get notified when invoices are sent to clients'
    },
    {
      key: 'invoiceReminder' as keyof typeof settings,
      title: 'Invoice Reminder',
      description: 'Get notified about invoice reminders'
    },
    {
      key: 'clientAdded' as keyof typeof settings,
      title: 'Client Added',
      description: 'Get notified when new clients are added'
    },
    {
      key: 'systemAlerts' as keyof typeof settings,
      title: 'System Alerts',
      description: 'Get notified about system updates and alerts'
    },
  ];

<<<<<<< HEAD
  return (
    <div className="p-6">
=======
  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
            <span className="ml-3 text-[#667085]">Loading notification settings...</span>
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
      
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notification Settings */}
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

          {/* Info Message */}
          <div className="flex items-start gap-3 p-4 bg-[#EFF8FF] border border-[#B9E6FE] rounded-lg">
            <Info size={20} className="text-[#2F80ED] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#2F80ED]">
              Email notifications will be sent to your registered email address. In-app notifications will appear in your notification center within the application.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving Settings..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationsPage;