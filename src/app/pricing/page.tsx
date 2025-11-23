import Header from "@/components/header";
import Footer from "@/components/footer/Footer";
import FAQ from "@/components/FAQ";
import Image from "next/image";
import arrowDown from './../../../public/assets/icons/Hand-drawn arrow.svg';
import Testimonials from "@/components/testimonials";

const Pricing = ()=>{
    return(
        <>
            <div className="min-h-screen flex flex-col w-full overflow-hidden">
                <div className="relative overflow-hidden" style={{ backgroundImage: "url('/assets/Background pattern.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    {/* Top Right Eclipse - 80% visible inside page */}
                    <Image
                        src="/assets/top right eclipse.svg"
                        alt=""
                        width={600}
                        height={600}
                        className="absolute top-0 right-0 translate-x-[20%] pointer-events-none"
                    />
                    
                    {/* Mid Right Eclipse - 95% visible inside page */}
                    <Image
                        src="/assets/Mid Right Ellipse.svg"
                        alt=""
                        width={300}
                        height={300}
                        className="absolute top-[737px] left-0 -translate-x-[5%] -translate-y-1/2 pointer-events-none"
                    />
                    
                    <Header />
                    
                    {/* Pricing Section */}
                    <div className="flex flex-col items-center w-full max-w-[1280px] mx-auto mt-[54px] pb-[80px]">
                        {/* Badge */}
                        <span className="inline-block px-[16px] py-[6px] bg-[#EFF8FF] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[24px]">
                            Pricing
                        </span>
                        
                        {/* Heading */}
                        <h1 className="text-[50px] font-semibold text-center text-[#000000] leading-tight mb-[16px]">
                            Simple, Transparent Pricing for Every<br />Business Size
                        </h1>
                        
                        {/* Subheading */}
                        <p className="text-[#333436] text-center text-[16px] leading-tight mb-[32px]">
                            Start free. Scale as you grow. All plans include tax compliance tools built for Nigerian businesses.
                        </p>
                        
                        {/* Toggle */}
                        <div className="flex items-center gap-[16px] mb-[60px]">
                            <span className="text-[20px] font-medium text-[#7D7F81]">Monthly</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-[44px] h-[24px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-[#2F80ED]"></div>
                            </label>
                            <span className="text-[20px] font-medium text-[#000000]">Annually</span>
                            <span className="h-[24px] w-25 bg-[#E7FEF8] flex items-center justify-center text-[#059669] border-[0.5px] border-[#40C4AA] text-[12px] font-medium rounded-[6px]">
                                Save up to 17%
                            </span>
                        </div>
                        
                        {/* Most Popular Arrow - positioned above cards */}
                        <div className="relative w-[1254px] flex justify-start mb-[-25px]">
                            <div className="ml-[200px] flex flex-col items-center">
                                <span className="text-[#2F80ED] ml-[130px] text-[14px] mb-[-5px] font-medium">
                                    Most popular!
                                </span>
                                <Image
                                    src={arrowDown}
                                    alt="Arrow pointing to free trial"
                                    width={56}
                                    height={20}
                                />
                            </div>
                        </div>
                        
                        {/* Pricing Cards Container */}
                        <div className="relative w-[1254px] h-[618px] flex items-center justify-center gap-[24px]">

                            {/* Free Trial Card */}
                            <div className="w-[384px] h-[564px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm p-[32px] flex flex-col">
                                <h2 className="text-[48px] text-center font-semibold text-[#000000] mb-[8px]">₦0</h2>
                                <h3 className="text-[20px] text-center font-medium text-[#000] mb-[4px]">Free Trial</h3>
                                <p className="text-[14px] text-center text-[#333436] mb-[32px]">for 3 Invoices</p>
                                
                                <div className="flex flex-col gap-[16px] mb-[32px] flex-1">
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">3 Invoices to test the platform</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Tax calculator (VAT, WHT, PAYE)</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Basic invoice templates</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Email & WhatsApp sharing</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Payment tracking</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Email & WhatsApp sharing</span>
                                    </div>
                                </div>
                                
                                <button className="w-[320px] h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
                                    Start Free Trial
                                </button>
                                <p className="text-[12px] text-[#333436] text-center mt-[12px]">No credit card required</p>
                            </div>
                            
                            {/* Essentials Card */}
                            <div className="w-[384px] h-[564px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm pb-[12px] pt-[24px] px-[32px] flex flex-col">
                                <h2 className="text-[48px] text-center font-semibold text-[#000] mb-[8px]">₦24,000</h2>
                                <h3 className="text-[20px] text-center font-medium text-[#000] mb-[4px]">Essentials</h3>
                                <p className="text-[14px] text-center text-[#333436] mb-[4px]">/year</p>
                                <p className="text-[14px] text-center text-[#2F80ED] mb-[32px]">Save ₦9,600</p>
                                
                                <div className="flex flex-col gap-[16px] mb-[32px] flex-1">
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Up to 10 invoices per month</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Autofill client & item info</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Tax calculator (VAT, WHT, PAYE)</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">1 custom logo upload</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">1 company profile</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Top-rated mobile app</span>
                                    </div>
                                </div>
                                
                                <button className="h-[46px] w-[320px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
                                    Get Started
                                </button>
                                <p className="text-[12px] text-[#333436] text-center mt-[12px]">Perfect for small businesses and freelancers</p>
                            </div>
                            
                            {/* Premium Card */}
                            <div className="w-[384px] h-[564px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm pb-[12px] pt-[24px] px-[32px] flex flex-col">
                                <h2 className="text-[48px] text-center font-semibold text-[#000] mb-[8px]">₦120,000</h2>
                                <h3 className="text-[20px] text-center font-medium text-[#000] mb-[4px]">Premium</h3>
                                <p className="text-[14px] text-center text-[#333436] mb-[4px]">/year</p>
                                <p className="text-[14px] text-center text-[#2F80ED] mb-[32px]">Save ₦60,000</p>
                                
                                <div className="flex flex-col gap-[16px] mb-[32px] flex-1">
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Everything in Essentials, plus:</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Unlimited invoices per month</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Client signatures</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Multiple custom logos</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Premium invoice templates</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px]" />
                                        <span className="text-[14px] text-[#333436]">Multiple company profiles</span>
                                    </div>
                                </div>
                                
                                <button className="w-full h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
                                    Start Premium
                                </button>
                                <p className="text-[12px] text-[#333436] text-center mt-[12px]">For growing businesses with high invoice volume</p>
                            </div>
                        </div>
                    </div>
                </div>
                <FAQ/>
                <Testimonials/>
                <Footer/>
            </div>
        </>
    )
}
export default Pricing