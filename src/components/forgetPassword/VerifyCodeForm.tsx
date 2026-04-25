/**
 * VerifyCodeForm Component
 * 
 * Second screen of the forgot password flow:
 * - 6-digit verification code input
 * - Continue button
 * - Resend code link
 * - Go back link
 * 
 * Fully responsive for mobile and desktop.
 */
'use client';

import { useState, useRef, useEffect } from 'react';

interface VerifyCodeFormProps {
  email: string;
  onCodeComplete: (code: string) => void;
  onResendCode: () => void;
  onGoBack: () => void;
}

export default function VerifyCodeForm({ email, onCodeComplete, onResendCode, onGoBack }: VerifyCodeFormProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

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

    // Check if all fields are filled
    if (newCode.every(digit => digit !== '') && index === 5) {
      onCodeComplete(newCode.join(''));
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
      onCodeComplete(pastedData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      onCodeComplete(fullCode);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="w-full mx-auto py-4 sm:py-8 px-4 sm:px-6 flex flex-col gap-6 sm:gap-10"
    >
      {/* Header and Code Input Container */}
      <div className="w-full flex flex-col gap-6 sm:gap-8">
        {/* Header */}
        <div className="w-full flex flex-col gap-2">
          <h2 className="font-['Inter_Tight'] font-medium text-xl sm:text-2xl leading-tight text-center text-[#000000]">
            Input the verification code
          </h2>
          <p className="font-['Inter_Tight'] font-normal text-sm sm:text-lg leading-relaxed text-center text-[#444444] px-2">
            We have sent a verification code to the email address{' '}
            <span className="font-medium break-all">{email}</span>
          </p>
        </div>

        {/* Code Input Boxes */}
        <div className="w-full flex justify-center">
          <div className="flex gap-2 sm:gap-4 justify-center flex-wrap max-w-full">
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
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-md border border-[#E5E5E5] bg-[#FFFFFF] text-center text-lg sm:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0B62F6] focus:border-[#0B62F6]"
                required
              />
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="w-full h-11 sm:h-12 rounded-md py-3 px-4 bg-[#2F80ED] text-white font-['Inter_Tight'] font-medium text-sm sm:text-base flex items-center justify-center focus:outline-none hover:bg-[#2670d4] active:bg-[#1e5bb8] transition-colors"
      >
        Continue
      </button>

      {/* Helper Links */}
      <div className="w-full flex flex-col gap-2 sm:gap-3 items-center">
        <p className="font-['Inter_Tight'] font-normal text-sm sm:text-base leading-relaxed text-center text-[#7D7F81] px-2">
          Experiencing issues receiving the code?
        </p>
        <button
          type="button"
          onClick={onResendCode}
          className="font-['Inter_Tight'] font-semibold text-xs sm:text-sm leading-relaxed underline decoration-solid text-[#2F80ED] hover:opacity-80 active:opacity-60"
        >
          Resend Code
        </button>
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 mt-2">
          <span className="font-['Inter_Tight'] font-medium text-sm sm:text-base leading-relaxed text-center text-[#333436]">
            Change your mind?
          </span>
          <button
            type="button"
            onClick={onGoBack}
            className="flex items-center gap-1 hover:opacity-80 active:opacity-60"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.6667 10H3.33333M3.33333 10L8.33333 15M3.33333 10L8.33333 5" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-['Inter_Tight'] font-semibold text-xs sm:text-sm leading-relaxed underline decoration-solid text-[#2F80ED]">
              Go Back
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
