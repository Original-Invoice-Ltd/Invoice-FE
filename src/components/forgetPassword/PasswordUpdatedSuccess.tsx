'use client';

interface PasswordUpdatedSuccessProps {
  onSignIn: () => void;
}

export default function PasswordUpdatedSuccess({ onSignIn }: PasswordUpdatedSuccessProps) {
  return (
    <div className="w-full max-w-[518px] mx-auto py-8 px-6 flex flex-col gap-10">
      {/* Header */}
      <div className="w-[470px] h-[87px] rotate-0 opacity-100 flex flex-col gap-[32px]">
        <h2 className="w-[470px] h-[29px] rotate-0 opacity-100 font-['Inter_Tight'] font-medium text-[24px] leading-[120%] tracking-[0] text-center text-[#000000]">
          Password updated successful
        </h2>
        <p className="w-[470px] h-[50px] rotate-0 opacity-100 font-['Inter_Tigfont-normal text-[18px] leading-[140%] tracking-[0.01em] text-center text-[#444444]">
          Password changed successfully. You may now sign in with your new password
        </p>
      </div>

      {/* Sign In Button */}
      <button
        onClick={onSignIn}
        className="w-[470px] h-[46px] rotate-0 opacity-100 
        rounded-md pt-[12px] pr-[16px] pb-[12px] pl-[16px] gap-[8px]
        bg-[#2F80ED] text-white font-['Inter_Tight'] font-medium text-[16px] 
        flex items-center justify-center focus:outline-none hover:bg-[#2670d4]
        transition-none duration-0"
      >
        Sign In
      </button>
    </div>
  );
}

