'use client';

import { useState } from 'react';
import { Validator } from '@/lib/validation';
import PhoneIcon from '../signUp/phoneIcon';

interface PhoneCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
  onSkipToSignIn: () => void; // New prop for existing users
  provider: 'google' | 'apple';
  loading?: boolean;
  showPhoneField?: boolean; // New prop to control phone field visibility
}

export default function PhoneCollectionModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onSkipToSignIn,
  provider,
  loading = false,
  showPhoneField = true
}: PhoneCollectionModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showPhoneField) {
      // Validate phone number for new users
      const validation = Validator.phone(phoneNumber);
      if (!validation.isValid) {
        setError(validation.error || 'Invalid phone number');
        return;
      }
      setError('');
      onSubmit(phoneNumber);
    } else {
      // For existing users, proceed without phone
      onSubmit('');
    }
  };

  const handleSkip = () => {
    if (showPhoneField) {
      onSubmit(''); // Skip phone collection for new users
    } else {
      onSkipToSignIn(); // Go to sign-in for existing users
    }
  };

  if (!isOpen) return null;

  const providerName = provider === 'google' ? 'Google' : 'Apple';

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Complete Your {providerName} Registration
          </h2>
          <p className="text-sm text-gray-600">
            {showPhoneField 
              ? 'Please provide your phone number to complete the registration process'
              : 'It looks like you already have an account. Would you like to sign in instead?'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {showPhoneField && (
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon width={20} height={20} />
                </div>
              </div>
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>
          )}

          <div className="flex flex-col space-y-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Continuing...
                </div>
              ) : (
                showPhoneField ? `Continue with ${providerName}` : `Sign in with ${providerName}`
              )}
            </button>
            
            {showPhoneField ? (
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Skip for now
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Back to Sign In
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}