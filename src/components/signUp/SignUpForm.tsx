'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MailIcon from "./mailIcon";
import PasswordIcon from "./passwordIcon";
import PhoneIcon from "./phoneIcon";
import UserIcon from "./userIcon";
import GoogleIcon from "./googleIcon";
import AppleIcon from "./appleIcon";
import Logo from './Logo';
import PhoneCollectionModal from '@/components/auth/PhoneCollectionModal';
import { Validator } from '@/lib/validation';

interface SignUpFormProps {
  formData: {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    agreeToTerms: boolean;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
}

export default function SignUpForm({ formData, onInputChange, onSubmit, loading = false }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'apple' | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const router = useRouter();

  const handleSignInClick = () => {
    router.push('/signIn');
  };

  const validateField = (name: string, value: string) => {
    let validation;
    switch (name) {
      case 'email':
        validation = Validator.email(value);
        break;
      case 'password':
        validation = Validator.password(value);
        break;
      case 'fullName':
        validation = Validator.fullName(value);
        break;
      case 'phoneNumber':
        validation = Validator.phone(value);
        break;
      default:
        validation = { isValid: true };
    }

    setErrors(prev => ({
      ...prev,
      [name]: validation.isValid ? '' : validation.error || ''
    }));

    return validation.isValid;
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleInputChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onInputChange(e);
    
    // Only validate if field has been touched
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const emailValid = validateField('email', formData.email);
    const passwordValid = validateField('password', formData.password);
    const fullNameValid = validateField('fullName', formData.fullName);
    const phoneValid = validateField('phoneNumber', formData.phoneNumber);
    
    // Check terms agreement
    if (!formData.agreeToTerms) {
      setErrors(prev => ({ ...prev, terms: 'You must agree to the Terms and Conditions' }));
      return;
    } else {
      setErrors(prev => ({ ...prev, terms: '' }));
    }

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
      fullName: true,
      phoneNumber: true,
      terms: true
    });

    // Only submit if all validations pass
    if (emailValid && passwordValid && fullNameValid && phoneValid && formData.agreeToTerms) {
      onSubmit(e);
    }
  };

  const handleOAuthClick = (provider: 'google' | 'apple') => {
    setSelectedProvider(provider);
    setShowPhoneModal(true);
  };

  const handlePhoneSubmit = (phoneNumber: string) => {
    if (!selectedProvider) return;
    
    setOauthLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';
    
    // Create a unique state parameter to track this OAuth flow
    const state = btoa(JSON.stringify({
      phoneNumber: phoneNumber || '',
      timestamp: Date.now(),
      isSignIn: false // Mark this as sign-up flow
    }));
    
    // Redirect to OAuth provider with state parameter
    const oauthUrl = `${apiBaseUrl}/oauth/${selectedProvider}/login?state=${encodeURIComponent(state)}`;
    window.location.href = oauthUrl;
  };

  const handleSkipToSignIn = () => {
    // For sign-up, this shouldn't be called, but handle gracefully
    handlePhoneSubmit('');
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
    setSelectedProvider(null);
    setOauthLoading(false);
  };

  return (
    <div className=" w-full max-w-[470px] mx-auto flex flex-col mt-16 gap-2">
      {/* Logo - Centered with spacing (mobile only) */}
      <div className="flex justify-center mb-4 md:hidden">
        <Logo/>
      </div>
      
      {/* Header */}
      <div className="text-center mb-1">
        <h2 className="text-[24px] font-medium text-[#000000] font-['Inter_Tight'] mb-1">
          Sign Up
        </h2>
    
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
            onChange={handleInputChangeWithValidation}
            onBlur={handleInputBlur}
            className={`w-full h-[38px] rounded-lg pl-4 pr-12 border 
              ${errors.email ? 'border-red-500' : 'border-[#E5E5E5]'} 
              bg-white text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 
              ${errors.email ? 'focus:ring-red-500' : 'focus:ring-[#2F80ED]'} font-['Inter_Tight']`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <MailIcon width={20} height={20} />
          </div>
        </div>
        {errors.email && (
          <span className="text-[12px] text-red-500 font-['Inter_Tight']">{errors.email}</span>
        )}
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
            onChange={handleInputChangeWithValidation}
            onBlur={handleInputBlur}
            className={`w-full h-[38px] rounded-lg pl-4 pr-12 border 
              ${errors.password ? 'border-red-500' : 'border-[#E5E5E5]'} 
              bg-white text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 
              ${errors.password ? 'focus:ring-red-500' : 'focus:ring-[#2F80ED]'} font-['Inter_Tight']`}
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
        {errors.password && (
          <span className="text-[12px] text-red-500 font-['Inter_Tight']">{errors.password}</span>
        )}
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
            value={formData.fullName}
            onChange={handleInputChangeWithValidation}
            onBlur={handleInputBlur}
            className={`w-full h-[38px] rounded-lg pl-4 pr-12 border 
              ${errors.fullName ? 'border-red-500' : 'border-[#E5E5E5]'} 
              bg-white text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 
              ${errors.fullName ? 'focus:ring-red-500' : 'focus:ring-[#2F80ED]'} font-['Inter_Tight']`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <UserIcon width={14} height={17} />
          </div>
        </div>
        {errors.fullName && (
          <span className="text-[12px] text-red-500 font-['Inter_Tight']">{errors.fullName}</span>
        )}
      </div>

      {/* Phone Number Input */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phoneNumber" className="text-[14px] font-medium text-[#000000] font-['Inter_Tight']">
          Phone Number
        </label>
        <div className="relative">
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleInputChangeWithValidation}
            onBlur={handleInputBlur}
            className={`w-full h-[48px] rounded-lg pl-4 pr-12 border 
              ${errors.phoneNumber ? 'border-red-500' : 'border-[#E5E5E5]'} 
              bg-white text-[14px] placeholder-gray-400 focus:outline-none focus:ring-2 
              ${errors.phoneNumber ? 'focus:ring-red-500' : 'focus:ring-[#2F80ED]'} font-['Inter_Tight']`}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <PhoneIcon width={20} height={20} />
          </div>
        </div>
        {errors.phoneNumber && (
          <span className="text-[12px] text-red-500 font-['Inter_Tight']">{errors.phoneNumber}</span>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={onInputChange}
            className="w-5 h-5 mt-0.5 accent-[#2F08ED] rounded border border-[#E5E5E5] bg-white"
          />
          <label htmlFor="terms" className="text-[13px] text-[#666666] font-['Inter_Tight'] leading-relaxed">
            By creating an account means you agree to the{' '}
            <span className="text-[#2F80ED]">Terms and Conditions</span>, and our{' '}
            <span className="text-[#2F80ED]">Privacy Policy</span>
          </label>
        </div>
        {errors.terms && (
          <span className="text-[12px] text-red-500 font-['Inter_Tight']">{errors.terms}</span>
        )}
      </div>

      {/* Sign Up Button */}
      <button
        type="submit"
        onClick={handleFormSubmit}
        disabled={loading}
        className="w-full h-[38px] rounded-lg bg-[#2F80ED] text-white text-[16px] 
          font-medium font-['Inter_Tight'] hover:bg-[#2670d4] transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Creating Account...
          </div>
        ) : (
          'Sign Up'
        )}
      </button>

      {/* Divider with lines */}
      <div className="flex items-center gap-4 my-1">
        <div className="flex-1 h-[1px] bg-[#E5E5E5]"></div>
        <span className="text-[16px] font-semibold text-[#333333] font-['Inter_Tight']">Or</span>
        <div className="flex-1 h-[1px] bg-[#E5E5E5]"></div>
      </div>

      {/* Social Login Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => handleOAuthClick('google')}
          type="button"
          className="w-full sm:flex-1 h-[48px] rounded-lg border border-[#E5E5E5] bg-white 
          flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <GoogleIcon width={20} height={20} />
          <span className="text-[14px] font-medium text-[#000000] font-['Inter_Tight']">
            Continue with Google
          </span>
        </button>
        
        <button 
          onClick={() => handleOAuthClick('apple')}
          type="button"
          className="w-full sm:flex-1 h-[48px] rounded-lg border border-[#E5E5E5] bg-white 
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

      {/* Phone Collection Modal */}
      <PhoneCollectionModal
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        onSubmit={handlePhoneSubmit}
        onSkipToSignIn={handleSkipToSignIn}
        provider={selectedProvider || 'google'}
        loading={oauthLoading}
        showPhoneField={true} // Always show phone field for sign-up
      />
    </div>
  );
}

