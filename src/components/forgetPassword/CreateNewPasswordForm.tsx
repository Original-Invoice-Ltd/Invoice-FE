/**
 * CreateNewPasswordForm Component
 * 
 * Third screen of the forgot password flow:
 * - New password input
 * - Confirm password input
 * - Continue button
 * - Go back link
 * 
 * Fully responsive for mobile and desktop.
 */
'use client';

import { useState } from 'react';
import InputField from './InputField';

interface CreateNewPasswordFormProps {
  email: string;
  onPasswordChange: (password: string, confirmPassword: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoBack: () => void;
}

export default function CreateNewPasswordForm({
  email,
  onPasswordChange,
  onSubmit,
  onGoBack,
}: CreateNewPasswordFormProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    onPasswordChange(value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    onPasswordChange(newPassword, value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Set new password</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Create a strong password with at least 8 characters for the account with the email{' '}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      {/* New Password Input */}
      <InputField
        label="New Password"
        type="password"
        name="newPassword"
        value={newPassword}
        onChange={handleNewPasswordChange}
        placeholder="Enter your password"
        showPassword={showNewPassword}
        onTogglePassword={() => setShowNewPassword(!showNewPassword)}
        required
      />

      {/* Confirm Password Input */}
      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        placeholder="Enter your password"
        showPassword={showConfirmPassword}
        onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        required
      />

      {/* Continue Button */}
      <button
        type="submit"
        className="w-full bg-[#0B62F6] text-white py-3 rounded-lg font-semibold hover:bg-[#0954d4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B62F6] focus:ring-offset-2 text-sm sm:text-base"
      >
        Continue
      </button>

      {/* Go Back Link */}
      <div className="text-center">
        <button
          type="button"
          onClick={onGoBack}
          className="text-sm text-[#0B62F6] hover:underline font-medium flex items-center justify-center gap-1"
        >
          <span>←</span> Go Back
        </button>
      </div>
    </form>
  );
}

