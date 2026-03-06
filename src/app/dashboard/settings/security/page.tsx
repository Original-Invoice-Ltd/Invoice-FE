"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ApiClient } from "@/lib/api";
import Toast from '@/components/ui/Toast';
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";

const SecurityPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { toast, showSuccess, showError, hideToast } = useToast(); 

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t("current_password_required");
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t("new_password_required");
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = t("password_min_length");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("confirm_password_required");
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwords_not_match");
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = t("new_password_different");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await ApiClient.changePassword(
        formData.currentPassword,
        formData.newPassword
      );

      if (response.status === 200) {

        showSuccess(t("password_changed_successfully"));
        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(response.error || "Failed to change password");
      }
    } catch (error: any) {
      console.error("Error changing password:", error);

      // Handle specific error cases
      if (error.message?.includes("Current password is incorrect")) {
        setErrors({ currentPassword: t("current_password_incorrect") });
      } else if (error.message?.includes("OAuth users")) {

        showError(t("oauth_password_change"));
      } else {
        showError(t("failed_change_password"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
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
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              {t("current_password")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder={t("enter_current_password")}
                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent ${
                  errors.currentPassword ? 'border-red-500' : 'border-[#D0D5DD]'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085] hover:text-[#101828]"
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              {t("new_password")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder={t("enter_new_password")}
                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent ${
                  errors.newPassword ? 'border-red-500' : 'border-[#D0D5DD]'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085] hover:text-[#101828]"
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-[#101828] mb-2">
              {t("confirm_new_password")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder={t("enter_confirm_password")}
                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-[#D0D5DD]'
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085] hover:text-[#101828]"
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 border border-[#D0D5DD] text-[#667085] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("updating_password") : t("update_password")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityPage;