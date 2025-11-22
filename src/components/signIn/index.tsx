'use client';

import { useState } from 'react';
import LeftIllustrationPanel from '../signUp/LeftIllustrationPanel';
import SignInForm from './SignInForm';
import Image from "next/image";
import invoiceLogo from './../../../public/assets/invoice logo.svg';

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
    <div className="min-h-screen bg-gray-100 p-[16px] flex flex-col lg:flex-row">
      {/* Left Side - Illustration Panel (Desktop only) */}
      <LeftIllustrationPanel />

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center">
            <Image src={invoiceLogo} alt={'invoice logo'} />
            <p className="text-[#000000] font-bold text-[26px]">Original Invoice</p>
          </div>

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

