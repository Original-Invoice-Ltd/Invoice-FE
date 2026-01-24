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
      className="w-full max-w-[518px] mx-auto py-8 px-6 flex flex-col gap-10"
    >
      {/* Header */}
      <div>
        <h2 className="w-[470px] h-[29px] rotate-0 opacity-100 font-['Inter_Tight'] font-medium text-[24px] leading-[120%] tracking-[0] text-center text-[#000000] mb-2">
          Set new password
        </h2>
        <p className="w-[470px] h-[50px] rotate-0 opacity-100 font-['Inter_Tight'] font-normal text-[18px] leading-[140%] tracking-[0.01em] text-center text-[#444444]">
          Create a strong password with at least 8 characters for the account with the email{' '}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      {/* New Password Input */}
      <div className="w-[470px] h-[70px] rotate-0 opacity-100 flex flex-col gap-[8px]">
        {/* Label */}
        <label 
          htmlFor="newPassword"
          className="font-['Inter_Tight'] font-medium text-[16px] leading-[140%] tracking-[0.01em] text-[#000000]"
        >
          New Password
        </label>
        
        {/* Input wrapper */}
        <div className="relative w-[470px] h-[40px] flex items-center justify-between">
          <input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="Enter your password"
            className="w-[470px] h-[40px] rotate-0 opacity-100 rounded-lg pt-[8px] pr-[10px] pb-[8px] pl-[12px] border border-[#E5E5E5] bg-[#FFFFFF] font-['Inter_Tight'] text-[16px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            required
          />
          
          {/* Icon */}
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="w-[20px] h-[20px] rotate-0 opacity-100 flex items-center justify-center"
            >
              <PasswordIcon width={19} height={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="w-[470px] h-[70px] rotate-0 opacity-100 flex flex-col gap-[8px]">
        {/* Label */}
        <label 
          htmlFor="confirmPassword"
          className="font-['Inter_Tight'] font-medium text-[16px] leading-[140%] tracking-[0.01em] text-[#000000]"
        >
          Confirm Password
        </label>
        
        {/* Input wrapper */}
        <div className="relative w-[470px] h-[40px] flex items-center justify-between">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Enter your password"
            className="w-[470px] h-[40px] rotate-0 opacity-100 rounded-lg pt-[8px] pr-[10px] pb-[8px] pl-[12px] border border-[#E5E5E5] bg-[#FFFFFF] font-['Inter_Tight'] text-[16px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            required
          />
          
          {/* Icon */}
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="w-[20px] h-[20px] rotate-0 opacity-100 flex items-center justify-center"
            >
              <PasswordIcon width={19} height={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="w-[470px] h-[46px] rotate-0 opacity-100 rounded-md pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[8px] bg-[#2F80ED] text-white font-['Inter_Tight'] font-medium text-[16px] flex items-center justify-center focus:outline-none hover:bg-[#2670d4] transition-none duration-0"
      >
        Continue
      </button>

      {/* Go Back Link */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onGoBack}
          className="flex items-center gap-[8px] hover:opacity-80"
        >
          <svg className="w-[20px] h-[20px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6667 10H3.33333M3.33333 10L8.33333 15M3.33333 10L8.33333 5" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-['Inter_Tight'] font-semibold text-[14px] leading-[140%] tracking-[0.01em] underline decoration-solid text-[#2F80ED]">
            Go Back
          </span>
        </button>
      </div>
    </form>
  );
}

