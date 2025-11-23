import React from 'react';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="flex justify-center">
        <div 
          className="flex justify-between items-center"
          style={{
            width: '1280px',
            height: '500px',
            marginTop: '190px',
            marginLeft: '80px'
          }}
        >
          {/* Left Column */}
          <div className="flex flex-col">
            {/* About Us Badge */}
            <span 
              className="inline-block rounded-full text-white mb-6"
              style={{
                width: '59px',
                height: '20px',
                fontFamily: 'Inter Tight',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '140%',
                letterSpacing: '1%',
                background: '#2F80ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              About Us
            </span>
            
            {/* Main Headline */}
            <h1 
              className="mb-6"
              style={{
                width: '642px',
                height: '219px',
                fontFamily: 'Inter Tight',
                fontWeight: 600,
                fontSize: '60px',
                lineHeight: '100%',
                letterSpacing: '-2%',
                color: '#000000'
              }}
            >
              Nigeria's Most Trusted Platform for Tax-Compliant Invoicing.
            </h1>
            
            {/* Supporting Text */}
            <p 
              className="mb-8"
              style={{
                width: '642px',
                height: '48px',
                fontFamily: 'Inter Tight',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '24px',
                letterSpacing: '0%',
                color: '#333436'
              }}
            >
              We transform complex financial and tax operations into a simple, reliable, 
              and effortless experience for Nigerian freelancers, SMEs, and enterprises.
            </p>
            
            {/* CTA Button */}
            <button 
              className="text-white rounded-md hover:opacity-90 transition"
              style={{
                width: '221px',
                height: '54px',
                gap: '8px',
                paddingTop: '12px',
                paddingRight: '16px',
                paddingBottom: '12px',
                paddingLeft: '16px',
                background: '#2F80ED'
              }}
            >
              Start Your Free Trial Today
            </button>
          </div>
          
          {/* Right Column - Image */}
          <div 
            className="overflow-hidden"
            style={{
              width: '500px',
              height: '500px',
              borderRadius: '12px'
            }}
          >
            <Image 
              src="/assets/team-collaboration.jpg" 
              alt="African professionals collaborating" 
              width={500} 
              height={500}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
