"use client";

import { useState } from "react";
import { Info } from "lucide-react";

const NotificationsPage = () => {
  const [settings, setSettings] = useState({
    paymentRecorded: true,
    invoiceSent: true,
    invoiceReminder: true,
    clientAdded: true,
    systemAlerts: true,
  });

  const [isLoading, setIsLoading] = useState(false);

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
      // TODO: Implement notification settings update API call
      console.log("Notification settings:", settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Notification settings saved successfully!");
    } catch (error) {
      console.error("Error saving notification settings:", error);
      alert("Failed to save notification settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="p-6">
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