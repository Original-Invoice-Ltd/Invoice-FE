"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";

const CustomerHeader = () => {
    return (
        <header className="h-[72px] bg-white border-b border-[#E4E7EC] flex items-center justify-between px-6 shadow-sm">
            {/* Left Section - Logo */}
            <div className="flex items-center">
                <Image
                    src="/assets/header logo.svg"
                    alt="Original Invoice"
                    width={140}
                    height={36}
                />
            </div>

            {/* Center Section - Page Title */}
            <div className="flex-1 text-center">
                <h1 className="text-xl font-semibold text-[#101828]">Invoice Preview</h1>
                <p className="text-sm text-[#667085]">View and download your invoice</p>
            </div>

            {/* Right Section - Language & Support */}
            <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="relative">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#344054] hover:bg-gray-50 rounded-lg border border-[#E4E7EC]">
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
                            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 9.37797C0 13.6777 2.71375 17.343 6.52176 18.756V0C2.71375 1.41289 0 5.07836 0 9.37797Z" fill="#6DA544"/>
                                <path d="M20.0003 9.37797C20.0003 5.07836 17.2865 1.41289 13.4785 0V18.7561C17.2865 17.343 20.0003 13.6777 20.0003 9.37797Z" fill="#6DA544"/>
                            </svg>
                        </div>
                        EN
                        <ChevronDown size={14} className="text-[#667085]" />
                    </button>
                </div>

                {/* Support Button */}
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#2F80ED] hover:bg-blue-50 rounded-lg border border-[#2F80ED] transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00004C14.6667 4.31814 11.6819 1.33337 8 1.33337C4.31811 1.33337 1.33334 4.31814 1.33334 8.00004C1.33334 11.6819 4.31811 14.6667 8 14.6667Z" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6.06 6.00004C6.21674 5.55448 6.52609 5.17878 6.93198 4.93946C7.33787 4.70014 7.81 4.61267 8.27 4.69251C8.73 4.77235 9.14613 5.01436 9.43892 5.37573C9.73171 5.7371 9.88 6.19439 9.86 6.66671C9.86 8.00004 7.86 8.66671 7.86 8.66671" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 11.3334H8.00667" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Support
                </button>
            </div>
        </header>
    );
};

export default CustomerHeader;