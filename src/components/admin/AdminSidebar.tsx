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

    const isActive = (href: string) => pathname === href;

    const handleLogout = async () => {
        await AuthService.logout();
    };


    return (
        <div className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E4E7EC] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-[#E4E7EC]">
                    <Link href="/admin/overview" className="flex items-center gap-2">
                        <Image src="/assets/header logo.svg" alt="Logo" width={56} height={56} />
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    {menuItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link key={item.href} href={item.href} onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-[#2F80ED] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                {item.icon(active)}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}

                    {isSuperAdmin && (
                        <>
                            <div className="my-4 border-t border-[#E4E7EC]"></div>
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Super Admin</div>
                            {superAdminItems.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link key={item.href} href={item.href} onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-[#2F80ED] text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                                        {item.icon(active)}
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </>
                    )}
                </nav>

                <div className="p-4 border-t border-[#E4E7EC]">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <LogOut size={22} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
