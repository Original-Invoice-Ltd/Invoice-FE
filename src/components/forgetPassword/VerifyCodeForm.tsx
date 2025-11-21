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
      className="w-full max-w-[518px] mx-auto py-8 px-6 flex flex-col gap-10"
    >
      {/* Header and Code Input Container */}
      <div className="w-[470px] h-[167px] rotate-0 opacity-100 flex flex-col gap-[32px]">
        {/* Header */}
        <div className="w-[470px] h-[87px] rotate-0 opacity-100 flex flex-col gap-[8px]">
          <h2 className="w-[470px] h-[29px] rotate-0 opacity-100 font-['Inter_Tight'] font-medium text-[24px] leading-[120%] tracking-[0] text-center text-[#000000]">
            Input the verification code
          </h2>
          <p className="w-[470px] h-[50px] rotate-0 opacity-100 font-['Inter_Tight'] font-normal text-[18px] leading-[140%] tracking-[0.01em] text-center text-[#444444]">
            We have sent a verification code to the email address{' '}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {/* Code Input Boxes - Verification State Placeholder */}
        <div className="w-[470px] h-[48px] rotate-0 opacity-100 flex gap-[24px] justify-center">
          <div className="w-[368px] h-[48px] rotate-0 opacity-100 flex gap-[16px]">
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
                className="w-[48px] h-[48px] rotate-0 opacity-100 rounded-md gap-[10px] border border-[#E5E5E5] bg-[#FFFFFF] text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0B62F6] focus:border-[#0B62F6]"
                required
              />
            ))}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="w-[470px] h-[46px] rotate-0 opacity-100 rounded-md pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[8px] bg-[#2F80ED] text-white font-['Inter_Tight'] font-medium text-[16px] flex items-center justify-center focus:outline-none hover:bg-[#2670d4] transition-none duration-0"
      >
        Continue
      </button>

      {/* Helper Links */}
      <div className="w-[470px] h-[46px] rotate-0 opacity-100 flex flex-col gap-[4px] items-center">
        <p className="w-[470px] h-[22px] rotate-0 opacity-100 font-['Inter_Tight'] font-normal text-[16px] leading-[140%] tracking-[0.01em] text-center text-[#7D7F81]">
          Experiencing issues receiving the code?
        </p>
        <button
          type="button"
          onClick={onResendCode}
          className="w-[86px] h-[20px] rotate-0 opacity-100 gap-[4px] font-['Inter_Tight'] font-semibold text-[14px] leading-[140%] tracking-[0.01em] underline decoration-solid text-[#2F80ED] hover:opacity-80"
        >
          Resend Code
        </button>
        <div className="w-[226px] h-[22px] rotate-0 opacity-100 flex items-center gap-[8px]">
          <span className="w-[140px] h-[22px] rotate-0 opacity-100 font-['Inter_Tight'] font-medium text-[16px] leading-[140%] tracking-[0.01em] text-right text-[#333436]">
            Change your mind?
          </span>
          <button
            type="button"
            onClick={onGoBack}
            className="flex items-center gap-1 hover:opacity-80"
          >
            <svg className="w-[20px] h-[20px] rotate-0 opacity-100" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.6667 10H3.33333M3.33333 10L8.33333 15M3.33333 10L8.33333 5" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="w-[54px] h-[20px] rotate-0 opacity-100 font-['Inter_Tight'] font-semibold text-[14px] leading-[140%] tracking-[0.01em] underline decoration-solid text-[#2F80ED]">
              Go Back
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
