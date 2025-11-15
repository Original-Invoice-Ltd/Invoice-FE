/**
 * PasswordUpdatedSuccess Component
 * 
 * Final screen of the forgot password flow:
 * - Success message
 * - Sign In button
 * 
 * Fully responsive for mobile and desktop.
 */
'use client';

interface PasswordUpdatedSuccessProps {
  onSignIn: () => void;
}

export default function PasswordUpdatedSuccess({ onSignIn }: PasswordUpdatedSuccessProps) {
  return (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Password updated successful</h2>
        <p className="text-sm sm:text-base text-gray-600">
          Password changed successfully. You may now sign in with your new password
        </p>
      </div>

      {/* Sign In Button */}
      <button
        onClick={onSignIn}
        className="w-full bg-[#0B62F6] text-white py-3 rounded-lg font-semibold hover:bg-[#0954d4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B62F6] focus:ring-offset-2 text-sm sm:text-base"
      >
        Sign In
      </button>
    </div>
  );
}

