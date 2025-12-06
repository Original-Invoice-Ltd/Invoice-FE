'use client';

import { useState, useRef, useEffect } from 'react';

interface SetupAccountFormProps {
  formData: {
    fullName: string;
    businessName: string;
    businessCategory: string;
  };
  email: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SetupAccountForm({ formData, email, onInputChange, onSubmit }: SetupAccountFormProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(40);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move to next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(40);
    setCode(['', '', '', '', '', '']);
  };

  // Function to mask email
  const maskEmail = (email: string) => {
    if (!email) return 'chi****@g***.com';
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    const maskedLocal = localPart.substring(0, 3) + '****';
    const [domainName, extension] = domain.split('.');
    const maskedDomain = domainName.substring(0, 1) + '***';
    
    return `${maskedLocal}@${maskedDomain}.${extension}`;
  };

  return (
    <div className="w-full mt-[-40px] max-w-[470px] mx-auto flex flex-col gap-[24px]">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-[24px] font-medium text-[#000000] font-['Inter_Tight'] mb-3">
          Enter 6-digit verification code
        </h2>
        <p className="text-[16px] text-[#666666] font-['Inter_Tight']">
          We have sent a verification code to the email address<br />
          {maskEmail(email)}
        </p>
      </div>

      {/* Verification Code Inputs */}
      <div className="flex justify-center gap-4">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-[60px] h-[60px] text-center text-[24px] font-medium border border-[#E5E5E5] 
              rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:border-transparent"
          />
        ))}
      </div>

      {/* Resend Code */}
      <div className="text-center">
        {timer > 0 ? (
          <p className="text-[14px] text-[#666666] font-['Inter_Tight']">
            Resend code <span className="font-medium">{timer} seconds</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-[14px] text-[#2F80ED] font-['Inter_Tight'] hover:underline"
          >
            Resend code
          </button>
        )}
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        onClick={onSubmit}
        className="w-full h-[48px] rounded-lg bg-[#2F80ED] text-white text-[16px] 
          font-medium font-['Inter_Tight'] hover:bg-[#2670d4] transition-colors"
      >
        Continue
      </button>
    </div>
  );
}

