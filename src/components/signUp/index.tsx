/**
 * SignUp Component (Main Container)
 * 
 * Main component that orchestrates the three-screen signup flow:
 * 1. Sign Up screen - Email, password, and social login
 * 2. Setup Account screen - Full name, business name, and category
 * 3. OTP Verification screen - Email verification with OTP
 * 
 * Manages state and screen transitions between the forms.
 * Fully responsive for mobile and desktop devices.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import LeftIllustrationPanel from './LeftIllustrationPanel';
import SignUpForm from './SignUpForm';
import SetupAccountForm from './SetupAccountForm';
import OTPVerificationForm from './OTPVerificationForm';
import { ApiClient } from '@/lib/api';

type Screen = 'signup' | 'setup' | 'otp';

export default function SignUp() {
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState<Screen>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    businessName: '',
    businessCategory: '',
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentScreen('setup');
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Register user with backend
      const response = await ApiClient.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        businessName: formData.businessName,
        businessCategory: formData.businessCategory,
      });

      if (response.success) {
        // Move to OTP verification screen
        setCurrentScreen('otp');
      } else {
        setError(response.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await ApiClient.verifyOTP(formData.email, otp);

      if (response.success) {
        // Redirect to dashboard on successful verification
        router.push('/dashboard');
      } else {
        setError(response.error || 'Invalid OTP. Please try again.');
        return false;
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('OTP verification error:', err);
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await ApiClient.resendOTP(formData.email);

      if (!response.success) {
        setError(response.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] min-h-screen lg:h-[1024px] bg-[#FFFFFF] flex flex-col lg:flex-row gap-0">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <LeftIllustrationPanel />
      </div>

      {/* Right Side - Form Section */}
      <div className="relative w-full lg:w-1/2 flex flex-col items-center px-4 sm:px-8 py-8 lg:justify-center"> 
        {/* Logo - top-left on desktop only */}
        <div className="hidden lg:block lg:absolute lg:top-8 lg:left-8">
          <Logo />
        </div>
        
        {/* Form Container */}
        <div className="w-full max-w-[470px]">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Conditional Rendering: Sign Up, Setup Account, or OTP Verification Form */}
          {currentScreen === 'signup' ? (
            <SignUpForm
              formData={{
                email: formData.email,
                password: formData.password,
                agreeToTerms: formData.agreeToTerms,
              }}
              onInputChange={handleInputChange}
              onSubmit={handleSignUp}
            />
          ) : currentScreen === 'setup' ? (
            <SetupAccountForm
              formData={{
                fullName: formData.fullName,
                businessName: formData.businessName,
                businessCategory: formData.businessCategory,
              }}
              email={formData.email}
              onInputChange={handleInputChange}
              onSubmit={handleSetup}
              loading={loading}
            />
          ) : (
            <OTPVerificationForm
              email={formData.email}
              onOTPComplete={handleOTPVerification}
              onResendOTP={handleResendOTP}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

