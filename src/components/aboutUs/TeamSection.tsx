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
              imageSrc="/assets/sunny1.png"
              name="Sunny Segun-Tomoh"
              role="Creative Director"
            />
            <TeamMemberCard
              imageSrc="/assets/sunny2.png"
              name="James Ishaku"
              role="Creative Director"
            />
            <TeamMemberCard
              imageSrc="/assets/sunny3.png"
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