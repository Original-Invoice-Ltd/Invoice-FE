"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./";
import CustomerHeader from "@/components/customer/header";

interface CustomerLayoutProps {
    children: ReactNode;
    userProfile?: {
        name: string;
        email: string;
        initials: string;
    };
    showHeader?: boolean;
}

const CustomerLayout = ({ 
    children, 
    userProfile,
    showHeader = true 
}: CustomerLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar - hidden on mobile */}
            <div className="hidden md:block">
                <Sidebar userProfile={userProfile} />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar - slides in from left */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <Sidebar 
                    userProfile={userProfile} 
                    onClose={() => setIsSidebarOpen(false)}
                    isMobile={true}
                />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full md:w-auto">
                {showHeader && (
                    <CustomerHeader 
                        onMenuClick={() => setIsSidebarOpen(true)} 
                    />
                )}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;