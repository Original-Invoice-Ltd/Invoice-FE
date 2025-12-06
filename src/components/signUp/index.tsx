/**
 * SignUp Component (Main Container)
 * 
 * Main component that orchestrates the two-screen signup flow:
 * 1. Sign Up screen - Email, password, and social login
 * 2. Setup Account screen - Full name, business name, and category
 * 
 * Manages state and screen transitions between the two forms.
 * Fully responsive for mobile and desktop devices.
 */
'use client';

import { useState } from 'react';
import Logo from './Logo';
import LeftIllustrationPanel from './LeftIllustrationPanel';
import SignUpForm from './SignUpForm';
import SetupAccountForm from './SetupAccountForm';

export default function SignUp() {
  const [currentScreen, setCurrentScreen] = useState<'signup' | 'setup'>('signup');
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

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle account setup submission
    console.log('Account setup:', formData);
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
        {/* Logo - At top on mobile, top-left on desktop */}
        <div className="w-full flex justify-center lg:absolute lg:top-8 lg:left-8 lg:justify-start mb-6 lg:mb-0">
          <Logo />
        </div>
        
        {/* Form Container - Below logo on mobile, centered on desktop */}
        <div className="w-full max-w-[470px] mt-4 lg:mt-0">
          {/* Conditional Rendering: Sign Up or Setup Account Form */}
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
          ) : (
            <SetupAccountForm
              formData={{
                fullName: formData.fullName,
                businessName: formData.businessName,
                businessCategory: formData.businessCategory,
              }}
              email={formData.email}
              onInputChange={handleInputChange}
              onSubmit={handleSetup}
            />
          )}
        </div>
      </div>
    </div>
  );
}

