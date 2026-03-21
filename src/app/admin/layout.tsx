"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                isSuperAdmin={true}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader 
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    isSuperAdmin={true}
                />
                
                <main className="flex-1 overflow-auto scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}
