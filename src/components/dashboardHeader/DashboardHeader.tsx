"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Bell, ChevronDown, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthService } from '@/lib/auth';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import { ApiClient } from '@/lib/api';
import { subscribeToPusherChannel, disconnectPusher } from '@/lib/pusher';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/hooks/useSubscription';

interface DashboardHeaderProps {
    onMenuClick?: () => void;
    onNotificationsChange?: (isOpen: boolean) => void;
}

const languages = [
    { code: "EN", nameKey: "english_default" },
    { code: "HA", nameKey: "hausa" },
    { code: "IG", nameKey: "igbo" },
    { code: "YO", nameKey: "yoruba" },
];

const DashboardHeader = ({ onMenuClick, onNotificationsChange }: DashboardHeaderProps) => {
    const { user, loading: userLoading } = useAuth();
    const { selectedLanguage, updateLanguage } = useLanguage();
    const router = useRouter();
    const { t } = useTranslation();
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const languageDropdownRef = useRef<HTMLDivElement>(null);
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const { toast, showError, hideToast } = useToast();
    const { subscription, loading: subscriptionLoading } = useSubscription();

    const getUpgradeButtonText = () => {      
        if (subscriptionLoading) {
            return t('upgrade_now');
        }
        if (!subscription) {
            return t('upgrade_now');
        }
        
        const plan = subscription.plan;
        if (plan === 'PREMIUM') {
            return t('premium_plan');
        }
        return t('upgrade_now');
    };

    const getProfileImage = () => {
        if (user?.imageUrl) return user.imageUrl;
        return "";
    };

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user?.id) return;
            
            try {
                const response = await ApiClient.getUnreadCount();
                if (response.status === 200) {
                    setUnreadCount(Number(response.data) || 0);
                }
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        fetchUnreadCount();
    }, [user?.id]);

    // Set up Pusher real-time notifications
    useEffect(() => {
        if (!user?.id) return;

        const unsubscribe = subscribeToPusherChannel(
            `user-${user.id}`,
            'notification',
            (data: any) => {
                // Increment unread count
                setUnreadCount(prev => prev + 1);
                
                // You could also show a toast notification here
                // toast.success(data.title);
            }
        );

        return () => {
            unsubscribe();
            disconnectPusher();
        };
    }, [user?.id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setShowLanguageDropdown(false);
            }
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await AuthService.logout();
    };

    const handleProfileSettings = () => {
        setShowProfileDropdown(false);
        router.push('/dashboard/settings/account');
    };

    return (
        <header className="h-[78px] bg-white border-b border-[#E4E7EC] flex items-center justify-between gap-4 px-4 lg:px-8 py-4">
            {/* Left Section - Logo (Mobile), Hamburger and Search */}
            <div className="flex items-center gap-3">
                {/* Logo - Mobile Only */}
                <div className="lg:hidden">
                    <Image
                        src="/assets/header logo.svg"
                        alt="Logo"
                        width={85}
                        height={32}
                    />
                </div>

                {/* Hamburger Menu - Desktop Only */}
                <button
                    onClick={onMenuClick}
                    className="hidden lg:flex w-[44px] h-[44px] items-center justify-center rounded-lg border border-[#E4E7EC] hover:bg-gray-50 flex-shrink-0"
                >
                    <Menu size={20} className="text-[#667085]" />
                </button>

                {/* Search Bar - Desktop Only */}
                <div className="relative hidden lg:block" style={{ width: '430px', height: '38px' }}>
                    <div className="absolute top-1/2 transform -translate-y-1/2" style={{ left: '12px' }}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8807 13.8807C16.4842 11.2772 16.4842 7.05612 13.8807 4.45262C11.2772 1.84913 7.05612 1.84913 4.45262 4.45262C1.84913 7.05612 1.84913 11.2772 4.45262 13.8807C7.05612 16.4842 11.2772 16.4842 13.8807 13.8807ZM13.8807 13.8807L17.5 17.5M6.2204 6.22039C7.84758 4.5932 10.4858 4.5932 12.113 6.22039" stroke="#7D7F81" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder={t('search')}
                        className="w-full h-full border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                        style={{ paddingLeft: '44px', paddingRight: '80px', paddingTop: '8px', paddingBottom: '8px' }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        <kbd className="w-5 h-5 flex items-center justify-center text-[10px] font-semibold text-[#667085] bg-[#F9FAFB] border border-[#D0D5DD] rounded">
                            ⌘
                        </kbd>
                        <kbd className="w-5 h-5 flex items-center justify-center text-[10px] font-semibold text-[#667085] bg-[#F9FAFB] border border-[#D0D5DD] rounded">
                            K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Right Section - Language, Notifications, Profile, Hamburger (Mobile), Upgrade */}
            <div className="flex items-center">
                <div className="flex items-center" style={{ gap: '16px' }}>
                    {/* Language Selector */}
                    <div className="relative" ref={languageDropdownRef}>
                        <button
                            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#344054] hover:bg-gray-50 rounded-lg"
                        >
                            {selectedLanguage}
                            <ChevronDown size={14} className="text-[#667085]" />
                        </button>

                        {showLanguageDropdown && (
                            <div className="absolute right-0 mt-2 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-50 overflow-hidden" style={{ width: '200px' }}>
                                <div className="py-1">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={async () => {
                                                if (!user) {
                                                    showError("Unable to complete this request");
                                                    setShowLanguageDropdown(false);
                                                    return;
                                                }
                                                
                                                const success = await updateLanguage(lang.code);
                                                if (!success) {
                                                    showError("Failed to update language preference. Please try again.");
                                                }
                                                setShowLanguageDropdown(false);
                                            }}
                                            className={`w-full px-4 py-2.5 text-left text-xs hover:bg-[#F9FAFB] transition-colors ${
                                                selectedLanguage === lang.code ? 'bg-[#F9FAFB]' : ''
                                            }`}
                                        >
                                            <div className="font-medium text-[#101828]">
                                                {lang.code} {t(lang.nameKey)}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notification Bell */}
                    <button 
                        onClick={() => {
                            setShowNotifications(true);
                            onNotificationsChange?.(true);
                        }}
                        className="relative flex items-center justify-center rounded-lg hover:bg-gray-50 border border-[#E4E7EC]" 
                        style={{ width: '32px', height: '32px' }}
                    >
                        <Bell size={20} className="text-[#667085]" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F04438] text-white text-xs rounded-full flex items-center justify-center font-medium">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Profile Picture with Dropdown */}
                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="rounded-full bg-gray-200 overflow-hidden hover:ring-2 hover:ring-[#2F80ED] hover:ring-offset-2 transition-all"
                            style={{ width: '32px', height: '32px' }}
                        >
                            {userLoading ? (
                                <div className="w-full h-full animate-pulse bg-gray-300"></div>
                            ) : getProfileImage().length > 0 ? (
                                <Image
                                    src={getProfileImage()}
                                    alt="Profile"
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full text-[1rem] font-bold bg-primary flex justify-center items-center">
                                    <p>{user?.fullName?.charAt(0) || 'U'}</p>
                                </div>
                            )}
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-50 overflow-hidden" style={{ width: '200px' }}>
                                <div className="py-1">
                                    {user && !userLoading ? (
                                        <div className="px-4 py-2.5 border-b border-[#E4E7EC]">
                                            <div className="text-xs font-medium text-[#101828]">{user.fullName}</div>
                                            <div className="text-xs text-[#667085]">{user.email}</div>
                                        </div>
                                    ) : userLoading ? (
                                        <div className="px-4 py-2.5 border-b border-[#E4E7EC]">
                                            <div className="animate-pulse">
                                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ) : null}
                                    <button
                                        onClick={handleProfileSettings}
                                        className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#F9FAFB] transition-colors flex items-center gap-3"
                                    >
                                        <Settings size={16} className="text-[#667085]" />
                                        <span className="font-medium text-[#101828]">{t('account_settings')}</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#F9FAFB] transition-colors flex items-center gap-3 text-red-600"
                                    >
                                        <LogOut size={16} className="text-red-600" />
                                        <span className="font-medium">{t('logout')}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Hamburger Menu - Mobile Only */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden w-[44px] h-[44px] flex items-center justify-center rounded-lg border border-[#E4E7EC] hover:bg-gray-50 flex-shrink-0"
                    >
                        <Menu size={20} className="text-[#667085]" />
                    </button>
                </div>

                {/* Upgrade Now Button - Desktop Only */}
                <button 
                    onClick={() => router.push("/dashboard/pricing")}
                    className="hidden lg:flex text-[#2F80ED] text-sm font-medium hover:bg-[#EBF5FF] transition-colors flex-shrink-0 border border-[#2F80ED] rounded-lg items-center justify-center" 
                    style={{ width: '131px', height: '46px', marginLeft: '20px' }}
                >
                    {getUpgradeButtonText()}
                </button>
            </div>

            {/* Toast Notification */}
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />

            <NotificationsPanel 
                isOpen={showNotifications} 
                onClose={() => {
                    setShowNotifications(false);
                    onNotificationsChange?.(false);
                }}
                onUnreadCountChange={setUnreadCount}
            />
        </header>
    );
};

export default DashboardHeader;
