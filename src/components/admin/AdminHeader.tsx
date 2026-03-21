"use client";

import { Menu, Bell, User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface AdminHeaderProps {
    onMenuClick: () => void;
    isSuperAdmin?: boolean;
}

const AdminHeader = ({ onMenuClick, isSuperAdmin = false }: AdminHeaderProps) => {
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="bg-white border-b border-[#E4E7EC] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
                    <Menu size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Admin Console</h1>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                    <Bell size={24} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 hidden sm:block">
                            Admin
                        </span>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-50">
                            <div className="p-4 border-b border-[#E4E7EC]">
                                <p className="text-sm font-medium text-gray-900">Admin User</p>
                                <p className="text-xs text-gray-500">admin@example.com</p>
                                {isSuperAdmin && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                                        Super Admin
                                    </span>
                                )}
                            </div>
                            <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Profile Settings
                            </Link>
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
