"use client";

import { Menu, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/lib/auth";
import { useState } from "react";
import Link from "next/link";

interface AdminHeaderProps {
    onMenuClick: () => void;
    isSuperAdmin?: boolean;
}

const AdminHeader = ({ onMenuClick, isSuperAdmin = false }: AdminHeaderProps) => {
    const { user } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        await AuthService.logout();
    };

    const displayName = user?.fullName?.split(" ")[0] ?? "Admin";

    return (
        <header className="bg-white border-b border-[#E4E7EC] px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    aria-label="Toggle menu"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-base sm:text-xl font-bold text-gray-900">Admin Console</h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                <Link href="/admin/notifications" className="relative p-2 hover:bg-gray-100 rounded-lg" aria-label="Notifications">
                    <Bell size={22} className="text-gray-600" />
                </Link>

                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <div className="w-8 h-8 bg-[#2F80ED] rounded-full flex items-center justify-center flex-shrink-0">
                            {user?.imageUrl ? (
                                <img src={user.imageUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <span className="text-white text-sm font-semibold">
                                    {displayName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 hidden sm:block">
                            {displayName}
                        </span>
                    </button>

                    {showUserMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E4E7EC] rounded-xl shadow-lg z-50">
                                <div className="p-4 border-b border-[#E4E7EC]">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {user?.fullName ?? "Admin User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">
                                        {user?.email ?? ""}
                                    </p>
                                    {isSuperAdmin && (
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                            Super Admin
                                        </span>
                                    )}
                                </div>
                                <div className="py-1">
                                    <Link
                                        href="/admin/profile"
                                        onClick={() => setShowUserMenu(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Profile Settings
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
