'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../signUp/Logo';
import LeftIllustrationPanel from '../signUp/LeftIllustrationPanel';
import SignInForm from './SignInForm';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { ApiClient } from '@/lib/api';

export default function SignIn() {
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || formData.email.trim() === '') {
      showError('Invalid credentials provided');
      return;
    }

    if (!ApiClient.isValidEmail(formData.email)) {
      showError('Invalid credentials provided');
      return;
    }

    if (!formData.password || formData.password.trim() === '') {
      showError('Invalid credentials provided');
      return;
    }

    if (formData.password.length < 6) {
      showError('Invalid credentials provided');
      return;
    }

    setLoading(true);

    try {
      const response = await ApiClient.login(formData.email, formData.password);

      if (response.status === 200) {
        // Show success message and redirect to dashboard
        showSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          router.push('/dashboard/overview');
        }, 1500);
      } else {
        showError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      showError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen max-h-screen bg-[#FFFFFF] flex flex-col md:flex-row">
      {/* Left Panel - Hidden on mobile, shown on md and lg */}
      <div className="hidden md:flex md:w-1/2 h-full ">
        <LeftIllustrationPanel />
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full md:w-1/2 h-full flex flex-col px-4 sm:px-8 md:px-6 lg:px-12 overflow-hidden"> 
        {/* Logo - top-left on desktop, hidden on mobile (shown in form) */}
        <div className="hidden md:block pt-6 md:pt-8 lg:pt-7">
          <Logo />
        </div>
        
        {/* Form Container - scrollable with hidden scrollbar */}
        <div className="flex-1 overflow-y-auto flex items-start md:items-center justify-center pt-4 md:pt-0 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full max-w-[470px] py-4">
          {/* Sign In Form */}
          <SignInForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSignIn}
            loading={loading}
          />
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

