"use client";

import { useState } from "react";
import DashboardSideBar from "@/components/dashboardSidebar";
import DashboardContent from "@/components/dashboardContent";
import { Menu } from "lucide-react";
import Image from "next/image";
import siderLogo from './../../../public/assets/header logo.svg';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
            {/* Sidebar */}
            <DashboardSideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E4E7EC]">
                    <Image src={siderLogo} height={32} width={85} alt="logo"/>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>
                </div>
                
                {/* Dashboard Content */}
                <DashboardContent />
            </div>
        </div>
    );
};

export default Dashboard;