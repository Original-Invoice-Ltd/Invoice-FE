'use client';

import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen?: boolean;
}

export default function FAQItem({ question, answer, isOpen = false }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-[12px] p-[24px] shadow-sm">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleExpanded}
      >
        <h3 className="text-[18px] font-medium text-[#000]">{question}</h3>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path 
            d="M15 8L10 13L5 8" 
            stroke="#6B7280" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {isExpanded && (
        <div className="mt-[16px] pt-[16px] border-t border-[#F3F4F6]">
          <p className="text-[16px] text-[#333436] leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}