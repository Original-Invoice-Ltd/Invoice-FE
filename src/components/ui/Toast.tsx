/**
 * Custom Toast Component
 * 
 * A custom toast notification that appears at the top-right of the screen
 * with transparent background overlay. Matches the app's design system.
 */
'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, isVisible, onClose, duration = 5000 }: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Transparent background overlay */}
      <div className="absolute inset-0 bg-transparent" />
      
      {/* Toast container positioned at top-right */}
      <div className="absolute top-6 right-6 pointer-events-auto z-10">
        <div
          className={`
            transform transition-all duration-300 ease-in-out
            ${isAnimating ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
            ${type === 'success' 
              ? 'bg-white border-[#22C55E] shadow-[0_4px_12px_rgba(34,197,94,0.15)]' 
              : 'bg-white border-[#EF4444] shadow-[0_4px_12px_rgba(239,68,68,0.15)]'
            }
            min-w-[320px] max-w-[400px] p-4 rounded-[12px] border-l-4 border-t border-r border-b
            border-t-[#E5E5E5] border-r-[#E5E5E5] border-b-[#E5E5E5]
            flex items-start gap-3
          `}
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="flex-1">
            <p className={`text-[14px] font-medium font-['Inter_Tight'] leading-[1.4] ${
              type === 'success' ? 'text-[#16A34A]' : 'text-[#DC2626]'
            }`}>
              {type === 'success' ? 'Success' : 'Error'}
            </p>
            <p className="text-[13px] text-[#666666] font-['Inter_Tight'] leading-[1.4] mt-1">
              {message}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 ml-2 text-[#999999] hover:text-[#666666] transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}