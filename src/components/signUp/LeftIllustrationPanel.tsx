export default function LeftIllustrationPanel() {
  return (    
<div className="relative w-[calc(100%-16px)] h-[calc(100%-16px)] m-2 flex items-center justify-center">
  {/* Background Image */}
  <img
    src="/assets/fullbackground.svg"
    alt="Fullbackground"
    className="absolute inset-0 w-full h-full object-cover rounded-[16px] md:rounded-[16px] lg:rounded-[24px]"
  />
  <div className='relative w-full   h-full flex flex-col justify-between p-6 md:p-6 lg:p-10'>
    {/* Top Section - Text */}
    <div className="pt-4 md:pt-6  lg:pt-10">
      {/* Heading */}
      <div className="w-full font-['Inter_Tight'] font-medium text-[24px] md:text-[28px] lg:text-[36px] leading-[120%] text-white">
        Automate your invoicing, stay tax-compliant,
      </div>

      {/* Subheading */}
      <div className="w-full font-['Inter_Tight'] font-normal text-[12px] md:text-[14px] lg:text-[16px] leading-[140%] tracking-[1%] text-[#EFF8FF] mt-2 md:mt-3 lg:mt-3">
        Generate invoices, manage clients, ad handle VAT/WHT effortlessly
      </div>
    </div>

    {/* Bottom Section - Illustration Image */}
    <div className="flex items-end justify-center pb-4 md:pb-6 lg:pb-0">
       <img
        src="/assets/automated_invoice.svg"
        alt="automated_invoice"
        className="w-full max-w-[90%] md:max-w-[85%] lg:max-w-[320px] h-auto object-contain"
      /> 
    </div>
  </div>
  
</div>
  );
}

