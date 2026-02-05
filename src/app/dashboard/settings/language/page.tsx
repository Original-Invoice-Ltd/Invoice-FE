"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/contexts/LanguageContext';
import Toast from '@/components/ui/Toast';

const LanguagePage = () => {
  const { selectedLanguage, updateLanguage, isLoading: isUpdating } = useLanguage();
  const [localLanguage, setLocalLanguage] = useState(selectedLanguage.toLowerCase());
  const { toast, showSuccess, showError, hideToast } = useToast();

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
    setLocalLanguage(selectedLanguage.toLowerCase());
  }, [selectedLanguage]);

  const handleLanguageChange = (languageCode: string) => {
    setLocalLanguage(languageCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await updateLanguage(localLanguage);
    
    if (success) {
      showSuccess("Language updated successfully!");
    } else {
      showError("Failed to update language preference. Please try again.");
    }
  };

  const handleCancel = () => {
    setLocalLanguage(selectedLanguage.toLowerCase());
  };

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
                    checked={localLanguage === language.code}
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
              disabled={isUpdating}
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Saving Language Preference..." : "Save Language Preference"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LanguagePage;