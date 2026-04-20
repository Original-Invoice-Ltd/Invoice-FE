"use client";

import { ReactNode, useState } from "react";
import { Sidebar } from "./";
import CustomerHeader from "@/components/customer/header";
import SignOutModal from "@/components/modals/SignOutModal";
import { useRouter } from "next/navigation";

interface CustomerLayoutProps {
    children: ReactNode;
    userProfile?: {
        name: string;
        email: string;
        initials: string;
    };
    showHeader?: boolean;
    showEmailProfile?: boolean;
}

const CustomerLayout = ({
    children,
    userProfile,
    showHeader = true,
    showEmailProfile = false
}: CustomerLayoutProps) => {
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

    const handleSignOut = () => {
        router.push('/signUp');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Desktop Sidebar - fixed */}
            <div className="hidden md:block fixed left-0 top-0 h-full z-30">
                <Sidebar
                    userProfile={userProfile}
                    onSignOutClick={() => setIsSignOutModalOpen(true)}
                    showEmailProfile={showEmailProfile}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <Sidebar
                    userProfile={userProfile}
                    onClose={() => setIsSidebarOpen(false)}
                    isMobile={true}
                    onSignOutClick={() => setIsSignOutModalOpen(true)}
                    showEmailProfile={showEmailProfile}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full md:ml-64 overflow-hidden">
                {showHeader && (
                    <CustomerHeader
                        onMenuClick={() => setIsSidebarOpen(true)}
                    />
                )}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            <SignOutModal
                isOpen={isSignOutModalOpen}
                onClose={() => setIsSignOutModalOpen(false)}
                onConfirm={handleSignOut}
            />
        </div>
    );
};

export default CustomerLayout;
