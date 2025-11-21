'use client';

import { useState } from 'react';

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
  const testimonialsPerPage = 3;
  const maxIndex = Math.max(0, testimonials.length - testimonialsPerPage);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + testimonialsPerPage);

  return (
    <div className="flex items-center justify-between">
      <button 
        onClick={goToPrevious}
        disabled={currentIndex === 0}
        className={`w-[48px] h-[48px] rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] ${
          currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="flex gap-[32px] max-w-[1000px] transition-all duration-300">
        {visibleTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-[32px] rounded-[12px] shadow-sm max-w-[300px]">
            <p className="text-[16px] text-[#333436] mb-[24px] leading-relaxed">
              "{testimonial.text}"
            </p>
            <div className="flex items-center gap-[12px]">
              <div className="w-[48px] h-[48px] rounded-full overflow-hidden">
                <img 
                  src={testimonial.profileIcon}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[16px] font-medium text-[#000]">{testimonial.name}</p>
                <p className="text-[14px] text-[#6B7280]">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={goToNext}
        disabled={currentIndex >= maxIndex}
        className={`w-[48px] h-[48px] rounded-full border border-[#E5E7EB] flex items-center justify-center hover:bg-[#F9FAFB] ${
          currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 15L12.5 10L7.5 5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}