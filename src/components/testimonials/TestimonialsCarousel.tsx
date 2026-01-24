'use client';

import { useState, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    text: "Before Original Invoice, I was manually calculating VAT and WHT for every client. Now it's automatic, my invoices look professional, and I never miss a payment deadline.",
    name: "Chiamaka Okeke",
    role: "Graphic Designer",
    profileIcon: "/assets/icons/ProfileIcon1.svg"
  },
  {
    id: 2,
    text: "Tax compliance used to give me sleepless nights. Original Invoice handles all Nigerian tax calculations perfectly. My accountant loves the detailed reports",
    name: "Olumide Adeyemi",
    role: "CEO",
    profileIcon: "/assets/icons/ProfileIcon2.svg"
  },
  {
    id: 3,
    text: "I send invoices in both English and Hausa to my clients. The multi-language feature is brilliant, and the WhatsApp integration means my clients can pay me instantly.",
    name: "Fatima Bello",
    role: "Freelance Consultant",
    profileIcon: "/assets/icons/ProfileIcon3.svg"
  },
  {
    id: 4,
    text: "The platform has transformed how I manage my consulting business. Client management is seamless, and the automated reminders ensure I get paid on time every time.",
    name: "Ibrahim Musa",
    role: "Business Consultant",
    profileIcon: "/assets/icons/ProfileIcon4.svg"
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const maxIndex = isMobile ? testimonials.length - 1 : testimonials.length - 1;

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  // Show all testimonials starting from currentIndex
  const visibleTestimonials = isMobile 
    ? [testimonials[currentIndex]]
    : testimonials.slice(currentIndex);

  return (
    <div>
      {/* Navigation Arrows - Top Right */}
      <div className="flex justify-end gap-[24px] mb-[24px]">
        <button 
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={`flex items-center justify-center hover:opacity-70 transition-opacity ${
            currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
          }`}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 16H7M7 16L14 9M7 16L14 23" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button 
          onClick={goToNext}
          disabled={currentIndex >= maxIndex}
          className={`flex items-center justify-center hover:opacity-70 transition-opacity ${
            currentIndex >= maxIndex ? 'opacity-30 cursor-not-allowed' : ''
          }`}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 16H25M25 16L18 9M25 16L18 23" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Testimonials Cards */}
      <div className="overflow-hidden">
        <div className="flex gap-[16px] lg:gap-[24px] transition-all duration-300">
          {visibleTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-[24px] lg:p-[32px] rounded-[12px] shadow-sm w-full lg:w-[calc(28.5%)] flex-shrink-0 border border-[#E5E7EB]">
              <p className="text-[14px] lg:text-[16px] text-[#333436] mb-[20px] lg:mb-[24px] leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={testimonial.profileIcon}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[14px] lg:text-[16px] font-medium text-[#000]">{testimonial.name}</p>
                  <p className="text-[12px] lg:text-[14px] text-[#6B7280]">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}