/**
 * SocialLoginButtons Component
 * 
 * Displays social authentication options:
 * - Continue with Google button
 * - Continue with Apple button
 * 
 * Both buttons are fully responsive and styled consistently.
 * Includes phone number collection modal for OAuth flows.
 */
import { useState } from 'react';
import GoogleIcon from '../signUp/googleIcon';
import AppleIcon from '../signUp/appleIcon';
import PhoneCollectionModal from '@/components/auth/PhoneCollectionModal';

export default function SocialLoginButtons() {
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'apple' | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleOAuthClick = (provider: 'google' | 'apple') => {
    setSelectedProvider(provider);
    setShowPhoneModal(true);
  };

  const handlePhoneSubmit = (phoneNumber: string) => {
    if (!selectedProvider) return;
    
    setOauthLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';
    
    // Create a unique state parameter to track this OAuth flow
    const state = btoa(JSON.stringify({
      phoneNumber: phoneNumber || '',
      timestamp: Date.now(),
      isSignIn: true // Mark this as sign-in flow
    }));
    
    // Redirect to OAuth provider with state parameter
    const oauthUrl = `${apiBaseUrl}/oauth/${selectedProvider}/login?state=${encodeURIComponent(state)}`;
    window.location.href = oauthUrl;
  };

  const handleSkipToSignIn = () => {
    if (!selectedProvider) return;
    
    setOauthLoading(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';
    
    // Go directly to OAuth without phone number
    const oauthUrl = `${apiBaseUrl}/oauth/${selectedProvider}/login`;
    window.location.href = oauthUrl;
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
    setSelectedProvider(null);
    setOauthLoading(false);
  };

  const handleGoogleLogin = () => handleOAuthClick('google');
  const handleAppleLogin = () => handleOAuthClick('apple');

  return (
    <>
      <div className="w-[470px] h-[44px] rotate-0 opacity-100 flex gap-4">
        {/* Left child - Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-[227px] h-[44px] rotate-0 opacity-100 rounded-[12px]
            pt-[10px] pr-[16px] pb-[10px] pl-[16px] flex items-center gap-[8px] border border-[#E5E5E5]
            bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="relative w-[24px] h-[24px]">
            <GoogleIcon width={24} height={24} />
          </div>
          <span className="w-[146px] h-[22px] rotate-0 opacity-100 font-['Inter_Tight'] font-medium text-[16px] leading-[140%] tracking-[0.01em]">
            Continue with Google
          </span>
        </button>

        {/* Right child - Apple */}
        <button
          type="button"
          onClick={handleAppleLogin}
          className="w-[227px] h-[44px] rotate-0 opacity-100 rounded-[12px]
            pt-[10px] pr-[16px] pb-[10px] pl-[16px] flex items-center gap-[8px] border
            border-[#E5E5E5]
            bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="relative w-[24px] h-[24px]">
            <AppleIcon width={24} height={24} />
          </div>
          <span className="w-[146px] h-[22px] rotate-0 opacity-100 font-['Inter_Tight'] font-medium text-[16px] leading-[140%] tracking-[0.01em]">
            Continue with Apple
          </span>
        </button>
      </div>

      {/* Phone Collection Modal */}
      <PhoneCollectionModal
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        onSubmit={handlePhoneSubmit}
        onSkipToSignIn={handleSkipToSignIn}
        provider={selectedProvider || 'google'}
        loading={oauthLoading}
        showPhoneField={true} // Always show phone field initially, backend will handle existing users
      />
    </>
  );
}

