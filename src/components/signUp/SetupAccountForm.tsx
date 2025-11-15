/**
 * SetupAccountForm Component
 * 
 * Second screen of the signup flow for account setup containing:
 * - Full Name input
 * - Business Name input
 * - Business Category dropdown
 * - Get Started button
 * 
 * Fully responsive for mobile and desktop.
 */
'use client';

import InputField from './InputField';

interface SetupAccountFormProps {
  formData: {
    fullName: string;
    businessName: string;
    businessCategory: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SetupAccountForm({ formData, onInputChange, onSubmit }: SetupAccountFormProps) {
  // User icon for full name
  const userIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  // Business icon for business name
  const businessIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Setup your account</h2>
        <p className="text-sm sm:text-base text-gray-600">Set up your company's account</p>
      </div>

      {/* Full Name Input */}
      <InputField
        label="Full Name"
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={onInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        placeholder="Enter your full name"
        icon={userIcon}
        required
      />

      {/* Business Name Input */}
      <InputField
        label="Business Name"
        type="text"
        name="businessName"
        value={formData.businessName}
        onChange={onInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        placeholder="Enter business name"
        icon={businessIcon}
        required
      />

      {/* Business Category Dropdown */}
      <div>
        <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 mb-2">
          Business Category
        </label>
        <div className="relative">
          <select
            id="businessCategory"
            name="businessCategory"
            value={formData.businessCategory}
            onChange={onInputChange}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-sm sm:text-base"
            required
          >
            <option value="">Select Business category</option>
            <option value="retail">Retail</option>
            <option value="services">Services</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="technology">Technology</option>
            <option value="consulting">Consulting</option>
            <option value="other">Other</option>
          </select>
          <svg 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Get Started Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
      >
        Get Started
      </button>
    </form>
  );
}

