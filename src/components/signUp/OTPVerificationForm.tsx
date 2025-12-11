/**
 * OTPVerificationForm Component
 * 
 * Third screen of the signup flow:
 * - 6-digit OTP verification code input
 * - Verify button
 * - Resend code functionality with timer
 * 
 * Fully responsive for mobile and desktop.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import Logo from './Logo';

interface OTPVerificationFormProps {
  email: string;
  onOTPComplete: (otp: string) => Promise<boolean>;
  onResendOTP: () => void;
  loading?: boolean;
}

export default function OTPVerificationForm({ 
  email, 
  onOTPComplete, 
  onResendOTP,
  loading = false 
}: OTPVerificationFormProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setCode(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6 && !loading) {
      const success = await onOTPComplete(fullCode);
      if (!success) {
        // Clear the code on failure
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }
  };

  const handleResend = () => {
    if (canResend && !loading) {
      setTimer(60);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      onResendOTP();
      inputRefs.current[0]?.focus();
    }
  };

  // Function to mask email
  const maskEmail = (email: string) => {
    if (!email) return 'user@example.com';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    const maskedLocal = localPart.substring(0, Math.min(3, localPart.length)) + '****';
    const [domainName, extension] = domain.split('.');
    const maskedDomain = domainName.substring(0, 1) + '***';
    
    return `${maskedLocal}@${maskedDomain}.${extension}`;
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full max-w-[470px] mx-auto flex flex-col gap-8"
    >
      {/* Logo - Centered with spacing (mobile only) */}
      <div className="flex justify-center mb-4 lg:hidden">
        <Logo />
      </div>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-[24px] font-medium text-[#000000] font-['Inter_Tight'] mb-3">
          Enter 6-digit verification code
        </h2>
        <p className="text-[16px] text-[#666666] font-['Inter_Tight'] leading-[140%]">
          We have sent a verification code to the email address<br />
          <span className="font-medium">{maskEmail(email)}</span>
        </p>
      </div>

      {/* Verification Code Inputs */}
      <div className="flex justify-center gap-3">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading}
            className="w-[60px] h-[60px] text-center text-[24px] font-medium border border-[#E5E5E5] 
              rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent
              disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        ))}
      </div>

      {/* Resend Code */}
      <div className="text-center">
        {!canResend ? (
          <p className="text-[14px] text-[#666666] font-['Inter_Tight']">
            Resend code in <span className="font-medium">{timer} seconds</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-[14px] text-[#2F80ED] font-['Inter_Tight'] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Resend code
          </button>
        )}
      </div>

      {/* Verify Button */}
      <button
        type="submit"
        disabled={loading || code.join('').length !== 6}
        className="w-full h-[48px] rounded-lg bg-[#2F80ED] text-white text-[16px] 
          font-medium font-['Inter_Tight'] hover:bg-[#2670d4] transition-colors
          disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </form>
  );
}
