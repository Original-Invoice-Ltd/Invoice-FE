import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-12 mt-8 md:mt-16 lg:mt-24">
          {/* Left Column */}
          <div className="flex flex-col flex-1 max-w-2xl">
            {/* About Us Badge */}
            <div className="inline-flex items-center justify-center rounded-2xl mb-6 bg-blue-50 px-3 py-1 w-fit">
              <span className="text-sm font-medium text-blue-600">
                About Us
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight mb-6 text-black font-['Inter_Tight']">
              Nigeria's Most Trusted Platform for Tax-Compliant Invoicing.
            </h1>
            
            {/* Supporting Text */}
            <p className="text-base md:text-lg lg:text-xl leading-relaxed mb-8 text-gray-700 font-['Inter_Tight']">
              We transform complex financial and tax operations into a simple, reliable, 
              and effortless experience for Nigerian freelancers, SMEs, and enterprises.
            </p>
            
            {/* CTA Button */}
            <button className="bg-blue-600 text-white rounded-md hover:bg-blue-700 transition px-4 py-3 font-medium text-sm md:text-base w-fit">
              Start Your Free Trial Today
            </button>
          </div>
          
          {/* Right Column - Image */}
          <div className="flex-1 max-w-md lg:max-w-lg xl:max-w-xl">
            <div className="w-full aspect-square rounded-xl overflow-hidden">
              <Image 
                src="/assets/trustedInvoicing.png" 
                alt="African professionals collaborating" 
                width={500} 
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
