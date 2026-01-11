"use client";

import { useState } from "react";
import DashboardSideBar from "@/components/dashboardSidebar";
import DashboardHeader from "@/components/dashboardHeader/DashboardHeader";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
            {/* Sidebar */}
            <DashboardSideBar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                notificationsOpen={notificationsOpen}
            />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[3px]">
                {/* Header */}
                <DashboardHeader 
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    onNotificationsChange={setNotificationsOpen}
                />
                
                {/* Page Content - with consistent padding matching header */}
                <main className="flex-1 overflow-auto scrollbar-hide">
                    <div className="px-1 lg:px-2 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
