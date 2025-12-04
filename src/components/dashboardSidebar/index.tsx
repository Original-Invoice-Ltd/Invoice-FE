"use client";

import Image from "next/image";
import Link from "next/link";
import { Home, Users, FileText, Package, DollarSign, BarChart3, Settings, LogOut } from "lucide-react";
import siderLogo from './../../../public/assets/header logo.svg';

interface DashboardSideBarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const DashboardSideBar = ({ isOpen = true, onClose }: DashboardSideBarProps) => {
    const menuItems = [
        { icon: Home, label: "Dashboard", href: "/dashboard", active: true },
        { icon: Users, label: "Clients Management", href: "/dashboard/clients" },
        { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
        { icon: Package, label: "Products", href: "/dashboard/products" },
        { icon: DollarSign, label: "Payment", href: "/dashboard/payment" },
        { icon: BarChart3, label: "Reports", href: "/dashboard/reports" },
    ];

    const bottomItems = [
        { icon: Settings, label: "Account Settings", href: "/dashboard/settings" },
        { icon: LogOut, label: "Logout", href: "/logout" },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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
                        <Image src={siderLogo} height={40} width={106} className="h-[40px] w-[106px]" alt="logo"/>
                    </div>
                    
                    {/* Main Menu Items */}
                    <div className="flex flex-col gap-[8px]">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px]
                                        transition-colors duration-200
                                        ${item.active 
                                            ? 'bg-[#2F80ED] text-white' 
                                            : 'text-[#667085] hover:bg-[#F9FAFB]'
                                        }
                                    `}
                                    onClick={onClose}
                                >
                                    <Icon size={20} />
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
                                className="flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px] text-[#667085] hover:bg-[#F9FAFB] transition-colors duration-200"
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