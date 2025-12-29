/**
 * SignUp Component (Main Container)
 * 
 * Main component that orchestrates the two-screen signup flow:
 * 1. Sign Up screen - Email, password, full name, and social login
 * 2. OTP Verification screen - Email verification with OTP
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
import OTPVerificationForm from './OTPVerificationForm';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { ApiClient } from '@/lib/api';

type Screen = 'signup' | 'otp';

export default function SignUp() {
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [currentScreen, setCurrentScreen] = useState<Screen>('signup');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Register user with backend
      const response = await ApiClient.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      if (response.success) {
        // Show success message and move to OTP verification screen
        showSuccess('Registration successful! Please check your email for verification code.');
        setCurrentScreen('otp');
      } else {
        // Handle different error types
        let errorMessage = 'Registration failed. Please try again.';
        
        if (response.error) {
          // Try to parse JSON error if it's a string
          if (typeof response.error === 'string') {
            try {
              // Check if it's a JSON string that starts with unexpected token
              if (response.error.includes('Unexpected token') || response.error.includes('user exist')) {
                errorMessage = 'An account with this email already exists. Please sign in instead.';
              } else {
                errorMessage = response.error;
              }
            } catch {
              errorMessage = response.error;
            }
          } else {
            errorMessage = response.error;
          }
        }
        
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      showError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async (otp: string) => {
    setLoading(true);

    try {
      const response = await ApiClient.verifyOTP(formData.email, otp);

      if (response.success) {
        // Show success message and redirect to dashboard
        showSuccess('Email verified successfully! Welcome to your dashboard.');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        const errorMessage = response.error || 'Invalid OTP. Please try again.';
        showError(errorMessage);
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      showError(errorMessage);
      console.error('OTP verification error:', err);
      return false;
    } finally {
      setLoading(false);
    }
    return true;
  };

  const handleResendOTP = async () => {
    setLoading(true);

    try {
      const response = await ApiClient.resendOTP(formData.email);

      if (response.success) {
        showSuccess('OTP sent successfully! Please check your email.');
      } else {
        const errorMessage = response.error || 'Failed to resend OTP. Please try again.';
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      showError(errorMessage);
      console.error('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen max-h-screen bg-[#FFFFFF] flex flex-col md:flex-row">
      {/* Left Panel - Hidden on mobile, shown on md and lg */}
      <div className="hidden md:flex md:w-1/2 h-full">
        <LeftIllustrationPanel />
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2 h-full flex flex-col px-4 sm:px-8 md:px-6 lg:px-12 overflow-hidden"> 
        {/* Logo - top-left on desktop only */}
        <div className="hidden md:block pt-6 md:pt-8 lg:pt-6 lg:mb-4">
          <Logo />
        </div>
        
        {/* Form Container - scrollable with hidden scrollbar */}
        <div className="flex-1 overflow-y-auto flex items-start md:items-center justify-center pt-4 md:pt-0 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full max-w-[470px] py-4">
          {/* Conditional Rendering: Sign Up or OTP Verification Form */}
          {currentScreen === 'signup' ? (
            <SignUpForm
              formData={{
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                agreeToTerms: formData.agreeToTerms,
              }}
              onInputChange={handleInputChange}
              onSubmit={handleSignUp}
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

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}

