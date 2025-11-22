import Header from "@/components/header";
import Footer from "@/components/footer/Footer";
import FAQItem from "@/components/FAQ/FAQItem";
import TestimonialsCarousel from "@/components/testimonials/TestimonialsCarousel";
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
            <div className="flex flex-col ml-[80px] w-[1280px] h-[2356px] gap-[24px] mt-[40px]">
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
                <div className="w-full h-[1998px] flex flex-col">
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

                    {/* Track payments section */}
                    <div className="flex h-[620px] gap-[30px] w-full items-center">
                        <div className="flex flex-col gap-[26px]">
                            <div className="flex flex-col gap-[20px]">
                                <p className="text-[32px] text-[#000] font-medium">Track payments</p>
                                <p className="text-[18px] leading-tight max-w-[553px] text-[#333436]">
                                    Stay on top of your cash flow with clear status updates and easy payment recording.
                                    Quickly mark payments, review outstanding totals, and keep everything organized without switching between tools.
                                </p>
                            </div>
                            <button className="bg-[#2F80ED] px-[16px] text-white w-[180px] h-[54px] rounded-md font-medium text-[16px] hover:bg-[#2563EB] ">
                                Create Invoice
                            </button>
                        </div>
                        <Image
                            src="/assets/TrackPayment.svg" alt={'track payment image'}
                            width={603}
                            height={620}
                            className="h-[620px] w-[603px]"
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="w-full bg-[#eff8ff] py-[80px] mt-[80px]">
                <div className="max-w-[1280px] mx-auto px-[80px]">
                    <div className="text-center mb-[60px]">
                        <span className="inline-block px-[16px] py-[6px] bg-[#EFF8FF] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[24px]">
                            Features
                        </span>
                        <h2 className="text-[38px] font-medium text-[#000] mb-[16px] leading-tight">
                            Everything you need to manage your invoices<br />in one place
                        </h2>
                        <p className="text-[18px] text-[#333436] max-w-[600px] mx-auto leading-relaxed">
                            A thoughtful set of tools that help you create invoices, stay organized, and keep track of payments.
                            Designed to support the everyday rhythm of your business.
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-[24px]">
                        <div className="bg-white p-[32px] rounded-[12px] shadow-sm">
                            <div className="w-[48px] h-[48px] bg-[#EFF8FF] rounded-[8px] flex items-center justify-center mb-[24px]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M14 2V8H20" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 13H8" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 17H8" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 9H9H8" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-[20px] font-medium text-[#000] mb-[12px]">Smart Invoice Creation</h3>
                            <p className="text-[16px] text-[#333436] leading-relaxed">
                                Create invoices with client details, items, taxes, and notes in a clean editor that updates instantly as you work.
                            </p>
                        </div>

                        <div className="bg-white p-[32px] rounded-[12px] shadow-sm">
                            <div className="w-[48px] h-[48px] bg-[#EFF8FF] rounded-[8px] flex items-center justify-center mb-[24px]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="7" r="4" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-[20px] font-medium text-[#000] mb-[12px]">Client Management</h3>
                            <p className="text-[16px] text-[#333436] leading-relaxed">
                                Keep your client information organized with profiles that store balances, contacts, and the invoices you've shared.
                            </p>
                        </div>

                        <div className="bg-white p-[32px] rounded-[12px] shadow-sm">
                            <div className="w-[48px] h-[48px] bg-[#EFF8FF] rounded-[8px] flex items-center justify-center mb-[24px]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="3" width="15" height="13" rx="2" ry="2" stroke="#2F80ED" strokeWidth="2"/>
                                    <path d="M16 8L20 12L16 16" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-[20px] font-medium text-[#000] mb-[12px]">Payment Tracking</h3>
                            <p className="text-[16px] text-[#333436] leading-relaxed">
                                Follow every invoice from draft to paid with clear status indicators that help you stay aware of what's outstanding.
                            </p>
                        </div>

                        <div className="bg-white p-[32px] rounded-[12px] shadow-sm">
                            <div className="w-[48px] h-[48px] bg-[#EFF8FF] rounded-[8px] flex items-center justify-center mb-[24px]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 11H15" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 15H15" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M16 3H8C6.89543 3 6 3.89543 6 5V19L10 17L14 19V5C14 3.89543 14.8954 3 16 3Z" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3 className="text-[20px] font-medium text-[#000] mb-[12px]">Reports & History</h3>
                            <p className="text-[16px] text-[#333436] leading-relaxed">
                                Review your invoices, payments, and client activity in simple summaries that help you understand your business.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="w-full py-[80px]">
                <div className="max-w-[1280px] mx-auto px-[80px]">
                    <div className="text-center mb-[60px]">
                        <span className="inline-block px-[16px] py-[6px] bg-[#EFF8FF] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[24px]">
                            Testimonials
                        </span>
                        <h2 className="text-[38px] font-medium text-[#000] mb-[16px] leading-tight">
                            Trusted by Nigerian Businesses
                        </h2>
                        <p className="text-[18px] text-[#333436] max-w-[600px] mx-auto leading-relaxed">
                            Join thousands of freelancers, SMEs, and enterprises who've simplified their invoicing and stay tax-compliant effortlessly
                        </p>
                    </div>

                    <TestimonialsCarousel />
                </div>
            </div>

            {/* FAQ Section */}
            <div className="w-full bg-[#eff8ff] py-[80px]">
                <div className="max-w-[1280px] mx-auto px-[80px]">
                    <div className="text-center mb-[60px]">
                        <span className="inline-block px-[16px] py-[6px] bg-[#EFF8FF] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[24px]">
                            FAQ
                        </span>
                        <h2 className="text-[38px] font-medium text-[#000] mb-[16px] leading-tight">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-[18px] text-[#333436] max-w-[600px] mx-auto leading-relaxed">
                            Everything you need to know about using Original Invoice for billing, payments, and tax-compliant invoicing in Nigeria.
                        </p>
                    </div>

                    <div className="max-w-[800px] mx-auto space-y-[16px]">
                        <FAQItem
                            question="Can I customize my invoices?"
                            answer="Yes. You can upload your logo, edit your business details, choose a template layout, and even send invoices in multiple languages (English, Hausa, Igbo, Yoruba)."
                            isOpen={true}
                        />
                        
                        <FAQItem
                            question="Can I track all my payments and outstanding invoices?"
                            answer="Absolutely! Our payment tracking system gives you real-time visibility into all your invoices. You can see which invoices are paid, pending, overdue, or in draft status. The dashboard provides clear indicators and allows you to quickly mark payments as received, send reminders, and generate reports on your cash flow."
                        />
                        
                        <FAQItem
                            question="Is it mobile-friendly?"
                            answer="Yes, Original Invoice is fully responsive and works seamlessly on all devices including smartphones and tablets. You can create, send, and manage invoices on the go. The mobile interface is optimized for touch interactions while maintaining all the functionality of the desktop version."
                        />
                        
                        <FAQItem
                            question="Do you support multiple languages?"
                            answer="Yes! We support multiple Nigerian languages including English, Hausa, Igbo, and Yoruba. You can create and send invoices in your client's preferred language, making communication clearer and more professional. This feature is especially useful for businesses serving diverse communities across Nigeria."
                        />
                        
                        <FAQItem
                            question="Do I need accounting knowledge to use the platform?"
                            answer="Not at all! Original Invoice is designed to be user-friendly for everyone, regardless of accounting background. The platform automatically handles tax calculations (VAT, WHT), provides guided workflows, and includes helpful tooltips. However, we do recommend consulting with an accountant for complex business scenarios."
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
      </>
  );
}
export default Home;