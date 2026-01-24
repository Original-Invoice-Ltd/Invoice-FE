/**
 * ForgotPassword Component (Main Container)
 * 
 * Main component that orchestrates the forgot password flow:
 * 1. Forgot Password screen - Email input
 * 2. Verify Code screen - 4-digit code input
 * 3. Create New Password screen - Password and confirm password
 * 4. Password Updated Success screen - Success message
 * 
 * Manages state and screen transitions between all forms.
 * Fully responsive for mobile and desktop devices.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../signUp/Logo';
import LeftIllustrationPanel from '../signUp/LeftIllustrationPanel';
import ForgotPasswordForm from './ForgotPasswordForm';
import VerifyCodeForm from './VerifyCodeForm';
import CreateNewPasswordForm from './CreateNewPasswordForm';
import PasswordUpdatedSuccess from './PasswordUpdatedSuccess';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { ApiClient } from '@/lib/api';

type Screen = 'forgot-password' | 'verify-code' | 'create-password' | 'success';

export default function ForgotPassword() {
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [currentScreen, setCurrentScreen] = useState<Screen>('forgot-password');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ApiClient.forgotPassword(email);

      if (response.success) {
        showSuccess('Password reset code sent to your email!');
        setCurrentScreen('verify-code');
      } else {
        showError(response.error || 'Failed to send reset code. Please try again.');
      }
    } catch (err) {
      showError('An unexpected error occurred. Please try again.');
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeComplete = async (code: string) => {
    setLoading(true);
    setVerificationCode(code);

    try {
      const response = await ApiClient.verifyPasswordResetOTP(email, code);

      if (response.success) {
        showSuccess('Code verified successfully!');
        setCurrentScreen('create-password');
      } else {
        showError(response.error || 'Invalid code. Please try again.');
      }
    } catch (err) {
      showError('An unexpected error occurred. Please try again.');
      console.error('Verify code error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);

    try {
      const response = await ApiClient.forgotPassword(email);

      if (response.success) {
        showSuccess('Reset code resent to your email!');
      } else {
        showError(response.error || 'Failed to resend code. Please try again.');
      }
    } catch (err) {
      showError('An unexpected error occurred. Please try again.');
      console.error('Resend code error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (newPassword: string, newConfirmPassword: string) => {
    setPassword(newPassword);
    setConfirmPassword(newConfirmPassword);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await ApiClient.resetPasswordWithOTP(email, verificationCode, password);

      if (response.success) {
        showSuccess('Password reset successfully!');
        setCurrentScreen('success');
      } else {
        showError(response.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      showError('An unexpected error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push('/signIn');
  };

  const handleGoBack = () => {
    if (currentScreen === 'verify-code') {
      setCurrentScreen('forgot-password');
    } else if (currentScreen === 'create-password') {
      setCurrentScreen('verify-code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Left Side - Illustration Panel (Desktop only) */}
      <LeftIllustrationPanel />

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Logo />

          {/* Conditional Rendering: Current Screen */}
          {currentScreen === 'forgot-password' && (
            <ForgotPasswordForm
              email={email}
              onEmailChange={(e) => setEmail(e.target.value)}
              onSubmit={handleEmailSubmit}
            />
          )}

          {currentScreen === 'verify-code' && (
            <VerifyCodeForm
              email={email}
              onCodeComplete={handleCodeComplete}
              onResendCode={handleResendCode}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'create-password' && (
            <CreateNewPasswordForm
              email={email}
              onPasswordChange={handlePasswordChange}
              onSubmit={handlePasswordSubmit}
              onGoBack={handleGoBack}
            />
          )}

          {currentScreen === 'success' && (
            <PasswordUpdatedSuccess onSignIn={handleSignIn} />
          )}
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

