export default function LeftIllustrationPanel() {
  return (    
<div className="relative w-[705px] h-[984px] mt-5 ml-2 mb-5">
  
  {/* Background Image */}
  <img
    src="/assets/fullbackground.svg"
    alt="Fullbackground"
    className="absolute inset-0 w-full h-full object-cover rounded-[24px]"
  />

  {/* First Text */}
  <div className="absolute top-10 left-10 w-[552px] h-[96px] font-['Inter_Tight']
  font-medium text-[40px] leading-[120%] text-white mt-12">
    Automate your invoicing, stay tax-compliant,
  </div>

  {/* Second Text */}
  <div className="absolute top-[120px] left-10 w-[552px] h-[25px] font-['Inter_Tight']
  font-normal text-[18px] leading-[140%] tracking-[1%] text-[#EFF8FF] mt-18">
    Generate invoices, manage clients, and handle VAT/WHT effortlessly
  </div>

  {/* The missing image (fixed) */}
  <img
    src="/assets/automated_invoice.svg"
    alt="automated_invoice"
    className="absolute z-20 w-[350px] h-[350px] object-contain top-[300px] left-[50px]"
  />

</div>

    

  );
}

