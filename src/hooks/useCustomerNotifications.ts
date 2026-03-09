import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '@/lib/api';
import { subscribeToPusherChannel, disconnectPusher } from '@/lib/pusher';
import { useAuth } from '@/contexts/AuthContext';

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

interface CustomerNotification {
    id: number;
    title: string;
    message: string;
    subMessage: string;
    fileName: string;
    fileSize: string;
    receiptNumber: string;
    invoiceNumber: string;
}

export const useCustomerNotifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Transform backend notification to customer notification format
    const transformNotification = (notification: Notification): CustomerNotification => {
        // Extract invoice and receipt numbers from relatedEntityId or message
        const invoiceMatch = notification.message.match(/INV-\d+/);
        const receiptMatch = notification.message.match(/RCT-\d+/);
        
        return {
            id: parseInt(notification.id) || Math.random(),
            title: notification.title || "Receipt Available",
            message: notification.message,
            subMessage: "Your receipt has been automatically generated and is attached below.",
            fileName: `Payment_Receipt_${receiptMatch?.[0] || 'RCT-000000'}.pdf`,
            fileSize: "0 KB of 120 KB",
            receiptNumber: receiptMatch?.[0] || "RCT-000000",
            invoiceNumber: invoiceMatch?.[0] || "INV-000000"
        };
    };

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await ApiClient.getAllNotifications();
            
            if (response.status === 200 && response.data) {
                const backendNotifications = response.data as Notification[];
                // Transform backend notifications to customer format
                const transformedNotifications = backendNotifications.map(transformNotification);
                setNotifications(transformedNotifications);
                
                // Count unread notifications
                const unread = backendNotifications.filter((n: Notification) => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Error fetching customer notifications:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch initial unread count
    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await ApiClient.getUnreadCount();
            if (response.status === 200) {
                setUnreadCount(Number(response.data) || 0);
            }
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    }, []);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            const response = await ApiClient.markNotificationAsRead(notificationId);
            
            if (response.status === 200) {
                // Update local state
                setNotifications(prev => 
                    prev.map(n => 
                        n.id.toString() === notificationId ? { ...n } : n
                    )
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await ApiClient.markAllNotificationsAsRead();
            
            if (response.status === 200) {
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    }, []);

    // Set up Pusher real-time notifications
    useEffect(() => {
        if (!user?.id) return;

        const unsubscribe = subscribeToPusherChannel(
            `user-${user.id}`,
            'notification',
            (data: any) => {
                // Increment unread count
                setUnreadCount(prev => prev + 1);
                
                // Optionally refetch notifications to get the latest
                fetchNotifications();
            }
        );

        return () => {
            unsubscribe();
            disconnectPusher();
        };
    }, [user?.id, fetchNotifications]);

    // Fetch initial unread count on mount
    useEffect(() => {
        if (user?.id) {
            fetchUnreadCount();
        }
    }, [user?.id, fetchUnreadCount]);

    return {
        notifications,
        isLoading,
        unreadCount,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    };
};
