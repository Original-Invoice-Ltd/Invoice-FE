import React from 'react';
import Image from 'next/image';

interface TeamMemberProps {
  imageSrc: string;
  name: string;
  role: string;
}

const TeamMemberCard: React.FC<TeamMemberProps> = ({ imageSrc, name, role }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative h-80 w-full">
        <Image 
          src={imageSrc} 
          alt={name} 
          width={320}
          height={320}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
  );
};

const TeamSection: React.FC = () => {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Container */}
        <div 
          className="flex flex-col"
          style={{
            width: '1280px',
            height: '808px',
            top: '2076px',
            left: '80px',
            gap: '40px',
            opacity: 1
          }}
        >
          <div 
            className="inline-flex items-center justify-center rounded-2xl"
            style={{
              width: '106px',
              height: '28px',
              gap: '8px',
              borderRadius: '16px',
              paddingTop: '4px',
              paddingRight: '12px',
              paddingBottom: '4px',
              paddingLeft: '12px',
              mixBlendMode: 'multiply',
              backgroundColor: '#EFF8FF',
              opacity: 1
            }}
          >
            <span 
              style={{
                width: '82px',
                height: '20px',
                fontFamily: 'Inter Tight',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '140%',
                letterSpacing: '1%',
                color: '#2F80ED',
                opacity: 1
              }}
            >
              How it works
            </span>
          </div>
          <h2 
            style={{
              width: '627px',
              height: '96px',
              fontFamily: 'Inter Tight',
              fontWeight: 500,
              fontSize: '40px',
              lineHeight: '120%',
              letterSpacing: '0%',
              color: '#000000',
              opacity: 1
            }}
          >
            The Nigerian Experts Who Make Tax-Compliant Billing Effortless.
          </h2>
          <p 
            style={{
              width: '627px',
              height: '75px',
              fontFamily: 'Inter Tight',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '140%',
              letterSpacing: '1%',
              color: '#333436',
              opacity: 1
            }}
          >
            We are a dedicated team of Nigerian technologists, financial experts, and 
            design specialists committed to making tax-compliant invoicing seamless for 
            local businesses.
          </p>
          
          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamMemberCard 
              imageSrc="/assets/sunny1.svg"
              name="Sunny Segun-Tomoh"
              role="Creative Director"
            />
            <TeamMemberCard 
              imageSrc="/assets/sunny2.svg"
              name="James Ishaku"
              role="Creative Director"
            />
            <TeamMemberCard 
              imageSrc="/assets/sunny3.svg"
              name="Sunny Segun-Tomoh"
              role="Creative Director"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
