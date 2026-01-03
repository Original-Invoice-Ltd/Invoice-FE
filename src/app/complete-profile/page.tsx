'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiClient } from '@/lib/api';
import { Validator } from '@/lib/validation';
import PhoneIcon from '@/components/signUp/phoneIcon';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

function CompleteProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get('step');
  const { toast, showSuccess, showError, hideToast } = useToast();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user info to check current state
    const fetchUserInfo = async () => {
      try {
        const response = await ApiClient.get('/api/users/me');
        if (response.status === 200 && response.data) {
          setUserEmail(response.data.email);
          // If user already has phone number, redirect to dashboard
          if (response.data.phoneNumber) {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        router.push('/signIn');
      }
    };

    if (step === 'phone') {
      fetchUserInfo();
    } else {
      router.push('/dashboard');
    }
  }, [step, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    const validation = Validator.phone(phoneNumber);
    if (!validation.isValid) {
      showError(validation.error || 'Invalid phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await ApiClient.put('/api/users/update-phone', {
        email: userEmail,
        phoneNumber: phoneNumber
      });

      if (response.status === 200) {
        showSuccess('Phone number updated successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        showError(response.error || 'Failed to update phone number');
      }
    } catch (error: any) {
      console.error('Phone update error:', error);
      showError(error.response?.data?.message || 'Failed to update phone number');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  if (step !== 'phone') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please provide your phone number to complete your registration
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon width={20} height={20} />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Continue'}
              </button>
              
              <button
                type="button"
                onClick={handleSkip}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
}

export default function CompleteProfile() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteProfileContent />
    </Suspense>
  );
}