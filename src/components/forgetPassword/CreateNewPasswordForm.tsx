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
import PasswordIcon from '../signUp/passwordIcon';

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
    <form 
      onSubmit={onSubmit} 
      className="w-full mx-auto py-4 sm:py-8 px-4 sm:px-6 flex flex-col gap-6 sm:gap-10"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-['Inter_Tight'] font-medium text-xl sm:text-2xl leading-tight text-center text-[#000000]">
          Set new password
        </h2>
        <p className="font-['Inter_Tight'] font-normal text-sm sm:text-lg leading-relaxed text-center text-[#444444] px-2">
          Create a strong password with at least 8 characters for the account with the email{' '}
          <span className="font-medium break-all">{email}</span>
        </p>
      </div>

      {/* New Password Input */}
      <div className="w-full flex flex-col gap-2">
        {/* Label */}
        <label 
          htmlFor="newPassword"
          className="font-['Inter_Tight'] font-medium text-sm sm:text-base leading-relaxed text-[#000000]"
        >
          New Password
        </label>
        
        {/* Input wrapper */}
        <div className="relative w-full">
          <input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="Enter your password"
            className="w-full h-10 sm:h-12 rounded-lg py-2 pr-10 pl-3 sm:pl-4 border border-[#E5E5E5] bg-[#FFFFFF] font-['Inter_Tight'] text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            required
          />
          
          {/* Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="w-5 h-5 flex items-center justify-center hover:opacity-70"
            >
              <PasswordIcon width={19} height={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="w-full flex flex-col gap-2">
        {/* Label */}
        <label 
          htmlFor="confirmPassword"
          className="font-['Inter_Tight'] font-medium text-sm sm:text-base leading-relaxed text-[#000000]"
        >
          Confirm Password
        </label>
        
        {/* Input wrapper */}
        <div className="relative w-full">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Enter your password"
            className="w-full h-10 sm:h-12 rounded-lg py-2 pr-10 pl-3 sm:pl-4 border border-[#E5E5E5] bg-[#FFFFFF] font-['Inter_Tight'] text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            required
          />
          
          {/* Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="w-5 h-5 flex items-center justify-center hover:opacity-70"
            >
              <PasswordIcon width={19} height={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="w-full h-11 sm:h-12 rounded-md py-3 px-4 bg-[#2F80ED] text-white font-['Inter_Tight'] font-medium text-sm sm:text-base flex items-center justify-center focus:outline-none hover:bg-[#2670d4] active:bg-[#1e5bb8] transition-colors"
      >
        Continue
      </button>

      {/* Go Back Link */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onGoBack}
          className="flex items-center gap-2 hover:opacity-80 active:opacity-60"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6667 10H3.33333M3.33333 10L8.33333 15M3.33333 10L8.33333 5" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-['Inter_Tight'] font-semibold text-xs sm:text-sm leading-relaxed underline decoration-solid text-[#2F80ED]">
            Go Back
          </span>
        </button>
      </div>
    </form>
  );
}

