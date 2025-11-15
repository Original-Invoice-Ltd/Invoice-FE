/**
 * SignInForm Component
 * 
 * Sign-in form containing:
 * - Email and password input fields
 * - Remember me checkbox
 * - Forgot password link
 * - Sign In button
 * - Social login options (Google, Apple)
 * - Link to sign up for new users
 * 
 * Fully responsive for mobile and desktop.
 */
'use client';

import { useState } from 'react';
import InputField from './InputField';
import SocialLoginButtons from './SocialLoginButtons';

interface SignInFormProps {
  formData: {
    email: string;
    password: string;
    rememberMe: boolean;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SignInForm({ formData, onInputChange, onSubmit }: SignInFormProps) {
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
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
        <p className="text-sm sm:text-base text-gray-600">Sign in with your email or social accounts</p>
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

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={onInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span>Remember me</span>
        </label>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </div>

      {/* Sign In Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
      >
        Sign In
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4 my-4 sm:my-6">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs sm:text-sm text-gray-500">Or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Social Login Buttons */}
      <SocialLoginButtons />

      {/* Sign Up Link */}
      <div className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
        Don't have account?{' '}
        <a href="/" className="text-blue-600 hover:underline font-medium">Sign Up</a>
      </div>
    </form>
  );
}

