"use client";

import { useState } from "react";
import { Home, FileText, CreditCard, Settings, HelpCircle, LogOut } from "lucide-react";
import Image from "next/image";

const CustomerSidebar = () => {
    const [activeItem, setActiveItem] = useState("invoices");

    const menuItems = [
        { id: "home", label: "Home", icon: Home, href: "/customer" },
        { id: "invoices", label: "Invoices", icon: FileText, href: "/customer/invoices" },
        { id: "payments", label: "Payments", icon: CreditCard, href: "/customer/payments" },
        { id: "settings", label: "Settings", icon: Settings, href: "/customer/settings" },
    ];

    const bottomItems = [
        { id: "help", label: "Help & Support", icon: HelpCircle, href: "/customer/help" },
        { id: "logout", label: "Logout", icon: LogOut, href: "#" },
    ];

    return (
        <div className="w-64 bg-white border-r border-[#E4E7EC] flex flex-col h-screen">
            {/* Logo Section */}
            <div className="p-6 border-b border-[#E4E7EC]">
                <Image
                    src="/assets/header logo.svg"
                    alt="Original Invoice"
                    width={140}
                    height={36}
                />
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6">
                <div className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveItem(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                                    isActive
                                        ? "bg-[#EFF8FF] text-[#2F80ED] border border-[#2F80ED]"
                                        : "text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828]"
                                }`}
                            >
                                <Icon size={20} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Menu */}
            <div className="px-4 py-6 border-t border-[#E4E7EC]">
                <div className="space-y-2">
                    {bottomItems.map((item) => {
                        const Icon = item.icon;
                        const isLogout = item.id === "logout";
                        
                        return (
                            <button
                                key={item.id}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                                    isLogout
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-[#667085] hover:bg-[#F9FAFB] hover:text-[#101828]"
                                }`}
                            >
                                <Icon size={20} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Customer Info */}
            <div className="px-4 py-4 border-t border-[#E4E7EC] bg-[#F9FAFB]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#2F80ED] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">C</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#101828]">Customer</p>
                        <p className="text-xs text-[#667085]">View Mode</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSidebar;