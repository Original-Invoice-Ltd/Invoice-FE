"use client";

import { useState } from "react";
import { Home, FileText, CreditCard, ChevronDown, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
    userProfile?: {
        name: string;
        email: string;
        initials: string;
    };
    className?: string;
}

const Sidebar = ({ 
    userProfile = {
        name: "Chiamaka Okeke",
        email: "chiamakaokeke2905......",
        initials: "CO"
    },
    className = ""
}: SidebarProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const navigationItems = [
        {
            icon: Home,
            label: "Home",
            path: "/customerFlow",
            isActive: pathname === "/customerFlow"
        },
        {
            icon: FileText,
            label: "Invoices",
            path: "/customer/invoices",
            isActive: pathname.includes("/customer/invoice")
        },
        {
            icon: CreditCard,
            label: "Payment",
            path: "/customer/payments",
            isActive: pathname.includes("/customer/payment")
        }
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className={`w-64 bg-gradient-to-b from-[#2F80ED] to-[#1E5FCC] text-white flex flex-col min-h-screen ${className}`}>
            {/* Header with Logo */}
            <div className="p-6 border-b border-blue-400/30">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                        <span className="text-[#2F80ED] font-bold text-sm">O</span>
                    </div>
                    <div>
                        <span className="text-white font-semibold text-lg">riginal</span>
                        <div className="text-xs text-blue-200">INVOICE</div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-[#2F80ED] font-semibold text-sm">
                                    {userProfile.initials}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">
                                    {userProfile.name}
                                </p>
                                <p className="text-blue-200 text-xs truncate">
                                    {userProfile.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <ChevronDown 
                                size={16} 
                                className={`transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>
                    
                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                            <button className="w-full text-left text-sm text-blue-200 hover:text-white py-1">
                                View Profile
                            </button>
                            <button className="w-full text-left text-sm text-blue-200 hover:text-white py-1">
                                Settings
                            </button>
                            <button className="w-full text-left text-sm text-blue-200 hover:text-white py-1">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-6">
                <ul className="space-y-2">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <button
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        item.isActive
                                            ? 'bg-white/20 text-white border border-white/30'
                                            : 'text-blue-100 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Icon size={20} />
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
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                            <span className="text-[#2F80ED] font-bold text-xs">O</span>
                        </div>
                        <span className="text-white font-semibold">riginal</span>
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