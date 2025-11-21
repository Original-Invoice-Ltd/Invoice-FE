'use client';

import MailIcon from './mailIcon';

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
  // Business name icon
  const businessIcon = <MailIcon width={20} height={20} />;

  return (
    <form 
      onSubmit={onSubmit} 
      className="w-full max-w-[518px] mx-auto pt-8 px-6 pb-8 flex flex-col gap-8"
    >
      {/* Header */}
      <div>
        <h2 className="w-[470px] h-[29px] rotate-0 opacity-100 font-['Inter_Tight'] font-medium text-[24px] leading-[120%] tracking-[0] text-center text-[#000000] mb-2">
          Setup your account
        </h2>
        <p className="w-[470px] h-[25px] rotate-0 opacity-100 font-['Inter_Tight'] font-normal text-[18px] leading-[140%] tracking-[0.01em] text-center text-[#444444]">
          Set up your company's account
        </p>
      </div>

      {/* Business Name and Category Container */}
      <div className="w-[470px] h-[164px] rotate-0 opacity-100 flex flex-col gap-[24px]">
        {/* Business Name Input */}
        <div className="w-[470px] h-[70px] rotate-0 opacity-100 flex flex-col gap-[8px]">
          <label 
            htmlFor="businessName"
            className="font-['Inter_Tight'] font-medium text-[16px] leading-[140%] tracking-[0.01em] text-[#000000]"
          >
            Business Name
          </label>
          
          <div className="relative w-[470px] h-[40px] flex items-center justify-between">
            <input
              id="businessName"
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={onInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
              placeholder="Enter business name"
              className="w-[470px] h-[40px] rotate-0 opacity-100 rounded-lg pt-[8px] pr-[10px] pb-[8px] pl-[12px] border border-[#E5E5E5] bg-[#FFFFFF] font-['Inter_Tight'] text-[16px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
              required
            />
            
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center">
              {businessIcon}
            </div>
          </div>
        </div>

        {/* Business Category Dropdown */}
        <div className="w-[470px] h-[70px] rotate-0 opacity-100 flex flex-col gap-[8px]">
          <label 
            htmlFor="businessCategory"
            className="font-['Inter_Tight'] font-medium text-[16px] leading-[140%] tracking-[0.01em] text-[#000000]"
          >
            Business Category
          </label>
          
          <div className="relative w-[470px] h-[40px]">
            <select
              id="businessCategory"
              name="businessCategory"
              value={formData.businessCategory}
              onChange={onInputChange}
              className="w-[470px] h-[40px] rotate-0 opacity-100 rounded-lg pt-[8px] pr-[10px] pb-[8px] pl-[12px] border border-[#E5E5E5] bg-[#FFFFFF] font-['Inter_Tight'] text-[16px] appearance-none focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
              required
            >
              <option value="">Select Business category</option>
              <option value="freelancers">Freelancers</option>
              <option value="business-owner">Business Owner</option>
              <option value="agency">Agency</option>
              <option value="vendor">Vendor</option>
              <option value="service-providers">Service providers</option>
              <option value="accountant">Accountant</option>
              <option value="tax-consultants">Tax consultants</option>
            </select>
            
            <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-[20px] h-[20px]" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#333436" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <button
        type="submit"
        className="w-[470px] h-[46px] rotate-0 opacity-100 rounded-md pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[8px] bg-[#2F80ED] text-white font-['Inter_Tight'] font-medium text-[16px] flex items-center justify-center focus:outline-none hover:bg-[#2670d4] transition-none duration-0"
      >
        Get Started
      </button>
    </form>
  );
}

