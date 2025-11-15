/**
 * SocialLoginButtons Component
 * 
 * Displays social authentication options:
 * - Continue with Google button
 * - Continue with Apple button
 * 
 * Both buttons are fully responsive and styled consistently.
 */
export default function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    // Handle Google authentication
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    // Handle Apple authentication
    console.log('Apple login clicked');
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-gray-700 font-medium">Continue with Google</span>
      </button>

      <button
        type="button"
        onClick={handleAppleLogin}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.96-3.24-1.44-1.56-.62-2.3-1.23-2.3-2.11 0-.84.79-1.75 2.08-2.48 1.39-.8 3.37-1.24 5.2-1.24 1.72 0 3.35.4 4.56 1.11.85.5 1.28 1.05 1.28 1.78 0 .9-.68 1.52-1.5 1.98zm-2.12-18.28c-1.54 0-2.8 1.25-2.8 2.8 0 1.54 1.25 2.8 2.8 2.8 1.54 0 2.8-1.25 2.8-2.8 0-1.54-1.25-2.8-2.8-2.8z"/>
        </svg>
        <span className="text-gray-700 font-medium">Continue with Apple</span>
      </button>
    </div>
  );
}

