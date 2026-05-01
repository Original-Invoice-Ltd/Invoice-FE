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
      className="w-full mx-auto pt-4 sm:pt-8 px-4 sm:px-6 pb-6 sm:pb-8 flex flex-col gap-6 sm:gap-8"
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-['Inter_Tight'] font-medium text-xl sm:text-2xl leading-tight text-center text-[#000000]">
          Reset your password
        </h2>
        <p className="font-['Inter_Tight'] font-normal text-base sm:text-lg leading-relaxed text-center text-[#444444] px-2">
          Enter your email, we'll send you a code to reset your password
        </p>
      </div>

      {/* Email Input */}
      <div className="w-full flex flex-col gap-2">
        {/* Label */}
        <label 
          htmlFor="email"
          className="font-['Inter_Tight'] font-medium text-sm sm:text-base leading-relaxed text-[#000000]"
        >
          Email Address
        </label>
        
        {/* Input wrapper */}
        <div className="relative w-full">
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Enter your email address"
            className="w-full h-10 sm:h-12 rounded-lg py-2 pr-10 pl-3 sm:pl-4 border border-[#E5E5E5] bg-[#FFFFFF] font-['Inter_Tight'] text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
            required
          />
          
          {/* Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {emailIcon}
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
    </form>
  );
}

