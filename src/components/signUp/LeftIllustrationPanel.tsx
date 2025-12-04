export default function LeftIllustrationPanel() {
  return (    
<div className="relative w-[705px] h-[984px] mt-5 ml-2 mb-0 flex items-center justify-center">
  {/* Background Image */}
      <img
    src="/assets/fullbackground.svg"
    alt="Fullbackground"
    className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
  />
  <div className='relative w-[552px] h-[649px] flex flex-col p-[40px] '>
    {/* Heading */}
    <div className="w-full font-['Inter_Tight'] font-medium text-[40px] leading-[120%] text-white">
      Automate your invoicing, stay tax-compliant,
    </div>

    {/* Subheading */}
    <div className="w-full font-['Inter_Tight'] font-normal text-[18px] leading-[140%] tracking-[1%] text-[#EFF8FF] mt-4">
      Generate invoices, manage clients, ad handle VAT/WHT effortlessly
    </div> 

    {/* Illustration Image */}
    <div className="flex-1 flex items-center justify-center mt-8">
      <img
        src="/assets/automated_invoice.svg"
        alt="automated_invoice"
        className="w-full max-w-[552px] h-auto object-contain"
      />
    </div>
  </div>
  
</div>

    

  );
}

