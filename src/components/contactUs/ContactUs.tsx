'use client';

import { useState } from 'react';
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer/Footer";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    agreeToComms: false
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const subjectOptions = [
    'General Inquiry',
    'Billing',
    'Sales',
    'Technical Support',
    'Feedback'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSubjectSelect = (subject: string) => {
    setFormData(prev => ({ ...prev, subject }));
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      
      <div className="flex-1 relative overflow-hidden" style={{ backgroundImage: "url('/assets/Background pattern.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Top Right Eclipse */}
        <Image
          src="/assets/top right eclipse.svg"
          alt=""
          width={600}
          height={600}
          className="hidden md:block absolute top-0 right-0 translate-x-[20%] pointer-events-none"
        />
        
        {/* Mid Right Eclipse - Bottom Left */}
        <Image
          src="/assets/Mid Right Ellipse.svg"
          alt=""
          width={300}
          height={300}
          className="hidden md:block absolute bottom-0 left-0 -translate-x-[5%] translate-y-[5%] pointer-events-none"
        />
        
        <div className="relative py-[40px] md:py-[40px] lg:py-[60px]">
        <div className="max-w-[1280px] mx-auto px-[16px] md:px-[40px] lg:px-[80px]">
          <div className="text-center mb-[40px] md:mb-[40px] lg:mb-[50px]">
            <span className="inline-block px-[16px] py-[6px] bg-[#EFF8FF] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[16px] md:mb-[24px]">
              Contact Us
            </span>
            <h1 className="text-[32px] md:text-[48px] lg:text-[60px] font-semibold text-[#000] mb-[12px] md:mb-[16px] leading-tight tracking-[-1px] md:tracking-[-2px] px-[16px]">
              Get in Touch
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#333436] max-w-[800px] mx-auto leading-relaxed mb-[24px] md:mb-[26px] px-[16px]">
              Whether you have questions, feedback, partnership requests, or need support—our team is always <br />ready to assis you.
            </p>
            <button className="bg-[#2F80ED] px-[20px] md:px-[24px] py-[8px] md:py-[8px] text-white rounded-[8px] font-medium text-[14px] md:text-[16px] hover:bg-[#2563EB]">
              Start Your Free Trial Today
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[60px] xl:gap-[100px] items-start">
            {/* Left Side - Form */}
            <div className="w-full lg:w-[600px] bg-white rounded-[16px] p-[24px] md:p-[32px] lg:p-[40px] shadow-sm">
              <form onSubmit={handleSubmit}>
                <div className="mb-[12px]">
                  <label className="block text-[14px] font-medium text-[#000] mb-[8px]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#2F80ED]"
                  />
                </div>

                <div className="mb-[12px]">
                  <label className="block text-[14px] font-medium text-[#000] mb-[8px]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#2F80ED]"
                  />
                </div>

                <div className="mb-[12px]">
                  <label className="block text-[14px] font-medium text-[#000] mb-[8px]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#2F80ED]"
                  />
                </div>

                <div className="mb-[12px] relative">
                  <label className="block text-[14px] font-medium text-[#000] mb-[8px]">
                    Subject <span className="text-[#6B7280]">(optional)</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-[16px] py-[12px] border border-[#E5E7EB] rounded-[8px] text-[14px] text-left focus:outline-none focus:border-[#2F80ED] bg-white flex items-center justify-between"
                    >
                      <span className={formData.subject ? 'text-[#000]' : 'text-[#9CA3AF]'}>
                        {formData.subject || 'Select subject'}
                      </span>
                      <svg 
                        width="12" 
                        height="8" 
                        viewBox="0 0 12 8" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                      >
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-[4px] bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg">
                        {subjectOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleSubjectSelect(option)}
                            className="w-full px-[16px] py-[12px] text-[14px] text-left hover:bg-[#F9FAFB] first:rounded-t-[8px] last:rounded-b-[8px] text-[#000]"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-[24px]">
                  <label className="block text-[14px] font-medium text-[#000] mb-[8px]">
                    Customer Note
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Placeholder"
                    rows={4}
                    className="w-full px-[16px] py-[4px] border border-[#E5E7EB] rounded-[8px] text-[14px] focus:outline-none focus:border-[#2F80ED] resize-none"
                  />
                </div>

                <div className="mb-[32px]">
                  <label className="flex items-start gap-[8px] cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToComms"
                      checked={formData.agreeToComms}
                      onChange={handleChange}
                      className="mt-[2px] w-[16px] h-[16px] border border-[#E5E7EB] rounded-[4px]"
                    />
                    <span className="text-[14px] text-[#333436]">
                      I agree to receive communication related to my inquiry.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2F80ED] text-white py-[14px] rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB]"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Right Side - Contact Info */}
            <div className="w-full lg:w-[320px] space-y-[32px] md:space-y-[40px]">
              {/* Email */}
              <div>
                <h3 className="text-[18px] font-semibold text-[#000] mb-[8px]">Email</h3>
                <p className="text-[14px] text-[#6B7280] mb-[8px]">Send us an Email</p>
                <a href="mailto:originalinvoice@gmail.com" className="flex items-center gap-[8px] text-[#2F80ED] text-[14px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <path d="M2.66667 2.66666H13.3333C14.0667 2.66666 14.6667 3.26666 14.6667 4V12C14.6667 12.7333 14.0667 13.3333 13.3333 13.3333H2.66667C1.93333 13.3333 1.33333 12.7333 1.33333 12V4C1.33333 3.26666 1.93333 2.66666 2.66667 2.66666Z" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.6667 4L8 8.66667L1.33333 4" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="border-b border-[#2F80ED]">originalinvoice@gmail.com</span>
                </a>
              </div>

              {/* Office Hours */}
              <div>
                <h3 className="text-[18px] font-semibold text-[#000] mb-[8px]">Office Hours</h3>
                <p className="text-[14px] text-[#6B7280] mb-[8px]">Call our team Mon-Fri from 8am to 5pm</p>
                <a href="tel:+2347047300083" className="flex items-center gap-[8px] text-[#2F80ED] text-[14px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                    <path d="M14.6667 11.28V13.28C14.6675 13.4657 14.6294 13.6494 14.555 13.8195C14.4807 13.9897 14.3716 14.1424 14.2348 14.2679C14.0979 14.3934 13.9364 14.489 13.7605 14.5485C13.5847 14.6079 13.3983 14.63 13.2133 14.6133C11.1619 14.3904 9.19137 13.6894 7.46 12.5667C5.84919 11.5431 4.48353 10.1774 3.46 8.56665C2.33334 6.82745 1.6322 4.84731 1.41333 2.78665C1.39667 2.60219 1.41862 2.41649 1.4777 2.24107C1.53679 2.06564 1.63175 1.90444 1.75655 1.76773C1.88134 1.63102 2.03324 1.52179 2.20256 1.44695C2.37189 1.37211 2.55493 1.33329 2.74 1.33332H4.74C5.06353 1.33013 5.37717 1.4447 5.62248 1.65568C5.86779 1.86665 6.02804 2.15961 6.07333 2.47998C6.15774 3.12003 6.31427 3.74847 6.54 4.35332C6.62974 4.59193 6.64908 4.85126 6.59591 5.10057C6.54274 5.34988 6.41928 5.57872 6.24 5.75998L5.39333 6.60665C6.34238 8.27568 7.72431 9.65761 9.39333 10.6067L10.24 9.75998C10.4213 9.5807 10.6501 9.45724 10.8994 9.40407C11.1487 9.3509 11.4081 9.37024 11.6467 9.45998C12.2515 9.68571 12.88 9.84224 13.52 9.92665C13.8439 9.97234 14.1396 10.1355 14.3511 10.385C14.5625 10.6345 14.6748 10.953 14.6667 11.28Z" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="border-b border-[#2F80ED]">+234 704 730 0083</span>
                </a>
              </div>

              {/* Our Address */}
              <div>
                <h3 className="text-[18px] font-semibold text-[#000] mb-[8px]">Our Address</h3>
                <p className="text-[14px] text-[#6B7280] mb-[8px]">Visit Us at</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-start gap-[8px] text-[#2F80ED] text-[14px]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-[2px] flex-shrink-0">
                    <path d="M14 6.66667C14 11.3333 8 15.3333 8 15.3333C8 15.3333 2 11.3333 2 6.66667C2 5.07536 2.63214 3.54926 3.75736 2.42404C4.88258 1.29882 6.40869 0.666672 8 0.666672C9.59131 0.666672 11.1174 1.29882 12.2426 2.42404C13.3679 3.54926 14 5.07536 14 6.66667Z" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 8.66667C9.10457 8.66667 10 7.77124 10 6.66667C10 5.5621 9.10457 4.66667 8 4.66667C6.89543 4.66667 6 5.5621 6 6.66667C6 7.77124 6.89543 8.66667 8 8.66667Z" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="border-b border-[#2F80ED]">45 Awolowo Road, Ikoyi, Lagos, Nigeria</span>
                </a>
              </div>

              {/* Our Social Media */}
             <div>
  <h3 className="text-[18px] font-semibold text-[#000] mb-[16px]">Our Social Media</h3>
  <div className="flex gap-[16px]">
    <span className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center opacity-50 cursor-not-allowed">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#2F80ED"/>
      </svg>
    </span>
    <a href="https://www.instagram.com/originalinvoice?igsh=NTNmaGRnbjBleDRq&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center hover:bg-[#EFF8FF] hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#000"/>
      </svg>
    </a>
    <a href="https://x.com/originalinvoice?s=21" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center hover:bg-[#EFF8FF] hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000"/>
      </svg>
    </a>
    <a href="https://www.linkedin.com/in/original-invoice-287935397?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center hover:bg-[#EFF8FF] hover:text-white transition-colors">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#2F80ED"/>
      </svg>
    </a>
  </div>
</div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}