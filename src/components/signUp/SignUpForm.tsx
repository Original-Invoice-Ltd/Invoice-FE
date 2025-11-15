/**
 * SignUpForm Component
 * 
 * First screen of the signup flow containing:
 * - Email and password input fields
 * - Terms and conditions checkbox
 * - Sign Up button
 * - Social login options (Google, Apple)
 * - Link to sign in for existing users
 * 
 * Fully responsive for mobile and desktop.
 */
'use client';

import { useState } from 'react';
import InputField from './InputField';
import SocialLoginButtons from './SocialLoginButtons';

interface SignUpFormProps {
  formData: {
    email: string;
    password: string;
    agreeToTerms: boolean;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignUpForm({ formData, onInputChange, onSubmit }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Email icon
  const emailIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#000000] mb-2">Sign Up</h2>
        <p className="text-sm sm:text-base text-[#444444] tracking-[-1px]">Sign in with your email or social accounts</p>
      </div>

      {/* Email Input */}
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={onInputChange}
        placeholder="Enter your email address"
        icon={emailIcon}
        required
      />

      {/* Password Input */}
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={onInputChange}
        placeholder="Enter your password"
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        required
      />

      {/* Terms and Conditions */}
      <div>
        <label className="flex items-start gap-3 text-xs sm:text-sm text-[#333436">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={onInputChange}
            className="mt-1 w-4 h-4 text-[#222222] border-red-500 rounded shrink-0"
            required
          />
          <span className='text-[#333436]'>
            By creating an account means you agree to the{' '}
            <a href="#" className="text-[#2F80ED] hover:underline">Terms and Conditions</a>
            , and our{' '}
            <a href="#" className="text-[#2F80ED] hover:underline">Privacy Policy</a>
          </span>
        </label>
      </div>

      {/* Sign Up Button */}
      <button
        type="submit"
        className="w-full bg-[#2F80ED] text-white py-3 rounded-lg font-semibold
        transition-colors focus:outline-none focus:ring-0
        focus:ring-offset-2 text-sm sm:text-base tracking-tight"
      >
        Sign Up
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-4 sm:my-6">
        <div className="flex-1 h-px bg-[#E8E9ED]"></div>
        <span className="text-xs sm:text-sm text-[#000000] tracking-[-1px]">Or</span>
        <div className="flex-1 h-px bg-[#E8E9ED]"></div>
      </div>

      {/* Social Login Buttons */}
      <SocialLoginButtons />

      {/* Sign In Link */}
      <div className="text-center text-xs sm:text-sm text-[#222222] mt-4 sm:mt-6 tracking-tight">
        Have an account?{' '}
        <a href="#" className="text-[#2F80ED] hover:underline font-medium tracking-tight">Sign In</a>
      </div>
    </form>
  );
}

