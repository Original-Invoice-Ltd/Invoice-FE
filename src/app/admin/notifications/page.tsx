"use client";

import { Send, Clock, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { AdminApi, AdminNotification } from "@/lib/adminApi";

const AdminNotificationsPage = () => {
    const [notificationType, setNotificationType] = useState("announcement");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [targetSegment, setTargetSegment] = useState("all");
    const [scheduleType, setScheduleType] = useState("immediate");
    const [scheduledTime, setScheduledTime] = useState("");
    const [sending, setSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState("");
    const [history, setHistory] = useState<AdminNotification[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoadingHistory(true);
            const res = await AdminApi.getNotificationHistory();
            if (res.status === 200 && res.data) setHistory(res.data);
            setLoadingHistory(false);
        };
        fetchHistory();
    }, []);

    const handleSendNotification = async () => {
        if (!title.trim() || !message.trim()) {
            setSendError("Title and message are required.");
            return;
        }
        setSending(true);
        setSendError("");
        const res = await AdminApi.sendNotification({
            type: notificationType,
            title,
            message,
            targetSegment,
            scheduleType,
            scheduledTime: scheduleType === "scheduled" ? scheduledTime : undefined,
        });
        if (res.status === 200 || res.status === 201) {
            setSendSuccess(true);
            setTitle("");
            setMessage("");
            setTimeout(() => setSendSuccess(false), 3000);
            // Refresh history
            const histRes = await AdminApi.getNotificationHistory();
            if (histRes.status === 200 && histRes.data) setHistory(histRes.data);
        } else {
            setSendError(res.error || "Failed to send notification.");
        }
        setSending(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "sent": return "bg-green-100 text-green-700";
            case "scheduled": return "bg-yellow-100 text-yellow-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Notifications & Alerts</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Send announcements and manage system alerts</p>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-6">Compose Notification</h2>

                {sendSuccess && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700 font-medium">Notification sent successfully</p>
                    </div>
                )}
                {sendError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-700">{sendError}</p>
                    </div>
                )}

                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Notification Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-4 border border-[#E4E7EC] rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="type" value="announcement" checked={notificationType === "announcement"} onChange={(e) => setNotificationType(e.target.value)} className="w-4 h-4" />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Platform Announcement</p>
                                    <p className="text-xs text-gray-500">Send to all or specific users</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-4 border border-[#E4E7EC] rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="type" value="maintenance" checked={notificationType === "maintenance"} onChange={(e) => setNotificationType(e.target.value)} className="w-4 h-4" />
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">Maintenance Notice</p>
                                    <p className="text-xs text-gray-500">Schedule downtime notification</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Title *</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Message *</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Notification message" rows={5} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Target Audience</label>
                            <select value={targetSegment} onChange={(e) => setTargetSegment(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm">
                                <option value="all">All Users</option>
                                <option value="free">Free Plan Users</option>
                                <option value="essentials">Essentials Plan Users</option>
                                <option value="premium">Premium Plan Users</option>
                                <option value="inactive">Inactive Users</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Schedule</label>
                            <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm">
                                <option value="immediate">Send Immediately</option>
                                <option value="scheduled">Schedule for Later</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Send Date & Time {scheduleType === "immediate" && <span className="text-gray-400 font-normal">(optional — leave blank to send now)</span>}
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            disabled={scheduleType === "immediate"}
                            className={`w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm ${scheduleType === "immediate" ? "opacity-40 cursor-not-allowed bg-gray-50" : ""}`}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSendNotification}
                    disabled={sending}
                    className="w-full sm:w-auto px-6 py-3 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                    <Send size={20} />
                    {sending ? "Sending..." : "Send Notification"}
                </button>
            </div>

            <div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">Notification History</h2>
                {loadingHistory ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />)}
                    </div>
                ) : history.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">No notifications sent yet</p>
                ) : (
                    <div className="space-y-3">
                        {history.map((notif) => (
                            <div key={notif.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm text-gray-800">{notif.title}</p>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{notif.message}</p>
                                        <div className="flex items-center gap-4 mt-3 flex-wrap">
                                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                                <Users size={14} />
                                                {notif.audience}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                                                <Clock size={14} />
                                                {notif.sentAt}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-xs font-semibold flex-shrink-0 ${getStatusColor(notif.status)}`}>
                                        {notif.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotificationsPage;
