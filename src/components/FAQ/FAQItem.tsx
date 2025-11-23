'use client';

import { useState, useRef, useEffect } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
  isLast?: boolean;
}

export default function FAQItem({ question, answer, isLast = false }: FAQItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${isExpanded ? 'bg-white rounded-[12px]' : 'bg-[#eff8ff]'} p-[20px] lg:p-[24px] border-b border-white transition-colors duration-300`}>
      <div 
        className="flex items-center justify-between cursor-pointer gap-[12px]"
        onClick={toggleExpanded}
      >
        <h3 className="text-[16px] lg:text-[18px] font-medium text-[#000]">{question}</h3>
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform duration-300 ease-in-out flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
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
      <div 
        style={{ height: `${height}px` }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={contentRef} className="pt-[12px] lg:pt-[16px]">
          <p className="text-[14px] lg:text-[16px] text-[#333436] leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}