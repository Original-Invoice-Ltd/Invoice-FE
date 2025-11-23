import TestimonialsCarousel from "@/components/testimonials/TestimonialsCarousel";

const Testimonials = ()=>{
    return (
        <>
            <div className="w-full py-[40px] lg:py-[80px]">
                <div className="max-w-[1280px] mx-auto px-4 lg:px-[80px]">
                    <div className="text-center mb-[40px] lg:mb-[60px]">
                        <span className="inline-block px-[16px] py-[6px] bg-[#EFF8FF] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[24px]">
                            Testimonials
                        </span>
                        <h2 className="text-[24px] lg:text-[38px] font-medium text-[#000] mb-[16px] leading-tight">
                            Trusted by Nigerian Businesses
                        </h2>
                        <p className="text-[14px] lg:text-[18px] text-[#333436] max-w-[358px] lg:max-w-[600px] mx-auto leading-relaxed">
                            Join thousands of freelancers, SMEs, and enterprises who&#39;ve simplified their invoicing and stay tax-compliant effortlessly
                        </p>
                    </div>

                    <TestimonialsCarousel />
                </div>
            </div>
        </>
    )
}

export default Testimonials