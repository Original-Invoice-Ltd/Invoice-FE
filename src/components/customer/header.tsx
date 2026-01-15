"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";

const CustomerHeader = () => {
    return (
        <header className="h-[72px] bg-[#eff8ff] border-b border-[#E4E7EC] flex items-center justify-between px-6 shadow-sm">
            {/* Left Section - Home */}
            <div className="flex items-center">
                <h1 className="text-[#101828] font-medium text-lg">Home</h1>
            </div>

            {/* Center Section - Empty */}
            <div className="flex-1"></div>

            {/* Right Section - Notification & Language */}
            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <button className="relative p-2 bg-white rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <div className="absolute -top-[-1px] -right-[-2] w-3 h-3 bg-red-500 rounded-full"></div>
                </button>

                {/* Language Selector */}
                <div className="relative">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#2F80ED] hover:bg-gray-50 rounded-lg transition-colors">
                        EN
                        <ChevronDown size={14} className="text-[#667085]" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default CustomerHeader;