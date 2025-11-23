/**
 * ForgotPassword Component (Main Container)
 * 
 * Main component that orchestrates the forgot password flow:
 * 1. Forgot Password screen - Email input
 * 2. Verify Code screen - 6-digit code input
 * 3. Create New Password screen - Password and confirm password
 * 4. Password Updated Success screen - Success message
 * 
 * Manages state and screen transitions between all forms.
 * Fully responsive for mobile and desktop devices.
 */
'use client';

import { useState } from 'react';
import Logo from '../signUp/Logo';
import LeftIllustrationPanel from '../signUp/LeftIllustrationPanel';
import ForgotPasswordForm from './ForgotPasswordForm';
import VerifyCodeForm from './VerifyCodeForm';
import CreateNewPasswordForm from './CreateNewPasswordForm';
import PasswordUpdatedSuccess from './PasswordUpdatedSuccess';

type Screen = 'forgot-password' | 'verify-code' | 'create-password' | 'success';

export default function ForgotPassword() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('forgot-password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send the email to the backend
    console.log('Sending reset code to:', email);
    setCurrentScreen('verify-code');
  };

  const handleCodeComplete = (code: string) => {
    // In a real app, you would verify the code with the backend
    console.log('Verifying code:', code);
    setCurrentScreen('create-password');
  };

  const handleResendCode = () => {
    // In a real app, you would resend the code
    console.log('Resending code to:', email);
  };

  const handlePasswordChange = (newPassword: string, newConfirmPassword: string) => {
    setPassword(newPassword);
    setConfirmPassword(newConfirmPassword);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    // In a real app, you would send the new password to the backend
    console.log('Updating password for:', email);
    setCurrentScreen('success');
  };

  const handleSignIn = () => {
    // Navigate to sign in page
    window.location.href = '/signIn';
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
    </div>
  );
}

