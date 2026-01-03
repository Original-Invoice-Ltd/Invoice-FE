"use client";

import Header from "@/components/header";
import Footer from "@/components/footer/Footer";
import Image from "next/image";
import Link from "next/link";
import arrowRight from './../../public/assets/arrow-right.svg';
import palleteImg from './../../public/assets/Pallete Content.svg';
import emailContent from './../../public/assets/Email Content.svg';
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/testimonials";
import CTAButton from "@/components/ui/CTAButton";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

const  Home =()=> {
  const [isVisible, setIsVisible] = useState(false);
  const [isPalleteVisible, setIsPalleteVisible] = useState(false);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [isTrackPaymentVisible, setIsTrackPaymentVisible] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const macbookRef = useRef<HTMLDivElement>(null);
  const palleteRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const trackPaymentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === macbookRef.current) {
              setIsVisible(true);
            } else if (entry.target === palleteRef.current) {
              setIsPalleteVisible(true);
            } else if (entry.target === emailRef.current) {
              setIsEmailVisible(true);
            } else if (entry.target === trackPaymentRef.current) {
              setIsTrackPaymentVisible(true);
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    );

    if (macbookRef.current) observer.observe(macbookRef.current);
    if (palleteRef.current) observer.observe(palleteRef.current);
    if (emailRef.current) observer.observe(emailRef.current);
    if (trackPaymentRef.current) observer.observe(trackPaymentRef.current);

    return () => {
      if (macbookRef.current) observer.unobserve(macbookRef.current);
      if (palleteRef.current) observer.unobserve(palleteRef.current);
      if (emailRef.current) observer.unobserve(emailRef.current);
      if (trackPaymentRef.current) observer.unobserve(trackPaymentRef.current);
    };
  }, []);
  return (
      <>
        <div className="min-h-screen flex flex-col w-full overflow-hidden">
            <div className="relative overflow-hidden" style={{ backgroundImage: "url('/assets/Background pattern.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
                {/* Top Right Eclipse - 80% visible inside page - Hidden on mobile */}
                <Image
                    src="/assets/top right eclipse.svg"
                    alt=""
                    width={600}
                    height={600}
                    className="hidden lg:block absolute top-0 right-0 translate-x-[20%] pointer-events-none"
                />
                
                {/* Mid Right Eclipse - 95% visible inside page - Hidden on mobile */}
                <Image
                    src="/assets/Mid Right Ellipse.svg"
                    alt=""
                    width={300}
                    height={300}
                    className="hidden lg:block absolute top-[737px] left-0 -translate-x-[5%] -translate-y-1/2 pointer-events-none"
                />
                
                <Header/>
                <div className="flex flex-col justify-center items-center w-full max-w-[1280px] mx-auto gap-[24px] mt-[54px] px-4 lg:px-0">
                    {/* Version Badge - Hidden on mobile */}
                    <div className="hidden lg:flex items-center w-[326px] h-[32px] bg-[#EFF8FF] rounded-[16px] justify-center gap-2 text-[#2F80ED] text-sm">
                        <span className="font-medium rounded-[16px] flex items-center justify-center py-[2px] bg-white w-[88px] h-[24px] text-[14px]">Version 1.0</span>
                        <span className="flex items-center gap-1">
                  See the new invoice dashboard
                  <Image src={arrowRight} alt={'arrow right'} width={16} height={16}/>
                </span>
                    </div>

                    <div className="flex flex-col w-full lg:w-[1280px] items-center gap-[24px]">
                        <div className="flex items-center gap-[22px] flex-col">
                            {/* Main Heading */}
                            <h1 className="text-[32px] lg:text-[58px] font-semibold max-w-[358px] lg:max-w-[1000px] text-center text-[#000000] leading-tight">
                                Smart Professional invoice generator with up to date tax calculator
                            </h1>

                            {/* Subheading */}
                            <p className="text-[#333436] text-center text-[14px] lg:text-[18px] leading-tight max-w-[358px] lg:max-w-[820px] px-4 lg:px-0">
                                Create professional invoices with ease and keep all your business details organized. Track payments as they come in and always know what&#39;s outstanding
                            </p>
                        </div>

                        {/* CTA Button */}
                        {!isAuthenticated && (
                            <Link href="/signUp" className="bg-[#2F80ED] px-[16px] text-white w-full max-w-[343px] lg:w-[221px] h-[56px] rounded-md font-medium text-[16px] hover:bg-[#2563EB] transition-colors flex items-center justify-center cursor-pointer">
                                Start Your Free Trial Today
                            </Link>
                        )}
                    </div>

                    {/* Laptop Mockup */}
                    <div className="w-full flex flex-col mt-[20px] lg:mt-[50px] items-center">
                        <div 
                            ref={macbookRef}
                            className={`transition-all duration-[4000ms] ease-in-out ${
                                isVisible 
                                    ? 'opacity-100 translate-y-0' 
                                    : 'opacity-0 translate-y-16'
                            }`}
                        >
                            <Image
                                src="/assets/Macbook Pro.svg"
                                alt="Invoice Dashboard"
                                width={1000}
                                height={394}
                                className="w-full max-w-[343px] h-auto lg:max-w-none"
                                priority
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/*Section below the macbook */}
            <div className="flex flex-col px-4 lg:px-[80px] w-full max-w-[1280px] mx-auto gap-[24px] mt-[40px] relative">
                <div className="flex items-start justify-between w-full">
                    <div className="w-full lg:w-[775px] gap-[24px] flex flex-col relative z-10">
                        <span className="w-[106px] h-[28px] rounded-[16px] text-[14px] font-medium bg-[#EFF8FF] flex items-center justify-center text-[#2F80ED]">
                            How it works
                        </span>
                        <div className="gap-[32px] flex flex-col w-full">
                            <div className="flex w-full flex-col gap-[20px]">
                                <p className="text-[24px] lg:text-[38px] leading-tight font-medium text-[#000]">A simple workflow for every invoice you create</p>
                                <p className="text-[14px] lg:text-[16px] leading-tight text-[#333436]">Follow a simple flow that keeps your invoicing clear, organized, and easy to manage. Each step helps you stay focused while the system handles the details.</p>
                            </div>
                            {!isAuthenticated && (
                                <Link href="/signUp" className="bg-[#2F80ED] px-[16px] text-white w-[180px] h-[54px] rounded-md font-medium text-[16px] hover:bg-[#2563EB] flex items-center justify-center cursor-pointer">
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </div>
                    
                    {/* Top Right Eclipse - in the empty space */}
                    <div className="hidden lg:flex flex-1 items-start justify-end">
                        <Image
                            src="/assets/top right eclipse.svg"
                            alt=""
                            width={500}
                            height={500}
                            className="pointer-events-none opacity-80"
                        />
                    </div>
                </div>
                {/* section with color palette */}
                <div className="w-full flex flex-col gap-[5px] overflow-hidden">
                    <div className="flex flex-col lg:flex-row gap-[30px] w-full items-center">
                        <div className="flex flex-col gap-[26px] justify-center w-full lg:w-auto">
                            <div className="flex flex-col gap-[20px]">
                                <p className="text-[24px] lg:text-[32px] text-[#000] font-medium">Create your invoice</p>
                                <p className="text-[14px] lg:text-[18px] leading-tight max-w-[358px] lg:max-w-[553px] text-[#333436]">
                                    Bring your invoice to life in a clean editor that guides your flow. Add products or services, apply VAT or WHT, and personalize notes—all without breaking your pace.Every change reflects immediately, giving you clarity and confidence in what you’re sending
                                </p>
                            </div>
                            <CTAButton text="Create Invoice" />
                        </div>
                        <div 
                            ref={palleteRef}
                            className={`transition-all duration-700 ease-out w-full lg:w-auto ${
                                isPalleteVisible 
                                    ? 'opacity-100 translate-x-0' 
                                    : 'opacity-0 translate-x-20'
                            }`}
                        >
                            <Image
                                src={palleteImg} alt={'pallete image'}
                                width={500}
                                height={420}
                                className="w-full lg:max-w-[500px] h-auto"
                            />
                        </div>
                    </div>

                    {/*second section after pallete*/}
                    <div className="flex flex-col lg:flex-row gap-[30px] w-full items-center">
                        <div 
                            ref={emailRef}
                            className={`transition-all duration-700 ease-out order-2 lg:order-1 w-full lg:w-auto ${
                                isEmailVisible 
                                    ? 'opacity-100 translate-x-0' 
                                    : 'opacity-0 -translate-x-20'
                            }`}
                        >
                            <Image
                                src={emailContent} alt={'email image'}
                                width={500}
                                height={420}
                                className="w-full lg:max-w-[500px] h-auto"
                            />
                        </div>
                        <div className="flex flex-col gap-[26px] justify-center order-1 lg:order-2">
                            <div className="flex flex-col gap-[20px]">
                                <p className="text-[24px] lg:text-[32px] text-[#000] font-medium">Send to your client</p>
                                <p className="text-[14px] lg:text-[18px] leading-tight max-w-[358px] lg:max-w-[553px] text-[#333436]">
                                    Send your invoice with one click, choose the format that fits your client, and deliver a professional experience every time.Whether you share a link, attach a PDF, or print a copy, everything stays neatly organized on your dashboard.
                                </p>
                            </div>
                            <CTAButton text="Create Invoice" />
                        </div>
                    </div>

                    {/* Track payments section */}
                    <div className="flex flex-col lg:flex-row gap-[30px] w-full items-center">
                        <div className="flex flex-col gap-[26px] justify-center">
                            <div className="flex flex-col gap-[20px]">
                                <p className="text-[24px] lg:text-[32px] text-[#000] font-medium">Track payments</p>
                                <p className="text-[14px] lg:text-[18px] leading-tight max-w-[358px] lg:max-w-[553px] text-[#333436]">
                                    Stay on top of your cash flow with clear status updates and easy payment recording.
                                    Quickly mark payments, review outstanding totals, and keep everything organized without switching between tools.
                                </p>
                            </div>
                            <CTAButton text="Create Invoice" />
                        </div>
                        <div 
                            ref={trackPaymentRef}
                            className={`transition-all duration-700 ease-out w-full lg:w-auto ${
                                isTrackPaymentVisible 
                                    ? 'opacity-100 translate-x-0' 
                                    : 'opacity-0 translate-x-20'
                            }`}
                        >
                            <Image
                                src="/assets/TrackPayment.svg" alt={'track payment image'}
                                width={500}
                                height={420}
                                className="w-full lg:max-w-[500px] h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features-section" className="w-full bg-[#EFF8FF] py-[40px] lg:py-[80px] mt-[40px]">
                <div className="max-w-[1280px] mx-auto lg:px-[80px]">
                    <div className="text-center mb-[40px] lg:mb-[60px] px-4">
                        <span className="inline-block px-[16px] py-[6px] bg-[#e0f1ff] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[24px]">
                            Features
                        </span>
                        <h2 className="text-[24px] lg:text-[38px] font-medium text-[#000] mb-[16px] leading-tight">
                            Everything you need to manage your invoices<br className="hidden lg:block" /> in one place
                        </h2>
                        <p className="text-[14px] lg:text-[18px] text-[#333436] max-w-[358px] lg:max-w-[600px] mx-auto leading-relaxed">
                            A thoughtful set of tools that help you create invoices, stay organized, and keep track of payments.
                            Designed to support the everyday rhythm of your business.
                        </p>
                    </div>

                    <div className="flex overflow-x-auto gap-[16px] pl-4 lg:grid lg:grid-cols-4 lg:gap-[24px] lg:px-0 snap-x snap-mandatory"
                         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <div className="group bg-white p-[16px] lg:p-[32px] rounded-[12px] shadow-sm hover:bg-[#2F80ED] transition-all duration-300 cursor-pointer w-[286px] lg:w-auto lg:min-w-0 lg:max-w-none snap-start flex-shrink-0">
                            <div className="w-[48px] h-[48px] flex items-center justify-center mb-[24px] transition-all duration-300">
                                <Image
                                    src="/assets/icons/SmartInvoceCreation.svg"
                                    alt="Smart Invoice Creation"
                                    width={24}
                                    height={24}
                                    className="transition-all duration-300"
                                    style={{ 
                                        filter: 'invert(42%) sepia(93%) saturate(1352%) hue-rotate(187deg) brightness(97%) contrast(91%)'
                                    }}
                                />
                            </div>
                            <h3 className="text-[18px] lg:text-[20px] font-medium text-[#000] group-hover:text-white mb-[12px] transition-colors duration-300 leading-snug">Smart Invoice Creation</h3>
                            <p className="text-[14px] lg:text-[16px] text-[#333436] group-hover:text-white leading-relaxed transition-colors duration-300">
                                Create invoices with client details, items, taxes, and notes in a clean editor that updates instantly as you work.
                            </p>
                        </div>

                        <div className="group bg-white p-[16px] lg:p-[32px] rounded-[12px] shadow-sm hover:bg-[#2F80ED] transition-all duration-300 cursor-pointer w-[286px] lg:w-auto lg:min-w-0 snap-start flex-shrink-0">
                            <div className="w-[48px] h-[48px] flex items-center justify-center mb-[16px] lg:mb-[24px] transition-all duration-300">
                                <Image
                                    src="/assets/icons/ClientManagement.svg"
                                    alt="Client Management"
                                    width={24}
                                    height={24}
                                    className="group-hover:brightness-0 group-hover:invert transition-all duration-300"
                                />
                            </div>
                            <h3 className="text-[18px] lg:text-[20px] font-medium text-[#000] group-hover:text-white mb-[12px] transition-colors duration-300 leading-snug">Client Management</h3>
                            <p className="text-[14px] lg:text-[16px] text-[#333436] group-hover:text-white leading-relaxed transition-colors duration-300">
                                Keep your client information organized with profiles that store balances, contacts, and the invoices you've shared.
                            </p>
                        </div>

                        <div className="group bg-white p-[16px] lg:p-[32px] rounded-[12px] shadow-sm hover:bg-[#2F80ED] transition-all duration-300 cursor-pointer w-[286px] lg:w-auto lg:min-w-0 snap-start flex-shrink-0">
                            <div className="w-[48px] h-[48px] flex items-center justify-center mb-[16px] lg:mb-[24px] transition-all duration-300">
                                <Image
                                    src="/assets/icons/PaymentTracking.svg"
                                    alt="Payment Tracking"
                                    width={24}
                                    height={24}
                                    className="group-hover:brightness-0 group-hover:invert transition-all duration-300"
                                />
                            </div>
                            <h3 className="text-[18px] lg:text-[20px] font-medium text-[#000] group-hover:text-white mb-[12px] transition-colors duration-300 leading-snug">Payment Tracking</h3>
                            <p className="text-[14px] lg:text-[16px] text-[#333436] group-hover:text-white leading-relaxed transition-colors duration-300">
                                Follow every invoice from draft to paid with clear status indicators that help you stay aware of what's outstanding.
                            </p>
                        </div>

                        <div className="group bg-white p-[16px] lg:p-[32px] rounded-[12px] shadow-sm hover:bg-[#2F80ED] transition-all duration-300 cursor-pointer w-[286px] lg:w-auto lg:min-w-0 snap-start flex-shrink-0">
                            <div className="w-[48px] h-[48px] flex items-center justify-center mb-[16px] lg:mb-[24px] transition-all duration-300">
                                <Image
                                    src="/assets/icons/ReportsAndHistory.svg"
                                    alt="Reports & History"
                                    width={24}
                                    height={24}
                                    className="group-hover:brightness-0 group-hover:invert transition-all duration-300"
                                />
                            </div>
                            <h3 className="text-[18px] lg:text-[20px] font-medium text-[#000] group-hover:text-white mb-[12px] transition-colors duration-300 leading-snug">Reports & History</h3>
                            <p className="text-[14px] lg:text-[16px] text-[#333436] group-hover:text-white leading-relaxed transition-colors duration-300">
                                Review your invoices, payments, and client activity in simple summaries that help you understand your business.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Original Invoice Section */}
            <div className="w-full py-[60px] lg:py-[80px]">
                <div className="max-w-[1280px] mx-auto px-[16px] md:px-[40px] lg:px-[80px]">
                    <div className="mb-[40px] lg:mb-[60px]">
                        <h2 className="text-[32px] md:text-[38px] font-medium text-[#000] mb-[16px] leading-tight">
                            Why Choose Original Invoice
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-[#333436] max-w-[600px] leading-relaxed">
                            Built for simplicity, tax compliance, and fast payments, everything you need to run your business with confidence.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[60px] items-center">
                        {/* Left Side - Features List */}
                        <div className="w-full lg:w-1/2 space-y-[32px]">
                            <div className="flex gap-[16px]">
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/assets/icons/TaxCompliance.svg"
                                        alt="Tax Compliance"
                                        width={64}
                                        height={64}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-[18px] md:text-[20px] font-medium text-[#000] mb-[8px]">Tax Compliance Made Easy</h3>
                                    <p className="text-[14px] md:text-[16px] text-[#333436] leading-relaxed">
                                        Automatically apply VAT, WHT, and PAYE accurately with a clear breakdown on every invoice.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-[16px]">
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/assets/icons/SmartAutomation.svg"
                                        alt="Smart Automation"
                                        width={64}
                                        height={64}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-[18px] md:text-[20px] font-medium text-[#000] mb-[8px]">Smart Automation</h3>
                                    <p className="text-[14px] md:text-[16px] text-[#333436] leading-relaxed">
                                        Your invoices follow up themselves: reminders, overdue alerts, recurring billing, and real-time status updates.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-[16px]">
                                <div className="flex-shrink-0">
                                    <Image
                                        src="/assets/icons/ProfessionalTemplates.svg"
                                        alt="Professional Templates"
                                        width={64}
                                        height={64}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-[18px] md:text-[20px] font-medium text-[#000] mb-[8px]">Professional Templates</h3>
                                    <p className="text-[14px] md:text-[16px] text-[#333436] leading-relaxed">
                                        Customizable, modern invoice templates with your branding and multilingual support.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Image */}
                        <div className="w-full lg:w-1/2 flex justify-center">
                            <Image
                                src="/assets/WhyChooseOriginalinvoice.svg"
                                alt="Why Choose Original Invoice"
                                width={600}
                                height={500}
                                className="w-full max-w-[600px] h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <FAQ/>
            {/* Testimonials Section */}
            <Testimonials/>
            {/* Footer */}
            <Footer />
        </div>
      </>
  );
}
export default Home;