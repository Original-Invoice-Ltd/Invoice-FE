"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ApiClient } from "@/lib/api";
import Toast from '@/components/ui/Toast';
import { useToast } from "@/hooks/useToast";

const SecurityPage = () => {
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
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
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
        showSuccess("Password changed successfully!");
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
        setErrors({ currentPassword: "Current password is incorrect" });
      } else if (error.message?.includes("OAuth users")) {
        showError("Cannot change password for OAuth users. Please use your Google/Apple account to manage your password.");
      } else {
        showError("Failed to change password. Please try again.");
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
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
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
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
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
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Enter confirm password"
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecurityPage;