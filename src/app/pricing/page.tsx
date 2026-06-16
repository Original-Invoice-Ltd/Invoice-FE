"use client";

import Header from "@/components/header";
import Footer from "@/components/footer/Footer";
import FAQ from "@/components/FAQ";
import Image from "next/image";
import arrowDown from './../../../public/assets/icons/Hand-drawn arrow.svg';
import Testimonials from "@/components/testimonials";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { initializeTransactionWithPlan } from "@/lib/subscription";
import PricingCard, { PricingPlan } from "@/components/pricing/PricingCard";
import { pricingPlansData, BillingCycle } from "@/data/pricingPlans";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";

const PricingContent = ()=>{
    const [currentCard, setCurrentCard] = useState(0);
    const [isLoading, setIsLoading] = useState<string | null>(null); // Track which button is loading
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("yearly");
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast, showError, hideToast } = useToast();

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && currentCard < 2) {
            setCurrentCard(currentCard + 1);
        }
        if (isRightSwipe && currentCard > 0) {
            setCurrentCard(currentCard - 1);
        }
    };

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
        console.log(`[Pricing] User clicked subscribe for plan: ${plan}`);
        try {
            setIsLoading(plan);
            
            // Initialize transaction with plan
            console.log(`[Pricing] Initializing transaction for ${plan} (${billingCycle})...`);
            const result = await initializeTransactionWithPlan(
                plan,
                billingCycle, // Use the current billing cycle state
                ["card", "bank_transfer"], // Allow both card and bank transfer
                `${window.location.origin}/dashboard/subscription/success` // Callback URL
            );

            if (result.success && result.authorizationUrl) {
                console.log(`[Pricing] Transaction initialized. Redirecting to Paystack (auth url == ): ${result.authorizationUrl}`);
                // Redirect to Paystack checkout
                window.location.href = result.authorizationUrl;
            } else {
                console.error(`[Pricing] Failed to initialize subscription. Message: ${result.message}`);
                
                // Check if it's an authentication error
                if (result.message?.includes("authentication") || result.message?.includes("unauthorized")) {
                    console.warn(`[Pricing] Unauthorized access. Redirecting to signIn with returnUrl.`);
                    // Redirect to sign in with return URL
                    const returnUrl = encodeURIComponent(`/pricing?plan=${plan}`);
                    router.push(`/signIn?returnUrl=${returnUrl}`);
                } else {
                    showError("Failed to start subscription process. Please try again.");
                }
            }
        } catch (error: any) {
            console.error("[Pricing] Unexpected error starting subscription:", error);
            
            // Check if it's an authentication error
            if (error.response?.status === 401) {
                console.warn(`[Pricing] 401 Unauthorized. Redirecting to signIn.`);
                const returnUrl = encodeURIComponent(`/pricing?plan=${plan}`);
                router.push(`/signIn?returnUrl=${returnUrl}`);
            } else {
                showError("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(null);
        }
    };

    // Handle free trial (redirect to sign up)
    const handleFreeTrial = () => {
        router.push("/signUp");
    };

    // Map pricing data to PricingPlan with actions
    const getPricingPlans = (): PricingPlan[] => {
        return pricingPlansData.map(planData => {
            // Get pricing based on billing cycle
            const pricing = billingCycle === "monthly" && planData.pricing.monthly 
                ? planData.pricing.monthly 
                : planData.pricing.yearly;

            return {
                id: planData.id,
                name: planData.name,
                price: pricing.price,
                period: pricing.period,
                savings: (pricing as any).savings as string | undefined,
                description: planData.description,
                features: planData.features,
                buttonText: planData.buttonText,
                buttonAction: planData.planType === "FREE" 
                    ? handleFreeTrial 
                    : () => handleSubscribe(planData.planType as "ESSENTIALS" | "PREMIUM"),
                isLoading: isLoading === planData.planType
            };
        });
    };

    const pricingPlans = getPricingPlans();

    return(
        <>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
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
                            <span className={`text-[16px] lg:text-[20px] font-medium ${billingCycle === "monthly" ? "text-[#000000]" : "text-[#7D7F81]"}`}>
                                Monthly
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={billingCycle === "yearly"}
                                    onChange={(e) => setBillingCycle(e.target.checked ? "yearly" : "monthly")}
                                />
                                <div className="w-[44px] h-[24px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-[#2F80ED]"></div>
                            </label>
                            <div className="flex items-center gap-[8px]">
                                <span className={`text-[16px] lg:text-[20px] font-medium ${billingCycle === "yearly" ? "text-[#000000]" : "text-[#7D7F81]"}`}>
                                    Annually
                                </span>
                                <span className="h-[24px] px-2 bg-[#E7FEF8] flex items-center justify-center text-[#059669] border-[0.5px] border-[#40C4AA] text-[12px] font-medium rounded-[6px]">
                                    Save up to 10%
                                </span>
                            </div>
                        </div>
                        
                        {/* Most Popular Arrow - positioned above cards - Desktop only */}
                        <div className="hidden lg:block relative w-[1254px] mb-[40px]">
                            <div className="absolute left-[590px] top-[-50px] flex flex-col items-end">
                                <span className="text-[#2F80ED] text-[14px] mb-[8px] font-medium">
                                    Most popular!
                                </span>
                                <Image
                                    src={arrowDown}
                                    alt="Arrow pointing to essentials"
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
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={onTouchEnd}
                                >
                                    {pricingPlans.map((plan) => (
                                        <div key={plan.id} className="w-full flex-shrink-0 flex justify-center px-4">
                                            <PricingCard plan={plan} isMobile={true} />
                                        </div>
                                    ))}
                                </div>

                                {/* Carousel Indicators */}
                                <div className="flex justify-center gap-[8px] mt-[24px]">
                                    {pricingPlans.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentCard(index)}
                                            className={`w-[8px] h-[8px] rounded-full transition-all ${
                                                currentCard === index ? 'bg-[#2F80ED] w-[24px]' : 'bg-[#D9D9D9]'
                                            }`}
                                            aria-label={`View ${pricingPlansData[index].name} plan`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden lg:flex items-center justify-center gap-[24px]">
                                {pricingPlans.map((plan) => (
                                    <PricingCard key={plan.id} plan={plan} isMobile={false} />
                                ))}
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


export default Pricing