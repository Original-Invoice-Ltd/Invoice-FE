"use client";

import { useState, useEffect } from "react";
import { X, Bell, Check, CheckCheck } from "lucide-react";
import { ApiClient } from "@/lib/api";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    relatedEntityId?: string;
    relatedEntityType?: string;
    createdAt: string;
}

interface NotificationsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onUnreadCountChange?: (count: number) => void;
}

const NotificationsPanel = ({ isOpen, onClose, onUnreadCountChange }: NotificationsPanelProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications when panel opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await ApiClient.getAllNotifications();
            
            if (response.status === 200) {
                setNotifications(response.data || []);
                // Count unread notifications
                const unread = (response.data || []).filter((n: Notification) => !n.isRead).length;
                setUnreadCount(unread);
                onUnreadCountChange?.(unread);
            } else {
                console.error('Failed to fetch notifications:', response.error);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const response = await ApiClient.markNotificationAsRead(notificationId);
            
            if (response.status === 200) {
                // Update local state
                setNotifications(prev => 
                    prev.map(n => 
                        n.id === notificationId ? { ...n, isRead: true } : n
                    )
                );
                const newUnreadCount = Math.max(0, unreadCount - 1);
                setUnreadCount(newUnreadCount);
                onUnreadCountChange?.(newUnreadCount);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await ApiClient.markAllNotificationsAsRead();
            
            if (response.status === 200) {
                // Update local state
                setNotifications(prev => 
                    prev.map(n => ({ ...n, isRead: true }))
                );
                setUnreadCount(0);
                onUnreadCountChange?.(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'INVOICE_CREATED':
            case 'INVOICE_UPDATED':
            case 'INVOICE_DELETED':
                return (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3H14C14.5523 3 15 3.44772 15 4V12C15 12.5523 14.5523 13 14 13H2C1.44772 13 1 12.5523 1 12V4C1 3.44772 1.44772 3 2 3Z" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 7H11M5 9H9" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                );
            case 'CLIENT_CREATED':
            case 'CLIENT_UPDATED':
            case 'CLIENT_DELETED':
                return (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="#16A34A"/>
                            <path d="M8 10C4.68629 10 2 12.6863 2 16H14C14 12.6863 11.3137 10 8 10Z" fill="#16A34A"/>
                        </svg>
                    </div>
                );
            case 'PAYMENT_RECEIVED':
                return (
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 1L10.5 6H15L11 9.5L12.5 15L8 11.5L3.5 15L5 9.5L1 6H5.5L8 1Z" fill="#059669"/>
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Bell size={16} className="text-gray-600" />
                    </div>
                );
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}m ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d ago`;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                onClick={onClose}
            />
            
            {/* Panel */}
            <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#E4E7EC]">
                    <div className="flex items-center gap-2">
                        <Bell size={20} className="text-[#667085]" />
                        <h2 className="text-lg font-semibold text-[#101828]">Notifications</h2>
                        {unreadCount > 0 && (
                            <span className="bg-[#F04438] text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-[#2F80ED] hover:text-[#2563EB] text-sm font-medium flex items-center gap-1"
                            >
                                <CheckCheck size={16} />
                                Mark all read
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="text-[#667085] hover:text-[#101828] p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Bell size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-[#101828] mb-2">No notifications yet</h3>
                            <p className="text-sm text-[#667085] text-center">
                                You'll see notifications here when you create invoices, add clients, or receive payments.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#E4E7EC]">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-gray-50 transition-colors ${
                                        !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {getNotificationIcon(notification.type)}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-[#101828] mb-1">
                                                        {notification.title}
                                                    </h4>
                                                    <p className="text-sm text-[#667085] mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-[#98A2B3]">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </p>
                                                </div>
                                                {!notification.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-[#2F80ED] hover:text-[#2563EB] p-1 ml-2"
                                                        title="Mark as read"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationsPanel;