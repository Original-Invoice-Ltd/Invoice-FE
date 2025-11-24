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
      <div className="text-blue-600 mb-4 flex items-center justify-center">
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
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.0007 2.95051C15.6331 2.76578 15.2237 2.6665 14.8031 2.6665H9.33398C7.12485 2.6665 5.33398 4.45736 5.33398 6.6665V25.3332C5.33398 27.5423 7.12485 29.3332 9.33398 29.3332H22.6673C24.8765 29.3332 26.6673 27.5423 26.6673 25.3332V15.6804C26.6673 15.3297 26.5982 14.9856 26.4671 14.6665M16.0007 2.95051C16.2989 3.10039 16.5696 3.30653 16.7962 3.56153L25.9937 13.9087C26.1947 14.1348 26.3539 14.3913 26.4671 14.6665M16.0007 2.95051V10.6665C16.0007 12.8756 17.7915 14.6665 20.0007 14.6665H26.4671" stroke="#2F80ED" strokeWidth="1.5"/>
              </svg>
            }
            title="Simplicity"
            description="Effortless tools for powerful results. We ensure one-click access to frequent actions and keep the workflow minimal, from invoice creation to sending."
          />
          
          <ValueCard 
            icon={
             <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22.667 18.667C26.3487 18.6671 29.3328 21.6514 29.333 25.333V26.667C29.3328 27.4032 28.7363 28 28 28H23.832C23.9417 27.5739 24 27.1273 24 26.667V25.333C23.9999 22.8106 23.124 20.493 21.6602 18.667H22.667ZM21.333 4C24.2784 4 26.6668 6.38764 26.667 9.33301C26.667 12.2785 24.2785 14.667 21.333 14.667C20.8027 14.667 20.2911 14.5875 19.8076 14.4434C20.7706 12.975 21.333 11.2201 21.333 9.33301C21.3329 7.4458 20.7707 5.69102 19.8076 4.22266C20.291 4.07856 20.8028 4.00004 21.333 4Z" fill="#2F80ED"/>
<path d="M13.3333 18.6667H10.6667C6.98477 18.6667 4 21.6514 4 25.3333V26.6667C4 27.403 4.59695 28 5.33333 28H18.6667C19.403 28 20 27.403 20 26.6667V25.3333C20 21.6514 17.0152 18.6667 13.3333 18.6667Z" stroke="#2F80ED" strokeWidth="1.5"/>
<path d="M12 14.6667C14.9455 14.6667 17.3333 12.2789 17.3333 9.33333C17.3333 6.38781 14.9455 4 12 4C9.05448 4 6.66667 6.38781 6.66667 9.33333C6.66667 12.2789 9.05448 14.6667 12 14.6667Z" stroke="#2F80ED" strokeWidth="1.5"/>
</svg>

            }
            title="Transparency"
            description="Clarity in every transaction. You and your clients will always see a clear breakdown of tax computations (VAT, WHT, PAYE) and payment progress."
          />
          
          <ValueCard 
            icon={
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.668 4.58301C25.2911 4.58318 27.4178 6.70991 27.418 9.33301V11.6943H28.001C29.1513 11.6945 30.0847 12.6271 30.085 13.7773V18C30.0848 19.1503 29.1513 20.0828 28.001 20.083H27.418V22.666C27.418 25.2893 25.2912 27.4158 22.668 27.416H6.66797C4.04462 27.416 1.91797 25.2894 1.91797 22.666V9.33301C1.91814 6.70981 4.04472 4.58301 6.66797 4.58301H22.668ZM6.66797 6.08301C4.87315 6.08301 3.41814 7.53823 3.41797 9.33301V22.666C3.41797 24.4609 4.87304 25.916 6.66797 25.916H22.668C24.4627 25.9158 25.918 24.4608 25.918 22.666V20.083H19.4453C17.129 20.0828 15.251 18.205 15.251 15.8887C15.2512 13.5724 17.1291 11.6946 19.4453 11.6943H25.918V9.33301C25.9178 7.53834 24.4626 6.08318 22.668 6.08301H6.66797ZM19.4453 13.1943C17.9575 13.1946 16.7512 14.4009 16.751 15.8887C16.751 17.3766 17.9574 18.5828 19.4453 18.583H28.001C28.3229 18.5828 28.5848 18.3219 28.585 18V13.7773C28.5847 13.4555 28.3228 13.1945 28.001 13.1943H19.4453ZM19.334 14.667C20.0704 14.667 20.668 15.2636 20.668 16C20.668 16.7364 20.0704 17.333 19.334 17.333C18.5978 17.3328 18.001 16.7363 18.001 16C18.001 15.2637 18.5978 14.6672 19.334 14.667Z" fill="#2F80ED"/>
              </svg>
            }
            title="Inclusivity"
            description="Billing accessible to all. We support multilingual communication (English, Hausa, Igbo, Yoruba) and design for universal accessibility (WCAG) across devices."
          />
          
          <ValueCard 
            icon={
              <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.6667 4H6.66667C5.19391 4 4 5.19391 4 6.66667V10.6667C4 12.1394 5.19391 13.3333 6.66667 13.3333H10.6667C12.1394 13.3333 13.3333 12.1394 13.3333 10.6667V6.66667C13.3333 5.19391 12.1394 4 10.6667 4Z" stroke="#2F80ED" strokeWidth="1.5"/>
                <path d="M25.3333 4H21.3333C19.8606 4 18.6667 5.19391 18.6667 6.66667V10.6667C18.6667 12.1394 19.8606 13.3333 21.3333 13.3333H25.3333C26.8061 13.3333 28 12.1394 28 10.6667V6.66667C28 5.19391 26.8061 4 25.3333 4Z" stroke="#2F80ED" strokeWidth="1.5"/>
                <path d="M10.6667 18.6667H6.66667C5.19391 18.6667 4 19.8606 4 21.3333V25.3333C4 26.8061 5.19391 28 6.66667 28H10.6667C12.1394 28 13.3333 26.8061 13.3333 25.3333V21.3333C13.3333 19.8606 12.1394 18.6667 10.6667 18.6667Z" stroke="#2F80ED" strokeWidth="1.5"/>
                <path d="M25.3333 18.6667H21.3333C19.8606 18.6667 18.6667 19.8606 18.6667 21.3333V25.3333C18.6667 26.8061 19.8606 28 21.3333 28H25.3333C26.8061 28 28 26.8061 28 25.3333V21.3333C28 19.8606 26.8061 18.6667 25.3333 18.6667Z" stroke="#2F80ED" strokeWidth="1.5"/>
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
