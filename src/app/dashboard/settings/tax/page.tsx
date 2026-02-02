"use client";

import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { ApiClient } from "@/lib/api";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import { ApiResponse } from "@/types/invoice";

// TypeScript interfaces for tax settings
interface TaxSettingsDto {
  taxApplied?: string;
  taxId?: string;
  enablingVAT?: boolean;
  enablingWHT?: boolean;
}


const TaxSettingsPage = () => {
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [settings, setSettings] = useState({
    enableVAT: false,
    enableWHT: false,
    defaultTax: "vat",
    taxId: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [isLoadingData, setIsLoadingData] = useState(true);

  // Load existing tax settings on component mount
  useEffect(() => {
    loadTaxSettings();
  }, []);

  const loadTaxSettings = async () => {
    try {
      setIsLoadingData(true);
      const response = await ApiClient.getTaxSettings();
      
      if (response.status === 200 && response.data) {
        const data = response.data as ApiResponse<TaxSettingsDto>;
        
        setSettings({
          enableVAT: data.data.enablingVAT || false,
          enableWHT: data.data.enablingWHT || false,
          defaultTax: mapTaxAppliedToDefaultTax(data.data.taxApplied),
          taxId: data.data.taxId || "",
        });
      }
    } catch (error) {
      // console.error("Error loading tax settings:", error);
      showError("Failed to load tax settings. Please refresh the page.");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Map backend taxApplied enum to UI defaultTax
  const mapTaxAppliedToDefaultTax = (taxApplied?: string): string => {
    if (!taxApplied) return 'vat'; // Default fallback
    
    switch (taxApplied.toLowerCase()) {
      case 'vat':
        return 'vat';
      case 'wht':
        return 'wht';
      case 'both':
        return 'both';
      case 'none':
        return 'none';
      default:
        return 'vat';
    }
  };

  // Map UI defaultTax to backend taxApplied enum
  const mapDefaultTaxToTaxApplied = (defaultTax: string): string => {
    switch (defaultTax) {
      case 'vat':
        return 'VAT';
      case 'wht':
        return 'WHT';
      case 'both':
        return 'BOTH';
      case 'none':
        return 'NONE';
      default:
        return 'VAT';
    }
  };

  const handleToggle = (field: 'enableVAT' | 'enableWHT') => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleRadioChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      defaultTax: value
    }));
  };

  const handleTaxIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      taxId: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      // Prepare data for backend
      const taxSettingsData = {
        taxApplied: mapDefaultTaxToTaxApplied(settings.defaultTax),
        taxId: settings.taxId,
        enablingVAT: settings.enableVAT,
        enablingWHT: settings.enableWHT,
      };

      const response = await ApiClient.updateTaxSettings(taxSettingsData);
      
      if (response.status === 200 && response.data) {
        const data = response.data as ApiResponse<TaxSettingsDto>;
        setSettings({
          enableVAT: data.data.enablingVAT || false,
          enableWHT: data.data.enablingWHT || false,
          defaultTax: mapTaxAppliedToDefaultTax(data.data.taxApplied),
          taxId: data.data.taxId || "",
        });
        
        showSuccess("Tax settings saved successfully!");
      } else {
        showError("Failed to save tax settings. Please try again.");
      }
    } catch (error) {
      // console.error("Error saving tax settings:", error);
      showError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {

    // Reload settings from server to reset any unsaved changes
    loadTaxSettings();
  };

  // Show loading state while fetching data
  if (isLoadingData) {
    return (
      <div className="p-6">
        <div className="max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
            <span className="ml-3 text-[#667085]">Loading tax settings...</span>
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
          {/* Enable VAT */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#101828]">Enable VAT (7.5%)</h3>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enableVAT')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enableVAT ? 'bg-[#2F80ED]' : 'bg-[#D0D5DD]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enableVAT ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Enable WHT */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[#101828]">Enable Withholding Tax (WHT)</h3>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('enableWHT')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enableWHT ? 'bg-[#2F80ED]' : 'bg-[#D0D5DD]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enableWHT ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Default Tax Applied to New Items */}
          <div>
            <h3 className="text-sm font-medium text-[#101828] mb-3">Default Tax Applied to New Items</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="defaultTax"
                  value="vat"
                  checked={settings.defaultTax === "vat"}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="w-4 h-4 text-[#2F80ED] border-[#D0D5DD] focus:ring-[#2F80ED]"
                />
                <span className="text-sm text-[#101828]">VAT Only</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="defaultTax"
                  value="wht"
                  checked={settings.defaultTax === "wht"}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="w-4 h-4 text-[#2F80ED] border-[#D0D5DD] focus:ring-[#2F80ED]"
                />
                <span className="text-sm text-[#101828]">WHT Only</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="defaultTax"
                  value="both"
                  checked={settings.defaultTax === "both"}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="w-4 h-4 text-[#2F80ED] border-[#D0D5DD] focus:ring-[#2F80ED]"
                />
                <span className="text-sm text-[#101828]">Both VAT and WHT</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="defaultTax"
                  value="none"
                  checked={settings.defaultTax === "none"}
                  onChange={(e) => handleRadioChange(e.target.value)}
                  className="w-4 h-4 text-[#2F80ED] border-[#D0D5DD] focus:ring-[#2F80ED]"
                />
                <span className="text-sm text-[#101828]">No Tax</span>
              </label>
            </div>
          </div>

          {/* Tax ID / TIN */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              Tax ID / TIN
            </label>
            <input
              type="text"
              value={settings.taxId}
              onChange={handleTaxIdChange}
              placeholder="Enter your Tax ID Number"
              className="w-full px-3 py-2.5 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            />
          </div>

          {/* Info Message */}
          <div className="flex items-start gap-3 p-4 bg-[#EFF8FF] border border-[#B9E6FE] rounded-lg">
            <Info size={20} className="text-[#2F80ED] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#2F80ED]">
              These tax settings are automatically applied when you create invoices
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
              {isLoading ? "Saving Settings..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaxSettingsPage;