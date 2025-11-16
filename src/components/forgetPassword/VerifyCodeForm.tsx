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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Input the verification code</h2>
        <p className="text-sm sm:text-base text-gray-600">
          We have sent a verification code to the email address{' '}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      {/* Code Input Boxes */}
      <div className="flex gap-2 sm:gap-3 justify-center">
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
            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B62F6] focus:border-[#0B62F6]"
            required
          />
        ))}
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="w-full bg-[#0B62F6] text-white py-3 rounded-lg font-semibold hover:bg-[#0954d4] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B62F6] focus:ring-offset-2 text-sm sm:text-base"
      >
        Continue
      </button>

      {/* Helper Links */}
      <div className="space-y-3 text-center">
        <div className="text-sm text-gray-600">
          Experiencing issues receiving the code?{' '}
          <button
            type="button"
            onClick={onResendCode}
            className="text-[#0B62F6] hover:underline font-medium"
          >
            Resend Code
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Change your mind?{' '}
          <button
            type="button"
            onClick={onGoBack}
            className="text-[#0B62F6] hover:underline font-medium flex items-center justify-center gap-1"
          >
            <span>←</span> Go Back
          </button>
        </div>
      </div>
    </form>
  );
}
