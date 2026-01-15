"use client";

import { ReactNode } from "react";
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
    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <Sidebar userProfile={userProfile} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {showHeader && <CustomerHeader />}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default CustomerLayout;