'use client';

import Logo from './Logo';

interface SetupAccountFormProps {
  formData: {
    fullName: string;
    businessName: string;
    businessCategory: string;
  };
  email: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export default function SetupAccountForm({ 
  formData, 
  email, 
  onInputChange, 
  onSubmit,
  loading = false 
}: SetupAccountFormProps) {

  return (
    <form onSubmit={onSubmit} className="w-full max-w-[470px] mx-auto flex flex-col gap-[24px]">
      {/* Logo - Centered with spacing (mobile only) */}
      <div className="flex justify-center mb-8 lg:hidden">
        <Logo/>
      </div>
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-[24px] font-medium text-[#000000] font-['Inter_Tight'] mb-3">
          Setup Your Account
        </h2>
        <p className="text-[16px] text-[#666666] font-['Inter_Tight']">
          Complete your profile to get started
        </p>
      </div>

      {/* Full Name Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="fullName" className="text-[14px] font-medium text-[#333436] font-['Inter_Tight']">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={onInputChange}
          placeholder="Enter your full name"
          required
          disabled={loading}
          className="w-full h-[48px] px-4 border border-[#E5E5E5] rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Business Name Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="businessName" className="text-[14px] font-medium text-[#333436] font-['Inter_Tight']">
          Business Name
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={onInputChange}
          placeholder="Enter your business name"
          disabled={loading}
          className="w-full h-[48px] px-4 border border-[#E5E5E5] rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Business Category Select */}
      <div className="flex flex-col gap-2">
        <label htmlFor="businessCategory" className="text-[14px] font-medium text-[#333436] font-['Inter_Tight']">
          Business Category
        </label>
        <select
          id="businessCategory"
          name="businessCategory"
          value={formData.businessCategory}
          onChange={onInputChange}
          disabled={loading}
          className="w-full h-[48px] px-4 border border-[#E5E5E5] rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent
            disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <option value="">Select a category</option>
          <option value="technology">Technology</option>
          <option value="retail">Retail</option>
          <option value="services">Services</option>
          <option value="consulting">Consulting</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        disabled={loading || !formData.fullName}
        className="w-full h-[48px] rounded-lg bg-[#2F80ED] text-white text-[16px] 
          font-medium font-['Inter_Tight'] hover:bg-[#2670d4] transition-colors
          disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Account...' : 'Continue'}
      </button>
    </form>
  );
}

