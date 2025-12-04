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
    <div className="max-w-[1440px] h-[1024px] bg-[#000] flex flex-col lg:flex-row">
      <LeftIllustrationPanel />

      {/* Right Side - Form Section */}
      {/* <div className="w-full lg:w-1/2 bg-white flex items-start justify-center pt-[140px]"> */}
        {/* Form Container with exact specifications */}
        {/* <div 
          className="w-[518px] flex flex-col gap-[32px] pt-[32px] pb-[32px] pl-[24px] pr-[24px]"
        > */}
          {/* Logo */}
          {/* <Logo /> */}

          {/* Conditional Rendering: Sign Up or Setup Account Form */}
          {/* {currentScreen === 'signup' ? (
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
              onInputChange={handleInputChange}
              onSubmit={handleSetup}
            />
          )} */}
        {/* </div>
      </div> */}
    </div>
  );
}

