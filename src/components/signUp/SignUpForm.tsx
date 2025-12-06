'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  const handleSignInClick = () => {
    router.push('/signIn');
  };

  return (
    <div className="w-full max-w-[470px] mx-auto flex flex-col gap-[16px]">
      {/* Header */}
      <div className="text-center mb-2 relative">
        <h2 className="text-[24px] font-medium text-[#000000] font-['Inter_Tight'] mb-2">
          Sign Up
        </h2>
        {/* Logo positioned between heading and subtitle on mobile */}
        <div className="flex justify-center my-2 lg:hidden">
          <img
            src="/assets/header logo.svg"
            alt="Original Invoice Logo"
            className="h-[40px] w-auto object-contain"
          />
        </div>
        <p className="text-[16px] text-[#666666] font-['Inter_Tight']">
          Sign in with your email or social accounts
        </p>
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-[14px] font-medium text-[#000000] font-['Inter_Tight']">
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={onInputChange}
            className="w-full h-[48px] rounded-lg pl-4 pr-12 border border-[#E5E5E5] 
              bg-white text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-[#2F80ED] font-['Inter_Tight']"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <MailIcon width={20} height={20} />
          </div>
        </div>
      </div>

      {/* Password Input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-[14px] font-medium text-[#000000] font-['Inter_Tight']">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={onInputChange}
            className="w-full h-[48px] rounded-lg pl-4 pr-12 border border-[#E5E5E5] 
              bg-white text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-[#2F80ED] font-['Inter_Tight']"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5C5.63636 5 2 12 2 12C2 12 5.63636 19 12 19C18.3636 19 22 12 22 12C22 12 18.3636 5 12 5Z" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <PasswordIcon width={19} height={16} />
            )}
          </button>
        </div>
      </div>

      {/* Full Name Input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="fullname" className="text-[14px] font-medium text-[#000000] font-['Inter_Tight']">
          Full Name
        </label>
        <div className="relative">
          <input
            id="fullname"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            onChange={onInputChange}
            className="w-full h-[48px] rounded-lg pl-4 pr-12 border border-[#E5E5E5] 
              bg-white text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-[#2F80ED] font-['Inter_Tight']"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <UserIcon width={14} height={17} />
          </div>
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          className="w-5 h-5 mt-0.5 rounded border border-[#E5E5E5] bg-white"
        />
        <label htmlFor="terms" className="text-[13px] text-[#666666] font-['Inter_Tight'] leading-relaxed">
          By creating an account means you agree to the{' '}
          <span className="text-[#2F80ED]">Terms and Conditions</span>, and our{' '}
          <span className="text-[#2F80ED]">Privacy Policy</span>
        </label>
      </div>

      {/* Sign Up Button */}
      <button
        type="submit"
        onClick={onSubmit}
        className="w-full h-[48px] rounded-lg bg-[#2F80ED] text-white text-[16px] 
          font-medium font-['Inter_Tight'] hover:bg-[#2670d4] transition-colors"
      >
        Sign Up
      </button>

      {/* Divider with lines */}
      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-[1px] bg-[#E5E5E5]"></div>
        <span className="text-[16px] font-semibold text-[#333333] font-['Inter_Tight']">Or</span>
        <div className="flex-1 h-[1px] bg-[#E5E5E5]"></div>
      </div>

      {/* Social Login Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="w-full sm:flex-1 h-[48px] rounded-lg border border-[#E5E5E5] bg-white 
          flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <GoogleIcon width={20} height={20} />
          <span className="text-[14px] font-medium text-[#000000] font-['Inter_Tight']">
            Continue with Google
          </span>
        </button>
        
        <button className="w-full sm:flex-1 h-[48px] rounded-lg border border-[#E5E5E5] bg-white 
          flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <AppleIcon width={20} height={20} />
          <span className="text-[14px] font-medium text-[#000000] font-['Inter_Tight']">
            Continue with Apple
          </span>
        </button>
      </div>

      {/* Sign In Link */}
      <div className="text-center text-[14px] font-['Inter_Tight']">
        <span className="text-[#666666]">Have an account? </span>
        <span 
          onClick={handleSignInClick}
          className="text-[#2F80ED] font-medium cursor-pointer hover:underline"
        >
          Sign In
        </span>
      </div>
    </div>
  );
}

