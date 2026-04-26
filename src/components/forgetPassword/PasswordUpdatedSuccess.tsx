'use client';

interface PasswordUpdatedSuccessProps {
  onSignIn: () => void;
}

export default function PasswordUpdatedSuccess({ onSignIn }: PasswordUpdatedSuccessProps) {
  return (
    <div className="w-full mx-auto py-4 sm:py-8 px-4 sm:px-6 flex flex-col gap-6 sm:gap-10">
      {/* Header */}
      <div className="w-full flex flex-col gap-6 sm:gap-8">
        <h2 className="font-['Inter_Tight'] font-medium text-xl sm:text-2xl leading-tight text-center text-[#000000]">
          Password updated successful
        </h2>
        <p className="font-['Inter_Tight'] font-normal text-sm sm:text-lg leading-relaxed text-center text-[#444444] px-2">
          Password changed successfully. You may now sign in with your new password
        </p>
      </div>

      {/* Sign In Button */}
      <button
        onClick={onSignIn}
        className="w-full h-11 sm:h-12 rounded-md py-3 px-4 bg-[#2F80ED] text-white font-['Inter_Tight'] font-medium text-sm sm:text-base flex items-center justify-center focus:outline-none hover:bg-[#2670d4] active:bg-[#1e5bb8] transition-colors"
      >
        Sign In
      </button>
    </div>
  );
}

