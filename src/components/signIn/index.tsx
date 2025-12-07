'use client';

import { useState } from 'react';
import Logo from '../signUp/Logo';
import LeftIllustrationPanel from '../signUp/LeftIllustrationPanel';
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
    <div className="max-w-[1440px] min-h-screen lg:h-[1024px] bg-[#FFFFFF] flex flex-col lg:flex-row gap-0">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
        <LeftIllustrationPanel />
      </div>

      {/* Right Side - Form Section */}
      <div className="relative w-full lg:w-1/2 flex flex-col items-center px-4 sm:px-8 py-8 lg:justify-center"> 
        {/* Logo - top-left on desktop, hidden on mobile (shown in form) */}
        <div className="hidden lg:block lg:absolute lg:top-8 lg:left-8">
          <Logo />
        </div>
        
        {/* Form Container */}
        <div className="w-full max-w-[470px]">
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

