import React from 'react';
import Image from 'next/image';

interface TeamMemberProps {
  imageSrc: string;
  name: string;
  role: string;
  contact: string;
  isLogo?: boolean;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({ imageSrc, name, role, contact, isLogo = false }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className={`relative h-80 w-full ${isLogo ? 'bg-gray-50 flex items-center justify-center p-8' : ''}`}>
        <Image
          src={imageSrc}
          alt={name}
          width={320}
          height={320}
          className={`${isLogo ? 'object-contain w-full h-full' : 'object-cover w-full h-full'}`}
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600 mb-2">{role}</p>
        <a 
          href={`mailto:${contact}`}
          className="text-sm text-[#2F80ED] hover:underline inline-flex items-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.66667 2.66666H13.3333C14.0667 2.66666 14.6667 3.26666 14.6667 4V12C14.6667 12.7333 14.0667 13.3333 13.3333 13.3333H2.66667C1.93333 13.3333 1.33333 12.7333 1.33333 12V4C1.33333 3.26666 1.93333 2.66666 2.66667 2.66666Z" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.6667 4L8 8.66667L1.33333 4" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {contact}
        </a>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Container — FIXED: removed fixed width/height/top/left */}
        <div className="flex flex-col gap-10">
          {/* Badge */}
          <div
            className="inline-flex items-center justify-center rounded-2xl"
            style={{
              width: '106px',
              height: '28px',
              gap: '8px',
              borderRadius: '16px',
              padding: '4px 12px',
              backgroundColor: '#EFF8FF',
              // mixBlendMode removed — rarely needed and can cause issues
            }}
          >
            <span
              style={{
                fontFamily: 'Inter Tight',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '140%',
                letterSpacing: '1%',
                color: '#2F80ED',
              }}
            >
              How it works
            </span>
          </div>

          {/* Title */}
          <h2
            className="max-w-3xl text-4xl md:text-5xl font-medium leading-tight"
            style={{
              fontFamily: 'Inter Tight',
              fontWeight: 500,
              fontSize: '40px',
              lineHeight: '120%',
              color: '#000000',
            }}
          >
            The Nigerian Experts Who Make Tax-Compliant Billing Effortless.
          </h2>

          {/* Description */}
          <p
            className="max-w-3xl text-lg text-gray-600 leading-relaxed"
            style={{
              fontFamily: 'Inter Tight',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '140%',
              letterSpacing: '1%',
              color: '#333436',
            }}
          >
            We are a dedicated team of Nigerian technologists, financial experts, and 
            design specialists committed to making tax-compliant invoicing seamless for 
            local businesses.
          </p>

          {/* Team Grid — now responsive without overflow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <TeamMemberCard
              imageSrc="/assets/header logo.svg"
              name="Sunny Segun-Tomoh"
              role="Co-founder"
              contact="Sunny@originalinvoice.com"
              isLogo={true}
            />
            <TeamMemberCard
              imageSrc="/assets/images/jamesIshaku.jpeg"
              name="James Ishaku"
              role="Co-founder"
              contact="Admin@originalinvoice.com"
            />
            <TeamMemberCard
              imageSrc="/assets/images/lawrence.jpeg"
              name="Onefuwa Lawrence Okomayin"
              role="Partner"
              contact="Admin@originalinvoice.com"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;