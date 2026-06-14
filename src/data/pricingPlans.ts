import { PricingFeature } from "@/components/pricing/PricingCard";

export type BillingCycle = "monthly" | "yearly";

export interface PricingPlanData {
    id: string;
    name: string;
    pricing: {
        monthly?: {
            price: string;
            period: string;
        };
        yearly: {
            price: string;
            period: string;
            savings?: string;
        };
    };
    description: string;
    features: PricingFeature[];
    buttonText: string;
    planType: "FREE" | "ESSENTIALS" | "PREMIUM";
    savingsPercentage?: string;
}

export const pricingPlansData: PricingPlanData[] = [
    {
        id: "free",
        name: "Free Trial",
        pricing: {
            yearly: {
                price: "₦0",
                period: "for 3 Invoices"
            }
        },
        description: "No credit card required",
        features: [
            { text: "3 Invoices to test the platform" },
            { text: "Basic invoice templates" },
            { text: "Email & WhatsApp sharing" },
            { text: "Payment tracking" },
        ],
        buttonText: "Start Free Trial",
        planType: "FREE"
    },
    {
        id: "essentials",
        name: "Essentials",
        pricing: {
            monthly: {
                price: "₦2,000",
                period: "/month"
            },
            yearly: {
                price: "₦19,920",
                period: "/year",
                savings: "Save ₦4,080"
            }
        },
        description: "Perfect for small businesses and freelancers",
        features: [
            { text: "Up to 15 invoices per month" },
            // { text: "Autofill client & item info" },
            // { text: "Tax calculator (VAT, WHT, PAYE)" },
            { text: "1 custom logo upload" },
            { text: "1 company profile" },
            { text: "Email & WhatsApp sharing" },
            { text: "Payment tracking" },
            // { text: "Top-rated mobile app" }
        ],
        buttonText: "Get Started",
        planType: "ESSENTIALS",
        savingsPercentage: "Save up to 17%"
    },
    {
        id: "premium",
        name: "Premium",
        pricing: {
            monthly: {
                price: "₦5,000",
                period: "/month"
            },
            yearly: {
                price: "₦49,800",
                period: "/year",
                savings: "Save ₦10,200"
            }
        },
        description: "For growing businesses with high invoice volume",
        features: [
            { text: "Everything in Essentials, plus:" },
            { text: "Unlimited invoices per month" },
            { text: "Multiple custom logos" },
            { text: "Premium invoice templates" },
            {text:"signature upload"},
            { text: "Multiple company profiles" }

        ],
        buttonText: "Start Premium",
        planType: "PREMIUM",
        savingsPercentage: "Save up to 17%"
    }
];
