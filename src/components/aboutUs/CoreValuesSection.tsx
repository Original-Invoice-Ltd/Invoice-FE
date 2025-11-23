import React from 'react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description }) => {
  return (
    <div 
      className="bg-white shadow-sm hover:shadow-md transition"
      style={{
        width: '286px',
        height: '231px',
        gap: '24px',
        borderRadius: '8px',
        padding: '16px',
        opacity: 1
      }}
    >
      <div className="text-blue-600 mb-4">
        {icon}
      </div>
      <h3 
        className="mb-3"
        style={{
          width: '254px',
          height: '25px',
          fontFamily: 'Inter Tight',
          fontWeight: 600,
          fontSize: '18px',
          lineHeight: '140%',
          letterSpacing: '1%',
          color: '#000000',
          opacity: 1
        }}
      >
        {title}
      </h3>
      <p 
        style={{
          width: '254px',
          height: '110px',
          fontFamily: 'Inter Tight',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '140%',
          letterSpacing: '1%',
          color: '#333436',
          opacity: 1
        }}
      >
        {description}
      </p>
    </div>
  );
};

const CoreValuesSection: React.FC = () => {
  return (
    <section className="bg-blue-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div 
          className="text-center mb-12 flex flex-col items-center"
          style={{
            width: '1280px',
            height: '111px',
            gap: '16px',
            opacity: 1
          }}
        >
          <h2 
            style={{
              width: '695px',
              height: '41px',
              fontFamily: 'Inter Tight',
              fontWeight: 600,
              fontSize: '34px',
              lineHeight: '120%',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#000000',
              opacity: 1
            }}
          >
            Our Core Values
          </h2>
          <p 
            style={{
              width: '788px',
              height: '50px',
              fontFamily: 'Inter Tight',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '140%',
              letterSpacing: '1%',
              textAlign: 'center',
              color: '#333436',
              opacity: 1
            }}
          >
            We designed Original Invoice around the belief that financial compliance should empower, not 
            complicate. Our values reflect our commitment to the businesses and freelancers we serve.
          </p>
        </div>
        
        {/* Values Grid */}
        <div 
          className="flex"
          style={{
            width: '1280px',
            height: '209px',
            justifyContent: 'space-between',
            opacity: 1
          }}
        >
          <ValueCard 
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            title="Simplicity"
            description="Effortless tools for powerful results. We ensure one-click access to frequent actions and keep the workflow minimal, from invoice creation to sending."
          />
          
          <ValueCard 
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            title="Transparency"
            description="Clarity in every transaction. You and your clients will always see a clear breakdown of tax computations (VAT, WHT, PAYE) and payment progress."
          />
          
          <ValueCard 
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            title="Inclusivity"
            description="Billing accessible to all. We support multilingual communication (English, Hausa, Igbo, Yoruba) and design for universal accessibility (WCAG) across devices."
          />
          
          <ValueCard 
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            title="Reliability"
            description="Your finance partner in the cloud. We prioritize fast performance, rock-solid security, and accurate compliance cues to ensure you can always trust your data."
          />
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
