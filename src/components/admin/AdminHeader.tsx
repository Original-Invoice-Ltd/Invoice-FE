"use client";

import { Menu, Bell, Search, X, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/lib/auth";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminApi, ContactMessage } from "@/lib/adminApi";

interface AdminHeaderProps {
    onMenuClick: () => void;
    isSuperAdmin?: boolean;
}

const AdminHeader = ({ onMenuClick, isSuperAdmin = false }: AdminHeaderProps) => {
    const { user } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showBell, setShowBell] = useState(false);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [search, setSearch] = useState("");

    const fetchData = () => {
        AdminApi.getUnreadContactMessages().then(res => {
            if (res.status === 200 && res.data) {
                const d = res.data as any;
                const list: ContactMessage[] = Array.isArray(d) ? d : d.data?.content ?? d.content ?? d.data ?? [];
                setMessages(list);
            }
        });
        AdminApi.getUnreadContactCount().then(res => {
            if (res.status === 200 && res.data) {
                const d = res.data as any;
                setUnreadCount(d.data ?? d.count ?? d ?? 0);
            }
        });
    };

    useEffect(() => { fetchData(); }, []);

    const handleMarkRead = async (msg: ContactMessage) => {
        await AdminApi.updateContactStatus(msg.id, "READ");
        setMessages(prev => prev.filter(m => m.id !== msg.id));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const filtered = messages.filter(m =>
        !search ||
        m.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        m.subject?.toLowerCase().includes(search.toLowerCase()) ||
        m.message?.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleString("en-GB", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
        }).replace(",", "");
    };

    const handleLogout = async () => { await AuthService.logout(); };
    const displayName = user?.fullName?.split(" ")[0] ?? "Admin";

    return (
        <header className="bg-white border-b border-[#E4E7EC] px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg" aria-label="Toggle menu">
                    <Menu size={24} />
                </button>
                <h1 className="text-base sm:text-xl font-bold text-gray-900">Admin Console</h1>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                {/* Bell */}
                <div className="relative">
                    <button onClick={() => setShowBell(!showBell)} className="relative p-2 hover:bg-gray-100 rounded-lg" aria-label="Notifications">
                        <Bell size={22} className="text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {showBell && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowBell(false)} />
                            <div className="fixed right-4 top-16 w-[460px] max-w-[95vw] bg-white rounded-2xl shadow-2xl z-50 flex flex-col" style={{ maxHeight: "calc(100vh - 80px)" }}>
                                {/* Header */}
                                <div className="px-6 pt-6 pb-4 flex-shrink-0">
                                    <div className="flex items-start justify-between mb-1">
                                        <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                                        <button onClick={() => setShowBell(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-500">Stay updated on invoice activity, payments, reminders, and account alerts.</p>
                                    <div className="relative mt-4">
                                        <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                                            placeholder="search_notifications"
                                            className="w-full pl-9 pr-4 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                                    </div>
                                </div>

                                {/* List */}
                                <div className="overflow-y-auto flex-1 border-t border-[#E4E7EC]">
                                    {filtered.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-10">No new messages</p>
                                    ) : filtered.map((msg, i) => (
                                        <div key={msg.id ?? i} className="flex items-start gap-3 px-6 py-4 border-b border-[#F2F4F7] hover:bg-[#F9FAFB] transition-colors">
                                            <div className="w-9 h-9 bg-[#EBF5FF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Bell size={16} className="text-[#2F80ED]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900">{msg.fullName}</p>
                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{msg.subject}</p>
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(msg.createdAt)}</p>
                                            </div>
                                            <button onClick={() => handleMarkRead(msg)} className="text-[#2F80ED] flex-shrink-0 mt-1" title="Mark as read">
                                                <Check size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* User menu */}
                <div className="relative">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg">
                        <div className="w-8 h-8 bg-[#2F80ED] rounded-full flex items-center justify-center flex-shrink-0">
                            {user?.imageUrl ? (
                                <img src={user.imageUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                                <span className="text-white text-sm font-semibold">{displayName.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 hidden sm:block">{displayName}</span>
                    </button>

                    {showUserMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E4E7EC] rounded-xl shadow-lg z-50">
                                <div className="p-4 border-b border-[#E4E7EC]">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName ?? "Admin User"}</p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email ?? ""}</p>
                                    {isSuperAdmin && (
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Super Admin</span>
                                    )}
                                </div>
                                <div className="py-1">
                                    <Link href="/admin/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                        Profile Settings
                                    </Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
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
