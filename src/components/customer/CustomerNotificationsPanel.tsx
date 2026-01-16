"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Notification {
    id: number;
    title: string;
    message: string;
    subMessage: string;
    fileName: string;
    fileSize: string;
    receiptNumber: string;
    invoiceNumber: string;
}

interface CustomerNotificationsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const CustomerNotificationsPanel = ({ isOpen, onClose }: CustomerNotificationsPanelProps) => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");

    // Mock notifications
    const notifications: Notification[] = [
        {
            id: 1,
            title: "Receipt Available",
            message: "Your payment for Invoice INV-004532 has been confirmed by Tech Solution Ltd.",
            subMessage: "Your receipt has been automatically generated and is attached below.",
            fileName: "Payment_Receipt_RCT-000983.pdf",
            fileSize: "0 KB of 120 KB",
            receiptNumber: "RCT-000983",
            invoiceNumber: "INV-004532"
        },
        {
            id: 2,
            title: "Receipt Available",
            message: "Your payment for Invoice INV-004532 has been confirmed by Tech Solution Ltd.",
            subMessage: "Your receipt has been automatically generated and is attached below.",
            fileName: "Payment_Receipt_RCT-000983.pdf",
            fileSize: "0 KB of 120 KB",
            receiptNumber: "RCT-000984",
            invoiceNumber: "INV-004533"
        }
    ];

    const handleViewReceipt = (notification: Notification) => {
        onClose();
        router.push(`/customer/receipt/${notification.id}`);
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-40"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                onClick={onClose}
            />
            
            {/* Panel - Full screen on mobile */}
            <div className="fixed inset-0 sm:inset-auto sm:top-16 sm:right-4 bg-white shadow-2xl z-50 flex flex-col sm:rounded-lg border-0 sm:border border-[#E4E7EC] sm:w-[450px] sm:max-h-[calc(100vh-5rem)]">
                {/* Header */}
                <div className="p-4 border-b border-[#E4E7EC]">
                    <div className="flex items-center gap-4 mb-4">
                        {/* Back button on mobile */}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors sm:hidden"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="#101828" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 12H5m0 0l7 7m-7-7l7-7"/>
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold text-[#101828] flex-1">Notifications</h2>
                        <button
                            onClick={onClose}
                            className="text-[#667085] hover:text-[#101828] p-1 hidden sm:block"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 20 20">
                                <path stroke="#667085" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.88 13.88a6.667 6.667 0 1 0-9.427-9.427 6.667 6.667 0 0 0 9.428 9.428Zm0 0 3.62 3.62M6.22 6.22a4.167 4.167 0 0 1 5.893 0"/>
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="divide-y divide-[#E4E7EC]">
                        {notifications.map((notification) => (
                            <div key={notification.id} className="p-4">
                                <h4 className="text-sm font-semibold text-[#101828] mb-2">{notification.title}</h4>
                                <p className="text-sm text-[#667085] mb-1">{notification.message}</p>
                                <p className="text-sm text-[#667085] mb-4">{notification.subMessage}</p>
                                
                                {/* File attachment */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
                                            <path fill="#fff" stroke="#EDEDED" strokeWidth="1.5" d="M10 .75h10.515a5.25 5.25 0 0 1 3.712 1.538l9.485 9.485a5.25 5.25 0 0 1 1.538 3.712V34c0 2.9-2.35 5.25-5.25 5.25H10A5.25 5.25 0 0 1 4.75 34V6C4.75 3.1 7.1.75 10 .75Z"/>
                                            <path stroke="#EDEDED" strokeWidth="1.5" d="M23 1v8a4 4 0 0 0 4 4h8"/>
                                            <path fill="#EF4444" d="M0 22a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4v-8Z"/>
                                            <text x="14" y="29" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">PDF</text>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[#101828]">{notification.fileName}</p>
                                        <p className="text-xs text-[#667085]">{notification.fileSize}</p>
                                    </div>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="flex items-center gap-3">
                                    <button className="flex items-center gap-2 px-4 py-2 border border-[#2F80ED] text-[#2F80ED] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M2 10V12.6667C2 13.0203 2.14048 13.3594 2.39052 13.6095C2.64057 13.8595 2.97971 14 3.33333 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Download PDF
                                    </button>
                                    <button 
                                        onClick={() => handleViewReceipt(notification)}
                                        className="flex items-center gap-2 px-4 py-2 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M6 10L10 6M10 6H6M10 6V10M5.33333 2H3.33333C2.59695 2 2 2.59695 2 3.33333V5.33333M10.6667 2H12.6667C13.403 2 14 2.59695 14 3.33333V5.33333M14 10.6667V12.6667C14 13.403 13.403 14 12.6667 14H10.6667M5.33333 14H3.33333C2.59695 14 2 13.403 2 12.6667V10.6667" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        View Receipt
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerNotificationsPanel;