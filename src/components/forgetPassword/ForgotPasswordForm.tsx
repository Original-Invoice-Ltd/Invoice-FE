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

import InputField from './InputField';

interface ForgotPasswordFormProps {
  email: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ForgotPasswordForm({ email, onEmailChange, onSubmit }: ForgotPasswordFormProps) {
  // Email icon
  const emailIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reset your password</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Enter your email, we'll send you a code to reset your password
        </p>
      </div>

      {/* Email Input */}
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={email}
        onChange={onEmailChange}
        placeholder="Enter your email address"
        icon={emailIcon}
        required
      />

      {/* Continue Button */}
      <button
        type="submit"
        className="w-full bg-[#0B62F6] text-white py-3 rounded-lg font-semibold hover:bg-[#0954d4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B62F6] focus:ring-offset-2 text-sm sm:text-base"
      >
        Continue
      </button>
    </form>
  );
}

