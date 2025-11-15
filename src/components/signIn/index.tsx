/**
 * SignIn Component (Main Container)
 * 
 * Main component that displays the sign-in page with:
 * - Left illustration panel (desktop only)
 * - Sign-in form with email/password and social login
 * 
 * Fully responsive for mobile and desktop devices.
 */
'use client';

import { useState } from 'react';
import Logo from './Logo';
import LeftIllustrationPanel from './LeftIllustrationPanel';
import SignInForm from './SignInForm';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-in submission
    console.log('Sign in:', formData);
    // Here you would typically send the data to your backend API
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

          {/* Sign In Form */}
          <SignInForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSignIn}
          />
        </div>
      </div>
    </div>
  );
}

