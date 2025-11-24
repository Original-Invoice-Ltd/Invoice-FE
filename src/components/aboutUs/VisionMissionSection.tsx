import React from 'react';
import Image from 'next/image';

const VisionMissionSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div 
          className="text-center mb-12 flex flex-col items-center"
          style={{
            width: '1280px',
            height: '155px',
            gap: '40px',
            opacity: 1
          }}
        >
          <div 
            className="inline-flex items-center justify-center rounded-2xl"
            style={{
              width: '153px',
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
                width: '129px',
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
              Our Vision & Mission
            </span>
          </div>
          <h2 
            style={{
              width: '695px',
              height: '82px',
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
            Pioneering Simplicity, Reliability, and Compliance
          </h2>
        </div>
        
        {/* Two Column Layout */}
        <div 
          className="flex items-center"
          style={{
            width: '1280px',
            height: '480px',
            justifyContent: 'space-between',
            opacity: 1
          }}
        >
          {/* Left: Illustration */}
          <div 
            className="bg-blue-600 flex items-center justify-center"
            style={{
              width: '540px',
              height: '480px',
              borderRadius: '12px',
              opacity: 1
            }}
          >
            <div className="relative w-full h-full p-12">
              <Image 
                src="/assets/invoicing.png" 
                alt="Invoice with VAT, WHT, PAYE" 
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Right: Mission & Tax Transparency */}
          <div className="space-y-8 flex-1 pl-8">
            <div>
              <h3 
                className="mb-4"
                style={{
                  fontFamily: 'Inter Tight',
                  fontWeight: 500,
                  fontSize: '34px',
                  lineHeight: '120%',
                  letterSpacing: '0%',
                  color: '#000000'
                }}
              >
                Our Mission
              </h3>
              <p 
                style={{
                  width: '649px',
                  height: '100px',
                  fontFamily: 'Inter Tight',
                  fontWeight: 400,
                  fontSize: '18px',
                  lineHeight: '140%',
                  letterSpacing: '1%',
                  color: '#333436',
                  opacity: 1
                }}
              >
                Our Vision is to be Nigeria's most trusted invoicing and tax-compliant billing 
                platform. We enable businesses to create professional invoices, stay compliant, 
                and automate recurring financial operations with simplicity, inclusivity, and 
                reliability
              </p>
            </div>
            
            <div>
              <h3 
                className="mb-4"
                style={{
                  width: '649px',
                  height: '41px',
                  fontFamily: 'Inter Tight',
                  fontWeight: 500,
                  fontSize: '34px',
                  lineHeight: '120%',
                  letterSpacing: '0%',
                  color: '#000000',
                  opacity: 1
                }}
              >
                Tax Transparency
              </h3>
              <p 
                style={{
                  width: '649px',
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
                To be Nigeria's most trusted invoicing and tax-compliant billing platform - 
                enabling businesses to create professional invoices, stay compliant, and automate 
                recurring financial operations with simplicity, inclusivity, and reliability.
              </p>
            </div>
            
            <button 
              className="text-white hover:bg-blue-700 transition font-medium"
              style={{
                width: '180px',
                height: '54px',
                gap: '12px',
                borderRadius: '8px',
                paddingTop: '12px',
                paddingRight: '16px',
                paddingBottom: '12px',
                paddingLeft: '16px',
                backgroundColor: '#2F80ED',
                opacity: 1
              }}
            >
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
