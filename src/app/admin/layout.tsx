"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isSuperAdmin = user?.roles?.includes("SUPER_ADMIN") ?? false;

    useEffect(() => {
        if (!loading && !user) {
            router.push("/signIn");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#F9FAFB]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[#F9FAFB]">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                isSuperAdmin={isSuperAdmin}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
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
