/**
 * SocialLoginButtons Component
 * 
 * Displays social authentication options:
 * - Continue with Google button
 * - Continue with Apple button
 * 
 * Both buttons are fully responsive and styled consistently.
 */
import GoogleIcon from '../signUp/googleIcon';
import AppleIcon from '../signUp/appleIcon';

export default function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';
    window.location.href = `${apiBaseUrl}/oauth/google/login`;
  };

  const handleAppleLogin = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8089';
    window.location.href = `${apiBaseUrl}/oauth/apple/login`;
  };

  return (
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
  );
}

