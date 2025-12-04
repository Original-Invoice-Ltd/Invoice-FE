'use client';

import { useState } from 'react';
import MailIcon from "./mailIcon";
import PasswordIcon from "./passwordIcon";
import UserIcon from "./userIcon";
import GoogleIcon from "./googleIcon";
import AppleIcon from "./appleIcon";

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


  return (

    <div
      className="w-full max-w-[518px] h-[745px] mx-auto border border-red-500 py-[32px] px-[24px] flex flex-col gap-[32px]"
    >
      <div className="w-[470px] h-[416px] rotate-0 border border-green-500 opacity-100 gap-[32px]">
        <div className="w-full max-w-[470px] h-[416px] gap-[32px]    mx-auto">
          <div
            className="w-full text-[#000000] font-['Inter_Tight'] font-medium 
            text-xl sm:text-2xl leading-[120%] tracking-[0] text-center mb-3"
          >
            Sign Up
          </div>
          <div className="w-full font-['Inter_Tight'] font-normal text-base sm:text-lg leading-[140%] tracking-[0.01em] text-center text-[#444444]">
            Sign in with your email or social accounts
          </div>


          <div className="w-[470px] opacity-100 rotate-0 flex flex-col">
            {/* Label */}
            <label
              htmlFor="mail-01"
              className="w-[102px] h-[22px] rotate-0 opacity-100 
              flex items-center gap-1 text-sm font-medium text-[#444444] font-['Inter_Tight']"
            >
              Email address
            </label>

            {/* Input wrapper */}
            <div className="h-[60px] relative flex items-center">
              <input
                id="mail-01"
                name="mail-01"
                type="email"
                placeholder="Enter your email address"
                className="w-[440px] h-[40px] rotate-0 opacity-100 
                rounded-lg pl-[12px] pr-[40px] py-[8px] 
                border border-[#E5E5E5] bg-white text-[16px] 
                placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-[#2F80ED] focus:border-transparent font-['Inter_Tight']"
              />

              {/* Right-side icon */}
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center">
                <MailIcon width={20} height={20} />
              </div>
            </div>
          </div>

          <div className="w-[470px] opacity-100 rotate-0 flex flex-col">
            {/* Label */}
            <label
              htmlFor="password-01"
              className="w-[102px] h-[22px] rotate-0 opacity-100 
              flex items-center gap-1 text-sm font-medium text-[#444444] font-['Inter_Tight']"
            >
              Password
            </label>

            {/* Input wrapper */}
            <div className="h-[60px] relative flex items-center">
              <input
                id="password-01"
                name="password-01"
                type="password"
                placeholder="Enter your password"
                className="w-[440px] h-[40px] rotate-0 opacity-100 
                rounded-lg pl-[12px] pr-[40px] py-[8px] 
                border border-[#E5E5E5] bg-white text-[16px] 
                placeholder-gray-400 focus:outline-none focus:ring-2 
                focus:ring-[#2F80ED] focus:border-transparent font-['Inter_Tight']"
              />

              {/* Right-side icon */}
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center">
                <PasswordIcon width={19} height={16} />
              </div>
            </div>
          </div>

          <div className="w-[470px] opacity-100 rotate-0 flex flex-col">
            {/* Label */}
            <label
              htmlFor="fullname-01"
              className="w-[102px] h-[22px] rotate-0 opacity-100 
              flex items-center gap-1 text-sm font-medium text-[#444444] font-['Inter_Tight']"
            >
              Full Name
            </label>

            {/* Input wrapper */}
            <div className="h-[60px] relative flex items-center">
              <input
                id="fullname-01"
                name="fullname-01"
                type="text"
                placeholder="Enter your full name"
                className="w-[470px] h-[40px] rotate-0 opacity-100 
                rounded-lg pl-[12px] pr-[40px] py-[8px] border border-[#E5E5E5] 
                bg-white text-[16px] placeholder-gray-400 focus:outline-none 
                focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent font-['Inter_Tight']"
              />

              {/* Right-side icon */}
              <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center">
                <UserIcon width={14} height={17} />
              </div>
            </div>
          </div>
            <div className="w-[470px] h-[40px] flex items-center justify-between rotate-0 opacity-100">
  {/* Checkbox */}
  <input
    type="checkbox"
    id="terms"
    name="terms"
    className="w-[20px] h-[20px] rounded-sm 
    border border-[#E5E5E5] rotate-0 opacity-100 bg-[#FFFFFF]"
  />

  {/* Text */}
  <label htmlFor="terms" className="ml-2 text-[16px] text-gray-700 font-['Inter_Tight']">
    By creating an account you agree to the <span className="text-[#2F80ED]">
      Terms and Conditions</span>, and our <span className="text-[#2F80ED]">Privacy Policy</span>
  </label>
          </div>

        </div>

      </div>
      <div className="flex justify-center">
  <button
    type="submit"
    className="w-[470px] h-[46px] rotate-0 opacity-100 rounded-md px-[16px] 
      py-[12px] flex items-center justify-center bg-[#2F80ED] 
      text-white text-[16px] font-medium focus:outline-none hover:bg-[#2670d4] transition-colors"
    onClick={onSubmit}
  >
    Sign Up
  </button>
      </div>
      
      
      <div className="w-[470px] h-[44px] rotate-0 opacity-100 flex gap-4">
  {/* Left child - Google */}
  <button
    className="w-[227px] h-[44px] rotate-0 opacity-100 rounded-[12px]
      pt-[10px] pr-[16px] pb-[10px] pl-[16px] flex items-center gap-[8px] border border-[#E5E5E5]
      bg-white"
  >
    <div className=" w-[24px] h-[24px]">
      <GoogleIcon width={24} height={24} />
    </div>
    <span className="w-[146px] h-[22px] rotate-0 opacity-100 font-['Inter_Tight'] 
    font-medium text-[16px] leading-[140%] tracking-[0.01em] text-[#000000]">
      Continue with Google
    </span>
  </button>
  
  <button
    className="w-[227px] h-[44px] rotate-0 opacity-100 rounded-[12px]
      pt-[10px] pr-[16px] pb-[10px] pl-[16px] flex items-center gap-[8px] border
      border-[#E5E5E5]
      bg-white"
  >
    <div className=" w-[24px] h-[24px]">
      <AppleIcon width={24} height={24} />
    </div>
    <span className="w-[146px] h-[22px] rotate-0 opacity-100 
    font-['Inter_Tight'] font-medium text-[16px] leading-[140%] 
    tracking-[0.01em] text-[#000000]">
      Continue with Apple
    </span>
  </button>
      </div>

      <div className="w-[470px] flex justify-center">
        <div className="h-[25px] rotate-0 opacity-100 flex items-center justify-center 
          text-[#222222] font-Roboto font-semibold text-[20px] leading-[120%] whitespace-nowrap
        "
        >
          Have an account? <span className="text-[#2F80ED] ml-1">Sign In</span>
        </div>
      </div>

    </div>

  );
}

