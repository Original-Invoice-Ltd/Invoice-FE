"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Settings, BarChart3, CreditCard, FileText, Bell, LogOut, Percent } from "lucide-react";
import { AuthService } from '@/lib/auth';

interface AdminSidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    isSuperAdmin?: boolean;
}


const AdminSidebar = ({ isOpen = true, onClose, isSuperAdmin = true }: AdminSidebarProps) => {
    const pathname = usePathname();

    const menuItems = [
        { label: "Dashboard", href: "/admin/overview", icon: (isActive: boolean) => <BarChart3 size={22} color={isActive ? "white" : "#333436"} /> },
        { label: "Users", href: "/admin/users", icon: (isActive: boolean) => <Users size={22} color={isActive ? "white" : "#333436"} /> },
        { label: "Tax Configuration", href: "/admin/tax-config", icon: (isActive: boolean) => <Percent size={22} color={isActive ? "white" : "#333436"} /> },
        { label: "Subscriptions", href: "/admin/subscriptions", icon: (isActive: boolean) => <CreditCard size={22} color={isActive ? "white" : "#333436"} /> },
        { label: "Reports", href: "/admin/reports", icon: (isActive: boolean) => <FileText size={22} color={isActive ? "white" : "#333436"} /> },
        { label: "Notifications", href: "/admin/notifications", icon: (isActive: boolean) => <Bell size={22} color={isActive ? "white" : "#333436"} /> },
    ];

    const superAdminItems = [
        { label: "System Config", href: "/admin/system-config", icon: (isActive: boolean) => <Settings size={22} color={isActive ? "white" : "#333436"} /> },
        { label: "Admin Management", href: "/admin/admin-management", icon: (isActive: boolean) => <Users size={22} color={isActive ? "white" : "#333436"} /> },
    ];

    const isActive = (href: string) => {
        if (href === "/admin/overview") {
            return pathname === "/admin/overview" || pathname === "/admin";
        }
        return pathname?.startsWith(href);
    };

    const handleLogout = async () => {
        await AuthService.logout();
    };


    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-transparent z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:relative inset-y-0 left-0 z-50
                h-screen w-[268px] 
                bg-white border-r border-[#E4E7EC] 
                flex flex-col justify-between
                px-[16px] pt-[24px] pb-[32px]
                transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col gap-[32px]">
                    {/* Logo */}
                    <div className="flex items-center justify-between">
                        <Image 
                            src="/assets/header logo.svg" 
                            height={40} 
                            width={106} 
                            className="h-[40px] w-[106px]" 
                            alt="logo" 
                        />
                    </div>

                    {/* Main Menu Items */}
                    <div className="flex flex-col gap-[8px]">
                        {menuItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px]
                                        transition-colors duration-200
                                        ${active
                                            ? 'bg-[#2F80ED] text-white'
                                            : 'text-[#667085] hover:bg-gray-100'
                                        }
                                    `}
                                    onClick={onClose}
                                >
                                    {item.icon(active)}
                                    <span className="text-[14px] font-medium">{item.label}</span>
                                </Link>
                            );
                        })}

                        {isSuperAdmin && (
                            <>
                                <div className="my-[16px] border-t border-[#E4E7EC]"></div>
                                <div className="px-[12px] py-[8px] text-[12px] font-semibold text-[#667085] uppercase tracking-wide">
                                    Super Admin
                                </div>
                                {superAdminItems.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            className={`
                                                flex items-center gap-[12px] px-[12px] py-[10px] rounded-[8px]
                                                transition-colors duration-200
                                                ${active
                                                    ? 'bg-[#2F80ED] text-white'
                                                    : 'text-[#667085] hover:bg-gray-100'
                                                }
                                            `}
                                            onClick={onClose}
                                        >
                                            {item.icon(active)}
                                            <span className="text-[14px] font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Menu Items */}
                <div className="flex flex-col gap-[8px]">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-[12px] px-[12px] 
                        py-[10px] rounded-[8px] text-[#667085] 
                        hover:bg-gray-100 transition-colors duration-200 w-full text-left"
                    >
                        <LogOut size={20} />
                        <span className="text-[14px] font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
