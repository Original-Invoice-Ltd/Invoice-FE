import Image from "next/image";

export interface PricingFeature {
    text: string;
}

export interface PricingPlan {
    id: string;
    name: string;
    price: string;
    period?: string;
    savings?: string;
    description: string;
    features: PricingFeature[];
    buttonText: string;
    buttonAction: () => void;   
    isLoading?: boolean;
}

interface PricingCardProps {
    plan: PricingPlan;
    isMobile?: boolean;
}

const PricingCard = ({ plan, isMobile = false }: PricingCardProps) => {
    const cardClasses = isMobile 
        ? "w-full max-w-[343px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm pb-[12px] pt-[24px] px-[24px] flex flex-col"
        : "w-[384px] h-[564px] bg-white rounded-[16px] border border-[#E9EAEB] shadow-sm pb-[12px] pt-[24px] px-[32px] flex flex-col";

    const priceClasses = isMobile 
        ? "text-[40px] text-center font-semibold text-[#000] mb-[8px]"
        : "text-[40px] lg:text-[48px] text-center font-semibold text-[#000] mb-[8px]";

    const titleClasses = isMobile 
        ? "text-[18px] text-center font-medium text-[#000] mb-[4px]"
        : "text-[18px] lg:text-[20px] text-center font-medium text-[#000] mb-[4px]";

    const featuresGapClasses = isMobile 
        ? "flex flex-col gap-[12px] mb-[24px] flex-1"
        : "flex flex-col gap-[12px] lg:gap-[16px] mb-[24px] lg:mb-[32px] flex-1";

    const buttonClasses = isMobile 
        ? "h-[46px] w-full bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        : "h-[46px] w-[320px] bg-[#2F80ED] text-white rounded-[8px] font-medium text-[16px] hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className={cardClasses}>
            <h2 className={priceClasses}>{plan.price}</h2>
            <h3 className={titleClasses}>{plan.name}</h3>
            {plan.period && (
                <p className="text-[14px] text-center text-[#333436] mb-[4px]">{plan.period}</p>
            )}
            {plan.savings && (
                <p className="text-[14px] text-center text-[#2F80ED] mb-[24px] lg:mb-[32px]">{plan.savings}</p>
            )}
            {!plan.period && !plan.savings && (
                <p className="text-[14px] text-center text-[#333436] mb-[24px] lg:mb-[32px]">&nbsp;</p>
            )}
            
            <div className={featuresGapClasses}>
                {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-[12px]">
                        <Image 
                            src="/assets/blue tick.svg" 
                            alt="" 
                            width={20} 
                            height={20} 
                            className="mt-[2px] flex-shrink-0" 
                        />
                        <span className="text-[14px] text-[#333436]">{feature.text}</span>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={plan.buttonAction}
                disabled={plan.isLoading}
                className={buttonClasses}
            >
                {plan.isLoading ? "Processing..." : plan.buttonText}
            </button>
            <p className="text-[12px] text-[#333436] text-center mt-[12px]">{plan.description}</p>
        </div>
    );
};

export default PricingCard;
