/**
 * ForgotPasswordForm Component
 * 
 * First screen of the forgot password flow:
 * - Email input field
 * - Continue button
 * 
 * Fully responsive for mobile and desktop.
 */
'use client';

import MailIcon from '../signUp/mailIcon';

interface ForgotPasswordFormProps {
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ForgotPasswordForm({ email, onEmailChange, onSubmit }: ForgotPasswordFormProps) {
  // Email icon
  const emailIcon = <MailIcon width={20} height={20} />;

  return (
    <form 
      onSubmit={onSubmit} 
      className="w-full max-w-[518px] mx-auto pt-8 px-6 pb-8 flex flex-col gap-8"
    >
      {/* Header */}
      <div>
        <h2 className="w-[470px] h-[29px] rotate-0 opacity-100 font-['Inter_Tight'] font-medium text-[24px] leading-[120%] tracking-[0] text-center text-[#000000] mb-2">
          Reset your password
        </h2>
        <p className="w-[470px] h-[50px] rotate-0 opacity-100 font-['Inter_Tight'] font-normal text-[18px] leading-[140%] tracking-[0.01em] text-center text-[#444444]">
          Enter your email, we'll send you a code to reset your password
        </p>
      </div>

      {/* Email Input */}
      <div className="w-[470px] h-[70px] rotate-0 opacity-100 flex flex-col gap-[24px]">
        {/* Label */}
        <label 
          htmlFor="email"
          className="w-[102px] h-[22px] rotate-0 opacity-100 flex items-center gap-1 font-['Inter_Tight'] font-medium text-[16px] leading-[140%] tracking-[0.01em] text-[#000000]"
        >
          Email Address
        </label>
        
        {/* Input wrapper */}
        <div className="relative w-[470px] h-[40px]">
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Enter your email address"
            className="w-[470px] h-[40px] rotate-0 opacity-100 rounded-lg pt-[8px] pr-[10px] pb-[8px] pl-[12px] border border-[#E5E5E5] bg-[#FFFFFF] font-['Inter_Tight'] text-[16px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            required
          />
          
          {/* Icon */}
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center">
            {emailIcon}
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
    </form>
  );
}

