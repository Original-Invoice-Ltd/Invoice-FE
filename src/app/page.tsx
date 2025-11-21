import Header from "@/components/header";
import Image from "next/image";
import arrowRight from './../../public/assets/arrow-right.svg';
import palleteImg from './../../public/assets/Pallete Content.svg';
import emailContent from './../../public/assets/Email Content.svg';

const  Home =()=> {
  return (
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
                
                <Header/>
                <div className="flex flex-col justify-center items-center w-full max-w-[1280px] mx-auto gap-[24px] mt-[54px]">
                    {/* Version Badge */}
                    <div className="flex items-center w-[326px] h-[32px] bg-[#EFF8FF] rounded-[16px] justify-center gap-2 text-[#2F80ED] text-sm">
                        <span className="font-medium rounded-[16px] flex items-center justify-center py-[2px] bg-white w-[88px] h-[24px] text-[14px]">Version 1.0</span>
                        <span className="flex items-center gap-1">
                  See the new invoice dashboard
                  <Image src={arrowRight} alt={'arrow right'} width={16} height={16}/>
                </span>
                    </div>

                    <div className="flex flex-col w-[1280px] h-[358px] items-center gap-[24px]">
                        <div className="flex items-center gap-[22px] flex-col">
                            {/* Main Heading */}
                            <h1 className="text-[58px] font-semibold max-w-[1000px] text-center text-[#000000]  leading-tight">
                                Smart Professional invoice generator with up to date tax calculator
                            </h1>

                            {/* Subheading */}
                            <p className="text-[#333436] text-center text-[18px] leading-tight max-w-[820px]">
                                Create professional invoices with ease and keep all your business details organized. Track payments as they come in and always know what&#39;s outstanding
                            </p>
                        </div>

                        {/* CTA Button */}
                        <button className="bg-[#2F80ED] px-[16px] text-white w-[221px] h-[56px] rounded-md font-medium text-[16px] hover:bg-[#2563EB] transition-colors ">
                            Start Your Free Trial Today
                        </button>
                    </div>

                    {/* Laptop Mockup */}
                    <div className="w-full flex flex-col mt-[-50px] items-center">
                        <Image
                            src="/assets/Macbook Pro.svg"
                            alt="Invoice Dashboard"
                            width={1000}
                            height={594}
                            className="w-[1000px] h-[594px]"
                            priority
                        />
                    </div>
                </div>

            </div>

            {/*Section below the macbook */}
            <div className="flex flex-col ml-[80px] w-[1280px] h-[2356px] gap-[34px] mt-[40px]">
                <div className="w-[775px] h-[304px] gap-[24px] flex flex-col">
                    <span className="w-[106px] h-[28px] rounded-[16px] text-[14px] font-medium bg-[#EFF8FF] flex items-center justify-center text-[#2F80ED]">
                        How it works
                    </span>
                    <div className="gap-[32px] flex flex-col h-[252px] w-[775px]">
                        <div className="flex w-full h-[166px] flex-col gap-[20]">
                            <p className="text-[38px] leading-tight font-medium text-[#000] max-w-775px">A simple workflow for every invoice you create</p>
                            <p className="text-[16px] leading-tight text-[#333436] max-w-775px">Follow a simple flow that keeps your invoicing clear, organized, and easy to manage. Each step helps you stay focused while the system handles the details.</p>
                        </div>
                        <button className="bg-[#2F80ED] px-[16px] text-white w-[180px] h-[54px] rounded-md font-medium text-[16px] hover:bg-[#2563EB] ">
                            Get Started
                        </button>
                    </div>
                </div>
                {/* section with color palette */}
                <div className="w-full h-[1998px] gap-[40px] flex flex-col">
                    <div className="flex h-[626px] gap-[30px] w-full items-center">
                        <div className="flex flex-col gap-[26px]">
                            <div className="flex flex-col gap-[20px]">
                                <p className="text-[32px] text-[#000] font-medium">Create your invoice</p>
                                <p className="text-[18px] leading-tight max-w-[553px] text-[#333436]">
                                    Bring your invoice to life in a clean editor that guides your flow. Add products or services, apply VAT or WHT, and personalize notes—all without breaking your pace.Every change reflects immediately, giving you clarity and confidence in what you’re sending
                                </p>
                            </div>
                            <button className="bg-[#2F80ED] px-[16px] text-white w-[180px] h-[54px] rounded-md font-medium text-[16px] hover:bg-[#2563EB] ">
                                Create Invoice
                            </button>
                        </div>
                        <Image
                            src={palleteImg} alt={'pallete image'}
                            width={603}
                            height={626}
                            className="h-[626px] w-[603px]"
                        />
                    </div>

                    {/*second section after pallete*/}
                    <div className="flex h-[620px]  w-full items-center">
                        <Image
                            src={emailContent} alt={'email image'}
                            width={603}
                            height={620}
                            className="h-[620px] w-[603px]"
                        />
                        <div className="flex flex-col gap-[26px]">
                            <div className="flex flex-col gap-[20px]">
                                <p className="text-[32px] text-[#000] font-medium">Send to your client</p>
                                <p className="text-[18px] leading-tight max-w-[553px] text-[#333436]">
                                    Send your invoice with one click, choose the format that fits your client, and deliver a professional experience every time.Whether you share a link, attach a PDF, or print a copy, everything stays neatly organized on your dashboard.
                                </p>
                            </div>
                            <button className="bg-[#2F80ED] px-[16px] text-white w-[180px] h-[54px] rounded-md font-medium text-[16px] hover:bg-[#2563EB] ">
                                Create Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </>
  );
}
export default Home;