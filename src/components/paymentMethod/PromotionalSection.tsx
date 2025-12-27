import React from 'react';
import Image from 'next/image';

const PromotionalSection: React.FC = () => {
  return (
    <div 
      className="relative rounded-3xl overflow-hidden"
      style={{
        width: '700px',
        height: '900px',
        top: '20px',
        left: '20px',
        background: 'linear-gradient(180deg, #2563EB 0%, #1E40AF 100%)',
      }}
    >
      {/* Background decorative circles */}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-20 px-12">
        {/* Logo */}
        <div className="mb-12">
          <Image
            src="/assets/OriginalInvoiceWhiteLogo.svg"
            alt="Original Invoice"
            width={200}
            height={60}
            priority
          />
        </div>

        {/* Heading */}
        <p className="text-white/90 text-center text-lg mb-6">
          Unlock unlimited invoices and advanced features
        </p>

        {/* Price */}
        <h2 className="text-white font-bold text-5xl mb-12">
          NGN 24,000
        </h2>

        {/* Features Card */}
        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
          <ul className="space-y-5">
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">3 invoices to test the platform</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Tax calculator (VAT, WHT, PAYE)</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Basic invoice templates</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Email & WhatsApp sharing</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Payment tracking</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700">Email & WhatsApp sharing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PromotionalSection;
