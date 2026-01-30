"use client";

import Header from "@/components/header";
import Footer from "@/components/footer/Footer";
import FAQ from "@/components/FAQ";
import Image from "next/image";
import arrowDown from './../../../public/assets/icons/Hand-drawn arrow.svg';
import Testimonials from "@/components/testimonials";
<<<<<<< HEAD
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { initializeTransactionWithPlan } from "@/lib/subscription";

const PricingContent = ()=>{
    const [currentCard, setCurrentCard] = useState(0);
    const [isLoading, setIsLoading] = useState<string | null>(null); // Track which button is loading
    const router = useRouter();
    const searchParams = useSearchParams();

    // Check for plan parameter in URL and auto-trigger subscription
    useEffect(() => {
        const planParam = searchParams.get("plan");
        if (planParam && (planParam === "ESSENTIALS" || planParam === "PREMIUM")) {
            // Small delay to ensure component is mounted
            setTimeout(() => {
                handleSubscribe(planParam as "ESSENTIALS" | "PREMIUM");
            }, 500);
        }
    }, [searchParams]);

    // Handle subscription for paid plans
    const handleSubscribe = async (plan: "ESSENTIALS" | "PREMIUM") => {
        try {
            setIsLoading(plan);
            
            // Initialize transaction with plan
            const result = await initializeTransactionWithPlan(
                plan,
                ["card", "bank_transfer"], // Allow both card and bank transfer
                `${window.location.origin}/dashboard/subscription/success` // Callback URL
            );

            if (result.success && result.authorizationUrl) {
                // Redirect to Paystack checkout
                window.location.href = result.authorizationUrl;
            } else {
                console.error("Failed to initialize subscription:", result.message);
                
                // Check if it's an authentication error
                if (result.message?.includes("authentication") || result.message?.includes("unauthorized")) {
                    // Redirect to sign in with return URL
                    const returnUrl = encodeURIComponent(`/pricing?plan=${plan}`);
                    router.push(`/signIn?returnUrl=${returnUrl}`);
                } else {
                    alert("Failed to start subscription process. Please try again.");
                }
            }
        } catch (error: any) {
            console.error("Error starting subscription:", error);
            
            // Check if it's an authentication error
            if (error.response?.status === 401) {
                const returnUrl = encodeURIComponent(`/pricing?plan=${plan}`);
                router.push(`/signIn?returnUrl=${returnUrl}`);
            } else {
                alert("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(null);
        }
    };

    // Handle free trial (redirect to sign up)
    const handleFreeTrial = () => {
        router.push("/signUp");
    };
=======
import { useState } from "react";

const Pricing = ()=>{
    const [currentCard, setCurrentCard] = useState(0);
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
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
                    <div className="flex flex-col items-center w-full max-w-[1280px] mx-auto mt-[54px] pb-[40px] lg:pb-[80px] px-4 lg:px-0">
                        {/* Badge */}
                        <span className="inline-block px-[16px] py-[6px] bg-[#EFF8FF] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[24px]">
                            Pricing
                        </span>
                        
                        {/* Heading */}
                        <h1 className="text-[32px] lg:text-[50px] font-semibold text-center text-[#000000] leading-tight mb-[16px] max-w-[343px] lg:max-w-none">
                            Simple, Transparent Pricing for Every Business Size
                        </h1>
                        
                        {/* Subheading */}
                        <p className="text-[#333436] text-center text-[14px] lg:text-[16px] leading-tight mb-[32px] max-w-[343px] lg:max-w-none">
                            Start free. Scale as you grow. All plans include tax compliance tools built for Nigerian businesses.
                        </p>
                        
                        {/* Toggle */}
                        <div className="flex items-center gap-[12px] lg:gap-[16px] mb-[40px] lg:mb-[60px] flex-wrap justify-center">
                            <span className="text-[16px] lg:text-[20px] font-medium text-[#7D7F81]">Monthly</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-[44px] h-[24px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-[#2F80ED]"></div>
                            </label>
                            <span className="text-[16px] lg:text-[20px] font-medium text-[#000000]">Annually</span>
                            <span className="h-[24px] px-2 bg-[#E7FEF8] flex items-center justify-center text-[#059669] border-[0.5px] border-[#40C4AA] text-[12px] font-medium rounded-[6px]">
                                Save up to 17%
                            </span>
                        </div>
                        
                        {/* Most Popular Arrow - positioned above cards - Desktop only */}
                        <div className="hidden lg:block relative w-[1254px] mb-[40px]">
                            <div className="absolute left-[280px] top-[-50px] flex flex-col items-end">
                                <span className="text-[#2F80ED] text-[14px] mb-[8px] font-medium">
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
                        <div className="relative w-full lg:w-[1254px] lg:h-[618px]">
                            {/* Mobile Carousel */}
                            <div className="lg:hidden relative w-full overflow-hidden">
                                <div 
                                    className="flex transition-transform duration-300 ease-in-out"
                                    style={{ transform: `translateX(-${currentCard * 100}%)` }}
                                >
                                    {/* Free Trial Card */}
                                    <div className="w-full flex-shrink-0 flex justify-center px-4">
                                        <div className="w-full max-w-[343px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm p-[24px] flex flex-col">
                                            <h2 className="text-[40px] text-center font-semibold text-[#000000] mb-[8px]">₦0</h2>
                                            <h3 className="text-[18px] text-center font-medium text-[#000] mb-[4px]">Free Trial</h3>
                                            <p className="text-[14px] text-center text-[#333436] mb-[24px]">for 3 Invoices</p>
                                            
                                            <div className="flex flex-col gap-[12px] mb-[24px] flex-1">
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">3 Invoices to test the platform</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Tax calculator (VAT, WHT, PAYE)</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Basic invoice templates</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Email & WhatsApp sharing</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Payment tracking</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Email & WhatsApp sharing</span>
                                                </div>
                                            </div>
                                            
<<<<<<< HEAD
                                            <button 
                                                onClick={handleFreeTrial}
                                                className="w-full h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors"
                                            >
=======
                                            <button className="w-full h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                                                Start Free Trial
                                            </button>
                                            <p className="text-[12px] text-[#333436] text-center mt-[12px]">No credit card required</p>
                                        </div>
                                    </div>

                                    {/* Essentials Card */}
                                    <div className="w-full flex-shrink-0 flex justify-center px-4">
                                        <div className="w-full max-w-[343px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm pb-[12px] pt-[24px] px-[24px] flex flex-col">
                                            <h2 className="text-[40px] text-center font-semibold text-[#000] mb-[8px]">₦24,000</h2>
                                            <h3 className="text-[18px] text-center font-medium text-[#000] mb-[4px]">Essentials</h3>
                                            <p className="text-[14px] text-center text-[#333436] mb-[4px]">/year</p>
                                            <p className="text-[14px] text-center text-[#2F80ED] mb-[24px]">Save ₦9,600</p>
                                            
                                            <div className="flex flex-col gap-[12px] mb-[24px] flex-1">
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Up to 10 invoices per month</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Autofill client & item info</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Tax calculator (VAT, WHT, PAYE)</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">1 custom logo upload</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">1 company profile</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Top-rated mobile app</span>
                                                </div>
                                            </div>
                                            
<<<<<<< HEAD
                                            <button 
                                                onClick={() => handleSubscribe("ESSENTIALS")}
                                                disabled={isLoading === "ESSENTIALS"}
                                                className="h-[46px] w-full bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading === "ESSENTIALS" ? "Processing..." : "Get Started"}
=======
                                            <button className="h-[46px] w-full bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
                                                Get Started
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                                            </button>
                                            <p className="text-[12px] text-[#333436] text-center mt-[12px]">Perfect for small businesses and freelancers</p>
                                        </div>
                                    </div>

                                    {/* Premium Card */}
                                    <div className="w-full flex-shrink-0 flex justify-center px-4">
                                        <div className="w-full max-w-[343px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm pb-[12px] pt-[24px] px-[24px] flex flex-col">
                                            <h2 className="text-[40px] text-center font-semibold text-[#000] mb-[8px]">₦120,000</h2>
                                            <h3 className="text-[18px] text-center font-medium text-[#000] mb-[4px]">Premium</h3>
                                            <p className="text-[14px] text-center text-[#333436] mb-[4px]">/year</p>
                                            <p className="text-[14px] text-center text-[#2F80ED] mb-[24px]">Save ₦60,000</p>
                                            
                                            <div className="flex flex-col gap-[12px] mb-[24px] flex-1">
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Everything in Essentials, plus:</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Unlimited invoices per month</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Client signatures</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Multiple custom logos</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Premium invoice templates</span>
                                                </div>
                                                <div className="flex items-start gap-[12px]">
                                                    <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                                    <span className="text-[14px] text-[#333436]">Multiple company profiles</span>
                                                </div>
                                            </div>
                                            
<<<<<<< HEAD
                                            <button 
                                                onClick={() => handleSubscribe("PREMIUM")}
                                                disabled={isLoading === "PREMIUM"}
                                                className="w-full h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading === "PREMIUM" ? "Processing..." : "Start Premium"}
=======
                                            <button className="w-full h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
                                                Start Premium
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                                            </button>
                                            <p className="text-[12px] text-[#333436] text-center mt-[12px]">For growing businesses with high invoice volume</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Carousel Indicators */}
                                <div className="flex justify-center gap-[8px] mt-[24px]">
                                    <button
                                        onClick={() => setCurrentCard(0)}
                                        className={`w-[8px] h-[8px] rounded-full transition-all ${
                                            currentCard === 0 ? 'bg-[#2F80ED] w-[24px]' : 'bg-[#D9D9D9]'
                                        }`}
                                        aria-label="View Free Trial plan"
                                    />
                                    <button
                                        onClick={() => setCurrentCard(1)}
                                        className={`w-[8px] h-[8px] rounded-full transition-all ${
                                            currentCard === 1 ? 'bg-[#2F80ED] w-[24px]' : 'bg-[#D9D9D9]'
                                        }`}
                                        aria-label="View Essentials plan"
                                    />
                                    <button
                                        onClick={() => setCurrentCard(2)}
                                        className={`w-[8px] h-[8px] rounded-full transition-all ${
                                            currentCard === 2 ? 'bg-[#2F80ED] w-[24px]' : 'bg-[#D9D9D9]'
                                        }`}
                                        aria-label="View Premium plan"
                                    />
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden lg:flex items-center justify-center gap-[24px]">
                                {/* Free Trial Card */}
                                <div className="w-[384px] h-[564px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm p-[32px] flex flex-col">
                                <h2 className="text-[40px] lg:text-[48px] text-center font-semibold text-[#000000] mb-[8px]">₦0</h2>
                                <h3 className="text-[18px] lg:text-[20px] text-center font-medium text-[#000] mb-[4px]">Free Trial</h3>
                                <p className="text-[14px] text-center text-[#333436] mb-[24px] lg:mb-[32px]">for 3 Invoices</p>
                                
                                <div className="flex flex-col gap-[12px] lg:gap-[16px] mb-[24px] lg:mb-[32px] flex-1">
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">3 Invoices to test the platform</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Tax calculator (VAT, WHT, PAYE)</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Basic invoice templates</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Email & WhatsApp sharing</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Payment tracking</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Email & WhatsApp sharing</span>
                                    </div>
                                </div>
                                
<<<<<<< HEAD
                                <button 
                                    onClick={handleFreeTrial}
                                    className="w-[320px] h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors"
                                >
=======
                                <button className="w-[320px] h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                                    Start Free Trial
                                </button>
                                <p className="text-[12px] text-[#333436] text-center mt-[12px]">No credit card required</p>
                            </div>
                            
                            {/* Essentials Card */}
                            <div className="w-[384px] h-[564px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm pb-[12px] pt-[24px] px-[32px] flex flex-col">
                                <h2 className="text-[40px] lg:text-[48px] text-center font-semibold text-[#000] mb-[8px]">₦24,000</h2>
                                <h3 className="text-[18px] lg:text-[20px] text-center font-medium text-[#000] mb-[4px]">Essentials</h3>
                                <p className="text-[14px] text-center text-[#333436] mb-[4px]">/year</p>
                                <p className="text-[14px] text-center text-[#2F80ED] mb-[24px] lg:mb-[32px]">Save ₦9,600</p>
                                
                                <div className="flex flex-col gap-[12px] lg:gap-[16px] mb-[24px] lg:mb-[32px] flex-1">
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Up to 10 invoices per month</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Autofill client & item info</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Tax calculator (VAT, WHT, PAYE)</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">1 custom logo upload</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">1 company profile</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Top-rated mobile app</span>
                                    </div>
                                </div>
                                
<<<<<<< HEAD
                                <button 
                                    onClick={() => handleSubscribe("ESSENTIALS")}
                                    disabled={isLoading === "ESSENTIALS"}
                                    className="h-[46px] w-[320px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading === "ESSENTIALS" ? "Processing..." : "Get Started"}
=======
                                <button className="h-[46px] w-[320px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
                                    Get Started
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                                </button>
                                <p className="text-[12px] text-[#333436] text-center mt-[12px]">Perfect for small businesses and freelancers</p>
                            </div>
                            
                            {/* Premium Card */}
                            <div className="w-[384px] h-[564px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm pb-[12px] pt-[24px] px-[32px] flex flex-col">
                                <h2 className="text-[40px] lg:text-[48px] text-center font-semibold text-[#000] mb-[8px]">₦120,000</h2>
                                <h3 className="text-[18px] lg:text-[20px] text-center font-medium text-[#000] mb-[4px]">Premium</h3>
                                <p className="text-[14px] text-center text-[#333436] mb-[4px]">/year</p>
                                <p className="text-[14px] text-center text-[#2F80ED] mb-[24px] lg:mb-[32px]">Save ₦60,000</p>
                                
                                <div className="flex flex-col gap-[12px] lg:gap-[16px] mb-[24px] lg:mb-[32px] flex-1">
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Everything in Essentials, plus:</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Unlimited invoices per month</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Client signatures</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Multiple custom logos</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Premium invoice templates</span>
                                    </div>
                                    <div className="flex items-start gap-[12px]">
                                        <Image src="/assets/blue tick.svg" alt="" width={20} height={20} className="mt-[2px] flex-shrink-0" />
                                        <span className="text-[14px] text-[#333436]">Multiple company profiles</span>
                                    </div>
                                </div>
                                
<<<<<<< HEAD
                                <button 
                                    onClick={() => handleSubscribe("PREMIUM")}
                                    disabled={isLoading === "PREMIUM"}
                                    className="w-full h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading === "PREMIUM" ? "Processing..." : "Start Premium"}
=======
                                <button className="w-full h-[46px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors">
                                    Start Premium
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                                </button>
                                <p className="text-[12px] text-[#333436] text-center mt-[12px]">For growing businesses with high invoice volume</p>
                            </div>
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
<<<<<<< HEAD

const Pricing = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED] mx-auto mb-4"></div>
                    <p className="text-[#667085]">Loading pricing...</p>
                </div>
            </div>
        }>
            <PricingContent />
        </Suspense>
    );
}

=======
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
export default Pricing