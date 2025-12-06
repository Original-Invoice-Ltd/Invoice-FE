"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, LogOut } from "lucide-react";
import siderLogo from './../../../public/assets/header logo.svg';

interface DashboardSideBarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const DashboardSideBar = ({ isOpen = true, onClose }: DashboardSideBarProps) => {
    const pathname = usePathname();
    
    const menuItems = [
        { 
            label: "Dashboard", 
            href: "/dashboard/overview",
            icon: (isActive: boolean) => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.19043 2.70703C10.195 1.76435 11.8052 1.76413 12.8096 2.70703L18.041 7.61914L19.7627 9.23633C20.0645 9.51971 20.08 9.9939 19.7969 10.2959C19.6078 10.4973 19.3342 10.568 19.083 10.5107V16.668C19.083 18.552 17.4707 20 15.583 20H6.41602C4.52844 19.9998 2.91602 18.5519 2.91602 16.668V10.5107C2.66506 10.5677 2.39201 10.4971 2.20312 10.2959C1.91994 9.99401 1.93471 9.51981 2.23633 9.23633L3.95801 7.61914H3.95898L9.19043 2.70703ZM11.7832 3.80078C11.3559 3.39962 10.6442 3.39973 10.2168 3.80078L4.98535 8.71289C4.61523 9.06054 4.41618 9.5216 4.41602 9.99121V16.668C4.41602 17.6358 5.26639 18.4998 6.41602 18.5H15.583C16.7328 18.5 17.583 17.6359 17.583 16.668V9.99121C17.5828 9.52147 17.3847 9.06045 17.0146 8.71289L11.7832 3.80078ZM11.833 12.833C12.3851 12.833 12.8328 13.2809 12.833 13.833V15.5C12.833 16.0523 12.3853 16.5 11.833 16.5H10.166C9.61387 16.4998 9.16602 16.0522 9.16602 15.5V13.833C9.16625 13.281 9.61402 12.8332 10.166 12.833H11.833Z" fill={isActive ? "white" : "#333436"}/>
                </svg>
            )
        },
        { 
            label: "Clients Management", 
            href: "/dashboard/clients",
            icon: (isActive: boolean) => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.582 12.833C18.1133 12.833 20.166 14.8857 20.166 17.417V18.333C20.166 18.8393 19.7553 19.25 19.249 19.25H16.3838C16.4592 18.957 16.499 18.6495 16.499 18.333V17.417C16.499 15.6824 15.8964 14.0886 14.8896 12.833H15.582ZM14.666 2.75C16.6909 2.75015 18.332 4.39204 18.332 6.41699C18.3319 8.44179 16.6908 10.0829 14.666 10.083C14.3015 10.083 13.9495 10.0287 13.6172 9.92969C14.2791 8.92033 14.666 7.71416 14.666 6.41699C14.666 5.11931 14.2795 3.91197 13.6172 2.90234C13.9494 2.80336 14.3016 2.75 14.666 2.75Z" fill={isActive ? "white" : "#333436"}/>
                    <path d="M9.16667 12.8333H7.33333C4.80203 12.8333 2.75 14.8854 2.75 17.4167V18.3333C2.75 18.8396 3.16041 19.25 3.66667 19.25H12.8333C13.3396 19.25 13.75 18.8396 13.75 18.3333V17.4167C13.75 14.8854 11.698 12.8333 9.16667 12.8333Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                    <path d="M8.25 10.0833C10.275 10.0833 11.9167 8.44171 11.9167 6.41667C11.9167 4.39162 10.275 2.75 8.25 2.75C6.22496 2.75 4.58333 4.39162 4.58333 6.41667C4.58333 8.44171 6.22496 10.0833 8.25 10.0833Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                </svg>
            )
        },
        { 
            label: "Invoices", 
            href: "/dashboard/invoices",
            icon: (isActive: boolean) => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.6953 1.08301C12.2002 1.08305 12.6947 1.1923 13.1455 1.39746C13.5233 1.56944 13.8717 1.80923 14.1709 2.1084L18.0596 5.99707C18.3588 6.2963 18.5985 6.64458 18.7705 7.02246C18.9756 7.47312 19.0849 7.96699 19.085 8.47168V17.416C19.085 19.3488 17.5177 20.9157 15.585 20.916H6.41797C4.48497 20.916 2.91797 19.349 2.91797 17.416V4.58301C2.91814 2.65016 4.48508 1.08301 6.41797 1.08301H11.6953ZM6.41797 2.58301C5.31351 2.58301 4.41814 3.47859 4.41797 4.58301V17.416C4.41797 18.5206 5.3134 19.416 6.41797 19.416H15.585C16.6892 19.4157 17.585 18.5204 17.585 17.416V8.47168C17.5849 8.18337 17.5225 7.90107 17.4053 7.64355C17.356 7.53525 17.2967 7.43136 17.2285 7.33301H13.834C13.2818 7.33283 12.834 6.88518 12.834 6.33301V2.93848C12.7361 2.87053 12.6323 2.81184 12.5244 2.7627C12.2668 2.64545 11.9838 2.58305 11.6953 2.58301H6.41797ZM13.9805 9.79102C14.3943 9.79119 14.7301 10.1272 14.7305 10.541V10.8281C15.2472 10.9711 15.678 11.2581 15.9648 11.623C16.2206 11.9485 16.1639 12.4197 15.8389 12.6758C15.5132 12.9317 15.0411 12.8755 14.7852 12.5498C14.675 12.4099 14.4042 12.2286 13.9805 12.2285C13.3014 12.2285 13.1268 12.6375 13.126 12.7285C13.126 12.8781 13.1516 12.9614 13.1709 13.0029C13.1879 13.0393 13.2101 13.0648 13.2461 13.0898C13.3395 13.1547 13.5547 13.2285 13.9805 13.2285C14.5166 13.2285 15.1041 13.311 15.5723 13.6367C16.0938 13.9998 16.3348 14.5675 16.335 15.2285C16.335 16.1472 15.6378 16.863 14.7305 17.1221V17.416C14.7305 17.8301 14.3945 18.1658 13.9805 18.166C13.5663 18.166 13.2305 17.8302 13.2305 17.416V17.1279C12.7139 16.985 12.2829 16.6998 11.9961 16.335C11.7402 16.0093 11.7965 15.5372 12.1221 15.2812C12.4477 15.0256 12.9199 15.0827 13.1758 15.4082C13.286 15.5481 13.5567 15.7285 13.9805 15.7285C14.6609 15.7284 14.835 15.3182 14.835 15.2285C14.8349 15.0792 14.8094 14.9965 14.79 14.9551C14.773 14.9187 14.7509 14.8932 14.7148 14.8682C14.6216 14.8033 14.4064 14.7286 13.9805 14.7285C13.4443 14.7285 12.8569 14.647 12.3887 14.3213C11.8668 13.9581 11.626 13.3899 11.626 12.7285C11.6263 11.81 12.3231 11.0938 13.2305 10.835V10.541C13.2308 10.1271 13.5665 9.79102 13.9805 9.79102ZM11.001 8.41602C11.4148 8.41619 11.7506 8.75221 11.751 9.16602C11.751 9.58012 11.415 9.91584 11.001 9.91602H6.41797C6.00376 9.91602 5.66797 9.58023 5.66797 9.16602C5.66832 8.7521 6.00397 8.41602 6.41797 8.41602H11.001ZM10.085 4.75C10.4988 4.75035 10.8348 5.08615 10.835 5.5C10.8348 5.91385 10.4988 6.24965 10.085 6.25H6.41797C6.00386 6.25 5.66814 5.91406 5.66797 5.5C5.66814 5.08594 6.00386 4.75 6.41797 4.75H10.085Z" fill={isActive ? "white" : "#333436"}/>
                </svg>
            )
        },
        { 
            label: "Products", 
            href: "/dashboard/products",
            icon: (isActive: boolean) => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.90625 6.82031L11.0004 11.5045L19.0396 6.84778" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 19.8093V11.4951" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.10305 2.2735L4.20806 4.99602C3.09889 5.61019 2.19141 7.15017 2.19141 8.41517V13.5944C2.19141 14.8594 3.09889 16.3993 4.20806 17.0135L9.10305 19.736C10.1481 20.3135 11.8622 20.3135 12.9072 19.736L17.8022 17.0135C18.9114 16.3993 19.8189 14.8594 19.8189 13.5944V8.41517C19.8189 7.15017 18.9114 5.61019 17.8022 4.99602L12.9072 2.2735C11.853 1.68683 10.1481 1.68683 9.10305 2.2735Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M15.5839 12.1366V8.78167L6.88477 3.7583" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            label: "Payment Received", 
            href: "/dashboard/payment",
            icon: (isActive: boolean) => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.0007 7.3335C9.62565 7.3335 8.70898 8.25016 8.70898 9.16683C8.70898 10.5418 9.62565 11.0002 11.0007 11.0002C12.3757 11.0002 13.2923 11.4585 13.2923 12.8335C13.2923 13.7502 12.3757 14.6668 11.0007 14.6668M11.0007 7.3335C12.3757 7.3335 13.2923 8.25016 13.2923 9.01405M11.0007 7.3335V5.9585M11.0007 14.6668C9.62565 14.6668 8.86176 13.7502 8.86176 12.9863M11.0007 14.6668V16.0418M11.0007 20.1668C5.93804 20.1668 1.83398 16.0628 1.83398 11.0002C1.83398 5.93755 5.93804 1.8335 11.0007 1.8335C16.0633 1.8335 20.1673 5.93755 20.1673 11.0002C20.1673 16.0628 16.0633 20.1668 11.0007 20.1668Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            )
        },
        { 
            label: "Reports", 
            href: "/dashboard/reports",
            icon: (isActive: boolean) => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.33333 2.75H4.58333C3.57081 2.75 2.75 3.57081 2.75 4.58333V7.33333C2.75 8.34586 3.57081 9.16667 4.58333 9.16667H7.33333C8.34586 9.16667 9.16667 8.34586 9.16667 7.33333V4.58333C9.16667 3.57081 8.34586 2.75 7.33333 2.75Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                    <path d="M17.4167 2.75H14.6667C13.6541 2.75 12.8333 3.57081 12.8333 4.58333V7.33333C12.8333 8.34586 13.6541 9.16667 14.6667 9.16667H17.4167C18.4292 9.16667 19.25 8.34586 19.25 7.33333V4.58333C19.25 3.57081 18.4292 2.75 17.4167 2.75Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                    <path d="M7.33333 12.8333H4.58333C3.57081 12.8333 2.75 13.6541 2.75 14.6667V17.4167C2.75 18.4292 3.57081 19.25 4.58333 19.25H7.33333C8.34586 19.25 9.16667 18.4292 9.16667 17.4167V14.6667C9.16667 13.6541 8.34586 12.8333 7.33333 12.8333Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                    <path d="M17.4167 12.8333H14.6667C13.6541 12.8333 12.8333 13.6541 12.8333 14.6667V17.4167C12.8333 18.4292 13.6541 19.25 14.6667 19.25H17.4167C18.4292 19.25 19.25 18.4292 19.25 17.4167V14.6667C19.25 13.6541 18.4292 12.8333 17.4167 12.8333Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                </svg>
            )
        },
    ];
    
    const isActive = (href: string) => {
        if (href === "/dashboard/overview") {
            return pathname === "/dashboard/overview" || pathname === "/dashboard";
        }
        return pathname?.startsWith(href);
    };

    const bottomItems = [
        { icon: Settings, label: "Account Settings", href: "/dashboard/settings" },
        { icon: LogOut, label: "Logout", href: "/logout" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-transparent z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-50
                h-screen w-[268px] 
                bg-white border-r border-[#E4E7EC] 
                flex flex-col justify-between
                px-[16px] pt-[24px] pb-[32px]
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col gap-[32px]">
                    {/* Logo */}
                    <div className="flex items-center justify-between">
                        <Image src={siderLogo} height={40} width={106} className="h-[40px] w-[106px]" alt="logo" />
                    </div>

                    {/* Main Menu Items */}
                    <div className="flex flex-col gap-[8px]">
                        {menuItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px]
                                        transition-colors duration-200
                                        ${active
                                            ? 'bg-[#2F80ED] text-white'
                                            : 'text-[#667085] hover:bg-[#F9FAFB]'
                                        }
                                    `}
                                    onClick={onClose}
                                >
                                    {item.icon(active)}
                                    <span className="text-[14px] font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Menu Items */}
                <div className="flex flex-col gap-[8px]">
                    {bottomItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-[12px] px-[12px] 
                                py-[10px] rounded-[8px] text-[#667085] 
                                hover:bg-[#F9FAFB] transition-colors duration-200"
                                onClick={onClose}
                            >
                                <Icon size={20} />
                                <span className="text-[14px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default DashboardSideBar;
