"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import CustomerNotificationsPanel from "./CustomerNotificationsPanel";
<<<<<<< HEAD
import { useCustomerNotifications } from "@/hooks/useCustomerNotifications";
=======
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0

interface CustomerHeaderProps {
    onMenuClick?: () => void;
}

const CustomerHeader = ({ onMenuClick }: CustomerHeaderProps) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
<<<<<<< HEAD
    const { unreadCount } = useCustomerNotifications();
=======
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0

    return (
        <>
            <header className="h-[72px] bg-[#eff8ff] border-b border-[#E4E7EC] flex items-center justify-between px-4 md:px-6 shadow-sm">
                {/* Left Section - Hamburger on mobile, Home on desktop */}
                <div className="flex items-center gap-3">
                    {/* Hamburger Menu - Mobile only */}
                    <button 
                        onClick={onMenuClick}
                        className="p-2 hover:bg-white rounded-lg transition-colors md:hidden"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="#101828" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18M3 6h18M3 18h18"/>
                        </svg>
                    </button>
                    <h1 className="text-[#101828] font-medium text-lg hidden md:block">Home</h1>
                </div>

                {/* Center Section - Empty */}
                <div className="flex-1"></div>

                {/* Right Section - Notification & Language */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Notification Bell */}
                    <button 
                        onClick={() => setIsNotificationsOpen(true)}
                        className="relative p-2 bg-white rounded-lg transition-colors hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
<<<<<<< HEAD
                        {unreadCount > 0 && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
=======
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
>>>>>>> b729d2b4e15fd6bac6a5abea4b0695f92a8c16b0
                    </button>

                    {/* Language Selector */}
                    <div className="relative">
                        <button className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 text-sm font-medium text-[#2F80ED] hover:bg-gray-50 rounded-lg transition-colors">
                            EN
                            <ChevronDown size={14} className="text-[#667085]" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Notifications Panel */}
            <CustomerNotificationsPanel 
                isOpen={isNotificationsOpen} 
                onClose={() => setIsNotificationsOpen(false)} 
            />
        </>
    );
};

export default CustomerHeader;