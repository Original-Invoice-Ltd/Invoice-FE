"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useToast } from '@/hooks/useToast';
import { ApiClient } from '@/lib/api';
import Toast from '@/components/ui/Toast';

const LanguagePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast, showSuccess, showError, hideToast } = useToast(); 
const uiToApiLanguageMap: Record<string, string> = {
  en: 'ENGLISH',
  ha: 'HAUSA',
  ig: 'IGBO',
  yo: 'YORUBA',
};

 const apiToUiLanguageMap: Record<string, string> = {
  ENGLISH: 'en',
  HAUSA: 'ha',
  IGBO: 'ig',
  YORUBA: 'yo',
  };
  const getLanguagePreference = async () => {
    try {
      setIsLoadingData(true);
      const response = await ApiClient.getLanguage();
      if (response.status === 200 && response.data) {
        const responseData = response.data as { data: string };
        const apiLang = responseData.data;
        setSelectedLanguage(apiToUiLanguageMap[apiLang] ?? 'en');
      } else {
        console.error("Failed to load language preference:", response);
        showError("Failed to load language preference. Please refresh the page.");
      }
    } catch (error) {
      console.error("Error loading language preference:", error);
      showError("Failed to load language preference. Please refresh the page.");
    } finally {
      setIsLoadingData(false);
    }
  };

  const languages = [
    {
      code: "en",
      name: "English (Default)",
      nativeName: "English"
    },
    {
      code: "ha",
      name: "Hausa",
      nativeName: "Hausa"
    },
    {
      code: "ig",
      name: "Igbo",
      nativeName: "Igbo"
    },
    {
      code: "yo",
      name: "Yoruba",
      nativeName: "Yorùbá"
    }
  ];

  useEffect(() => {
    getLanguagePreference();
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await ApiClient.updateLanguage(
        uiToApiLanguageMap[selectedLanguage]
      );

      if (response.status === 200) {
        showSuccess("Language updated successfully!");
      } else {
        showError(response.error || "Failed to update language preference. Please try again.");
      }
    } catch (error) {
      console.error("Error saving language preference:", error);
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reload language preference from server to reset changes
    getLanguagePreference();
  };

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
            <span className="ml-3 text-[#667085]">Loading language settings...</span>
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
          {/* Language Selection */}
          <div>
            <h3 className="text-sm font-medium text-[#101828] mb-4">Select Your Language</h3>
            <div className="space-y-3">
              {languages.map((language) => (
                <label
                  key={language.code}
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  <input
                    type="radio"
                    name="language"
                    value={language.code}
                    checked={selectedLanguage === language.code}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-4 h-4 text-[#2F80ED] border-[#D0D5DD] focus:ring-[#2F80ED]"
                  />
                  <div>
                    <div className="text-sm font-medium text-[#101828]">
                      {language.name}
                    </div>
                    <div className="text-xs text-[#667085]">
                      {language.nativeName}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Info Message */}
          <div className="flex items-start gap-3 p-4 bg-[#EFF8FF] border border-[#B9E6FE] rounded-lg">
            <Info size={20} className="text-[#2F80ED] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#2F80ED]">
              Changing your language will update all text throughout the dashboard, including menus, buttons, and system messages. Your invoices and client data will remain unchanged.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-[#D0D5DD] text-[#667085] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving Language Preference..." : "Save Language Preference"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LanguagePage;