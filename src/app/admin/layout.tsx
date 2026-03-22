"use client";

import { useState } from "react";
import DashboardSideBar, { MenuItem, BottomMenuItem } from "@/components/dashboardSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Users, Settings, CreditCard, Bell, LogOut, Percent } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isSuperAdmin = true;

    // Admin menu items
    const adminMenuItems: MenuItem[] = [
        { 
            label: "Dashboard", 
            href: "/admin/overview", 
            icon: (isActive: boolean) => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.19043 2.70703C10.195 1.76435 11.8052 1.76413 12.8096 2.70703L18.041 7.61914L19.7627 9.23633C20.0645 9.51971 20.08 9.9939 19.7969 10.2959C19.6078 10.4973 19.3342 10.568 19.083 10.5107V16.668C19.083 18.552 17.4707 20 15.583 20H6.41602C4.52844 19.9998 2.91602 18.5519 2.91602 16.668V10.5107C2.66506 10.5677 2.39201 10.4971 2.20312 10.2959C1.91994 9.99401 1.93471 9.51981 2.23633 9.23633L3.95801 7.61914H3.95898L9.19043 2.70703ZM11.7832 3.80078C11.3559 3.39962 10.6442 3.39973 10.2168 3.80078L4.98535 8.71289C4.61523 9.06054 4.41618 9.5216 4.41602 9.99121V16.668C4.41602 17.6358 5.26639 18.4998 6.41602 18.5H15.583C16.7328 18.5 17.583 17.6359 17.583 16.668V9.99121C17.5828 9.52147 17.3847 9.06045 17.0146 8.71289L11.7832 3.80078ZM11.833 12.833C12.3851 12.833 12.8328 13.2809 12.833 13.833V15.5C12.833 16.0523 12.3853 16.5 11.833 16.5H10.166C9.61387 16.4998 9.16602 16.0522 9.16602 15.5V13.833C9.16625 13.281 9.61402 12.8332 10.166 12.833H11.833Z" fill={isActive ? "white" : "#333436"}/>
                </svg>
            )
        },
        { 
            label: "Users", 
            href: "/admin/users", 
            icon: (isActive: boolean) => <Users size={22} color={isActive ? "white" : "#333436"} /> 
        },
        { 
            label: "Tax Configuration", 
            href: "/admin/tax-config", 
            icon: (isActive: boolean) => <Percent size={22} color={isActive ? "white" : "#333436"} /> 
        },
        { 
            label: "Subscriptions", 
            href: "/admin/subscriptions", 
            icon: (isActive: boolean) => <CreditCard size={22} color={isActive ? "white" : "#333436"} /> 
        },
        { 
            label: "Reports", 
            href: "/admin/reports", 
            icon: (isActive: boolean) => (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.33333 2.75H4.58333C3.57081 2.75 2.75 3.57081 2.75 4.58333V7.33333C2.75 8.34586 3.57081 9.16667 4.58333 9.16667H7.33333C8.34586 9.16667 9.16667 8.34586 9.16667 7.33333V4.58333C9.16667 3.57081 8.34586 2.75 7.33333 2.75Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                    <path d="M17.4167 2.75H14.6667C13.6541 2.75 12.8333 3.57081 12.8333 4.58333V7.33333C12.8333 8.34586 13.6541 9.16667 14.6667 9.16667H17.4167C18.4292 9.16667 19.25 8.34586 19.25 7.33333V4.58333C19.25 3.57081 18.4292 2.75 17.4167 2.75Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                    <path d="M7.33333 12.8333H4.58333C3.57081 12.8333 2.75 13.6541 2.75 14.6667V17.4167C2.75 18.4292 3.57081 19.25 4.58333 19.25H7.33333C8.34586 19.25 9.16667 18.4292 9.16667 17.4167V14.6667C9.16667 13.6541 8.34586 12.8333 7.33333 12.8333Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                    <path d="M17.4167 12.8333H14.6667C13.6541 12.8333 12.8333 13.6541 12.8333 14.6667V17.4167C12.8333 18.4292 13.6541 19.25 14.6667 19.25H17.4167C18.4292 19.25 19.25 18.4292 19.25 17.4167V14.6667C19.25 13.6541 18.4292 12.8333 17.4167 12.8333Z" stroke={isActive ? "white" : "#333436"} strokeWidth="1.5"/>
                </svg>
            )
        },
        { 
            label: "Notifications", 
            href: "/admin/notifications", 
            icon: (isActive: boolean) => <Bell size={22} color={isActive ? "white" : "#333436"} /> 
        },
    ];

    // Super admin items (conditionally added)
    const superAdminItems: MenuItem[] = isSuperAdmin ? [
        {
            label: "SUPER ADMIN",
            href: "#",
            icon: () => null,
            isSectionDivider: true,
            sectionLabel: "SUPER ADMIN"
        },
        { 
            label: "System Config", 
            href: "/admin/system-config", 
            icon: (isActive: boolean) => <Settings size={22} color={isActive ? "white" : "#333436"} /> 
        },
        { 
            label: "Admin Management", 
            href: "/admin/admin-management", 
            icon: (isActive: boolean) => <Users size={22} color={isActive ? "white" : "#333436"} /> 
        },
    ] : [];

    // Combine menu items
    const allMenuItems = [...adminMenuItems, ...superAdminItems];

    // Bottom items for admin
    const adminBottomItems: BottomMenuItem[] = [
        { icon: LogOut, label: "Logout", href: "#", isLogout: true },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
            <DashboardSideBar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                menuItems={allMenuItems}
                bottomItems={adminBottomItems}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden ml-0 lg:ml-[3px]">
                <AdminHeader 
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    isSuperAdmin={isSuperAdmin}
                />
                
                <main className="flex-1 overflow-auto scrollbar-hide">
                    {children}
                </main>
            </div>
        </div>
    );
}
