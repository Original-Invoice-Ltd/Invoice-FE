"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Custom SVG Icon Components
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.19043 2.70703C10.195 1.76435 11.8052 1.76413 12.8096 2.70703L18.041 7.61914L19.7627 9.23633C20.0645 9.51971 20.08 9.9939 19.7969 10.2959C19.6078 10.4973 19.3342 10.568 19.083 10.5107V16.668C19.083 18.552 17.4707 20 15.583 20H6.41602C4.52844 19.9998 2.91602 18.5519 2.91602 16.668V10.5107C2.66506 10.5677 2.39201 10.4971 2.20312 10.2959C1.91994 9.99401 1.93471 9.51981 2.23633 9.23633L3.95801 7.61914H3.95898L9.19043 2.70703ZM11.7832 3.80078C11.3559 3.39962 10.6442 3.39973 10.2168 3.80078L4.98535 8.71289C4.61523 9.06054 4.41618 9.5216 4.41602 9.99121V16.668C4.41602 17.6358 5.26639 18.4998 6.41602 18.5H15.583C16.7328 18.5 17.583 17.6359 17.583 16.668V9.99121C17.5828 9.52147 17.3847 9.06045 17.0146 8.71289L11.7832 3.80078ZM11.833 12.833C12.3851 12.833 12.8328 13.2809 12.833 13.833V15.5C12.833 16.0523 12.3853 16.5 11.833 16.5H10.166C9.61387 16.4998 9.16602 16.0522 9.16602 15.5V13.833C9.16625 13.281 9.61402 12.8332 10.166 12.833H11.833Z" fill={isActive ? "white" : "rgba(255, 255, 255, 0.7)"}/>
    </svg>
);

const InvoicesIcon = ({ isActive }: { isActive: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.6953 1.08301C12.2002 1.08305 12.6947 1.1923 13.1455 1.39746C13.5233 1.56944 13.8717 1.80923 14.1709 2.1084L18.0596 5.99707C18.3588 6.2963 18.5985 6.64458 18.7705 7.02246C18.9756 7.47312 19.0849 7.96699 19.085 8.47168V17.416C19.085 19.3488 17.5177 20.9157 15.585 20.916H6.41797C4.48497 20.916 2.91797 19.349 2.91797 17.416V4.58301C2.91814 2.65016 4.48508 1.08301 6.41797 1.08301H11.6953ZM6.41797 2.58301C5.31351 2.58301 4.41814 3.47859 4.41797 4.58301V17.416C4.41797 18.5206 5.3134 19.416 6.41797 19.416H15.585C16.6892 19.4157 17.585 18.5204 17.585 17.416V8.47168C17.5849 8.18337 17.5225 7.90107 17.4053 7.64355C17.356 7.53525 17.2967 7.43136 17.2285 7.33301H13.834C13.2818 7.33283 12.834 6.88518 12.834 6.33301V2.93848C12.7361 2.87053 12.6323 2.81184 12.5244 2.7627C12.2668 2.64545 11.9838 2.58305 11.6953 2.58301H6.41797ZM13.9805 9.79102C14.3943 9.79119 14.7301 10.1272 14.7305 10.541V10.8281C15.2472 10.9711 15.678 11.2581 15.9648 11.623C16.2206 11.9485 16.1639 12.4197 15.8389 12.6758C15.5132 12.9317 15.0411 12.8755 14.7852 12.5498C14.675 12.4099 14.4042 12.2286 13.9805 12.2285C13.3014 12.2285 13.1268 12.6375 13.126 12.7285C13.126 12.8781 13.1516 12.9614 13.1709 13.0029C13.1879 13.0393 13.2101 13.0648 13.2461 13.0898C13.3395 13.1547 13.5547 13.2285 13.9805 13.2285C14.5166 13.2285 15.1041 13.311 15.5723 13.6367C16.0938 13.9998 16.3348 14.5675 16.335 15.2285C16.335 16.1472 15.6378 16.863 14.7305 17.1221V17.416C14.7305 17.8301 14.3945 18.1658 13.9805 18.166C13.5663 18.166 13.2305 17.8302 13.2305 17.416V17.1279C12.7139 16.985 12.2829 16.6998 11.9961 16.335C11.7402 16.0093 11.7965 15.5372 12.1221 15.2812C12.4477 15.0256 12.9199 15.0827 13.1758 15.4082C13.286 15.5481 13.5567 15.7285 13.9805 15.7285C14.6609 15.7284 14.835 15.3182 14.835 15.2285C14.8349 15.0792 14.8094 14.9965 14.79 14.9551C14.773 14.9187 14.7509 14.8932 14.7148 14.8682C14.6216 14.8033 14.4064 14.7286 13.9805 14.7285C13.4443 14.7285 12.8569 14.647 12.3887 14.3213C11.8668 13.9581 11.626 13.3899 11.626 12.7285C11.6263 11.81 12.3231 11.0938 13.2305 10.835V10.541C13.2308 10.1271 13.5665 9.79102 13.9805 9.79102ZM11.001 8.41602C11.4148 8.41619 11.7506 8.75221 11.751 9.16602C11.751 9.58012 11.415 9.91584 11.001 9.91602H6.41797C6.00376 9.91602 5.66797 9.58023 5.66797 9.16602C5.66832 8.7521 6.00397 8.41602 6.41797 8.41602H11.001ZM10.085 4.75C10.4988 4.75035 10.8348 5.08615 10.835 5.5C10.8348 5.91385 10.4988 6.24965 10.085 6.25H6.41797C6.00386 6.25 5.66814 5.91406 5.66797 5.5C5.66814 5.08594 6.00386 4.75 6.41797 4.75H10.085Z" fill={isActive ? "white" : "rgba(255, 255, 255, 0.7)"}/>
    </svg>
);

const PaymentIcon = ({ isActive }: { isActive: boolean }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.0007 7.3335C9.62565 7.3335 8.70898 8.25016 8.70898 9.16683C8.70898 10.5418 9.62565 11.0002 11.0007 11.0002C12.3757 11.0002 13.2923 11.4585 13.2923 12.8335C13.2923 13.7502 12.3757 14.6668 11.0007 14.6668M11.0007 7.3335C12.3757 7.3335 13.2923 8.25016 13.2923 9.01405M11.0007 7.3335V5.9585M11.0007 14.6668C9.62565 14.6668 8.86176 13.7502 8.86176 12.9863M11.0007 14.6668V16.0418M11.0007 20.1668C5.93804 20.1668 1.83398 16.0628 1.83398 11.0002C1.83398 5.93755 5.93804 1.8335 11.0007 1.8335C16.0633 1.8335 20.1673 5.93755 20.1673 11.0002C20.1673 16.0628 16.0633 20.1668 11.0007 20.1668Z" stroke={isActive ? "white" : "rgba(255, 255, 255, 0.7)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

interface SidebarProps {
    userProfile?: {
        name: string;
        email: string;
        initials: string;
    };
    className?: string;
    onClose?: () => void;
    isMobile?: boolean;
    onSignOutClick?: () => void;
    showEmailProfile?: boolean;
}

const Sidebar = ({ 
    userProfile,
    className = "",
    onClose,
    isMobile = false,
    onSignOutClick,
    showEmailProfile = false
}: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();

    // Determine which profile to show
    const displayProfile = isAuthenticated && user ? {
        name: user.fullName || user.email || "User",
        email: user.email || "",
        initials: user.fullName 
            ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : (user.email ? user.email[0].toUpperCase() : "U")
    } : userProfile || {
        name: "Guest",
        email: "",
        initials: "G"
    };

    // Show email profile mode only if showEmailProfile is true AND user is not authenticated
    const shouldShowEmailProfile = showEmailProfile && !isAuthenticated;

    const navigationItems = [
        {
            icon: HomeIcon,
            label: "Home",
            path: "/customer/dashboard",
            isActive: pathname === "/customer/dashboard"
        },
        {
            icon: InvoicesIcon,
            label: "Invoices",
            path: "/customer/invoices",
            isActive: pathname.includes("/customer/invoices")
        },
        {
            icon: PaymentIcon,
            label: "Payment",
            path: "/customer/payments",
            isActive: pathname.includes("/customer/payment")
        }
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
        if (onClose) onClose();
    };

    return (
        <div className={`w-64 bg-gradient-to-b from-[#2F80ED] to-[#1E5FCC] text-white flex flex-col h-screen ${className}`}>
            {/* Header with Logo */}
            <div className="p-6 border-b border-blue-400/30">
                <div className="flex items-center justify-between mb-6">
                    <img
                        src="/assets/OriginalInvoiceWhiteLogo.svg"
                        alt="Original Invoice"
                        className="h-8 w-auto object-contain"
                    />
                    {/* Close button for mobile */}
                    {isMobile && onClose && (
                        <button 
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* User Profile */}
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm relative">
                    {shouldShowEmailProfile ? (
                        // Email Profile Mode - Show Get Started Button (Not Logged In)
                        <div className="flex flex-col items-center text-center">
                            {/* Get Started Button */}
                            <button
                                onClick={() => router.push('/signUp')}
                                className="w-full px-6 py-3 bg-white text-[#2F80ED] rounded-lg hover:bg-gray-100 transition-colors font-semibold text-base"
                            >
                                Get Started
                            </button>
                        </div>
                    ) : (
                        // Regular Profile Mode - Show User Profile
                        <>
                            {/* Dropdown Arrow - positioned in top right */}
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                            >
                                <ChevronDown 
                                    size={20} 
                                    className={`transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Profile Content - Vertical Layout */}
                            <div className="flex flex-col items-center text-center">
                                {/* Avatar */}
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3">
                                    <span className="text-[#2F80ED] font-semibold text-lg">
                                        {displayProfile.initials}
                                    </span>
                                </div>
                                
                                {/* Name */}
                                <p className="text-white font-medium text-base mb-1">
                                    {displayProfile.name}
                                </p>
                                
                                {/* Email */}
                                <p className="text-blue-200 text-sm truncate w-full">
                                    {displayProfile.email}
                                </p>
                            </div>
                            
                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="mt-4 pt-3 border-t border-white/20">
                                    <button className="w-full text-left text-sm text-blue-200 hover:text-white py-2">
                                        View Profile
                                    </button>
                                    <button className="w-full text-left text-sm text-blue-200 hover:text-white py-2">
                                        Settings
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if (onSignOutClick) {
                                                onSignOutClick();
                                            }
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full text-left text-sm text-blue-200 hover:text-white py-2"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                    {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.path}>
                                <button
                                    onClick={() => {
                                        isAuthenticated && user ?
                                        handleNavigation(item.path)
                                        : router.push('/signUp')
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        item.isActive
                                            ? 'text-white border border-white/50'
                                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <IconComponent isActive={item.isActive} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer Branding */}
            <div className="p-6 border-t border-blue-400/30">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <img
                            src="/assets/OriginalInvoiceWhiteLogo.svg"
                            alt="Original Invoice"
                            className="h-6 w-auto object-contain"
                        />
                    </div>
                    <p className="text-blue-200 text-xs">
                        Powered by Original Invoice
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;