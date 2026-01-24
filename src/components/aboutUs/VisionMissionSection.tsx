import React from 'react';
import Image from 'next/image';

const VisionMissionSection: React.FC = () => {
  return (
    <section className="py-10 md:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 flex flex-col items-center gap-6 md:gap-10">
          <div className="inline-flex items-center justify-center rounded-2xl px-3 py-1 bg-[#EFF8FF]">
            <span className="text-sm font-medium text-[#2F80ED] font-['Inter_Tight']">
              Our Vision & Mission
            </span>
          </div>
          <h2 className="text-[24px] md:text-[34px] font-semibold leading-tight text-center text-black font-['Inter_Tight'] max-w-[695px]">
            Pioneering Simplicity, Reliability, and Compliance
          </h2>
        </div>
        
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left: Illustration */}
          <div className="bg-blue-600 flex items-center justify-center w-full lg:w-[540px] h-[300px] md:h-[400px] lg:h-[480px] rounded-xl">
            <div className="relative w-full h-full p-6 md:p-12">
              <Image 
                src="/assets/OurMission.svg" 
                alt="Invoice with VAT, WHT, PAYE" 
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Right: Mission & Tax Transparency */}
          <div className="space-y-6 md:space-y-8 flex-1 w-full">
            <div>
              <h3 className="text-[24px] md:text-[34px] font-medium mb-3 md:mb-4 text-black font-['Inter_Tight']">
                Our Mission
              </h3>
              <p className="text-[16px] md:text-[18px] leading-relaxed text-[#333436] font-['Inter_Tight']">
                Our Vision is to be Nigeria's most trusted invoicing and tax-compliant billing 
                platform. We enable businesses to create professional invoices, stay compliant, 
                and automate recurring financial operations with simplicity, inclusivity, and 
                reliability
              </p>
            </div>
            
            <div>
              <h3 className="text-[24px] md:text-[34px] font-medium mb-3 md:mb-4 text-black font-['Inter_Tight']">
                Tax Transparency
              </h3>
              <p className="text-[16px] md:text-[18px] leading-relaxed text-[#333436] font-['Inter_Tight']">
                To be Nigeria's most trusted invoicing and tax-compliant billing platform - 
                enabling businesses to create professional invoices, stay compliant, and automate 
                recurring financial operations with simplicity, inclusivity, and reliability.
              </p>
            </div>
            
            <button className="bg-[#2F80ED] text-white hover:bg-blue-700 transition font-medium rounded-lg px-4 py-3 w-full md:w-[180px]">
              Create Invoice
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
