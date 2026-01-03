/**
 * SignUp Component (Main Container)
 * 
 * Main component that orchestrates the two-screen signup flow:
 * 1. Sign Up screen - Email, password, full name, phone number, and social login
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
    phoneNumber: '',
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
        phoneNumber: formData.phoneNumber
      });

      if (response.status === 201) {
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

      if (response.status === 200) {
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

      if (response.status === 200) {
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
          {/* Conditional Rendering: Sign Up or OTP Verification Form */}
          {currentScreen === 'signup' ? (
            <SignUpForm
              formData={{
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
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

      {/* Toast Notification */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      )}
    </div>
  );
}