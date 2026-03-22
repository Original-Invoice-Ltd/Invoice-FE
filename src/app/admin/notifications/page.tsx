"use client";

import { Send, Clock, Users } from "lucide-react";
import { useState } from "react";

const AdminNotificationsPage = () => {
    const [notificationType, setNotificationType] = useState("announcement");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [targetSegment, setTargetSegment] = useState("all");
    const [scheduleType, setScheduleType] = useState("immediate");
    const [scheduledTime, setScheduledTime] = useState("");

    const handleSendNotification = () => {
        console.log({ notificationType, title, message, targetSegment, scheduleType, scheduledTime });
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Notifications & Alerts</h1>
                <p className="text-gray-600 mt-1">Send announcements and manage system alerts</p>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                <h2 className="text-[16px] font-semibold text-gray-900 mb-6">Compose Notification</h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Notification Type
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-4 border border-[#E4E7EC] rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="type"
                                    value="announcement"
                                    checked={notificationType === "announcement"}
                                    onChange={(e) => setNotificationType(e.target.value)}
                                    className="w-4 h-4"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Platform Announcement</p>
                                    <p className="text-sm text-gray-500">Send to all or specific users</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-4 border border-[#E4E7EC] rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="type"
                                    value="maintenance"
                                    checked={notificationType === "maintenance"}
                                    onChange={(e) => setNotificationType(e.target.value)}
                                    className="w-4 h-4"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Maintenance Notice</p>
                                    <p className="text-sm text-gray-500">Schedule downtime notification</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Notification title"
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Message *
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Notification message"
                            rows={5}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Target Audience
                            </label>
                            <select
                                value={targetSegment}
                                onChange={(e) => setTargetSegment(e.target.value)}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            >
                                <option value="all">All Users</option>
                                <option value="free">Free Plan Users</option>
                                <option value="essentials">Essentials Plan Users</option>
                                <option value="premium">Premium Plan Users</option>
                                <option value="inactive">Inactive Users</option>
                                <option value="custom">Custom Segment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Schedule
                            </label>
                            <select
                                value={scheduleType}
                                onChange={(e) => setScheduleType(e.target.value)}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            >
                                <option value="immediate">Send Immediately</option>
                                <option value="scheduled">Schedule for Later</option>
                            </select>
                        </div>
                    </div>

                    {scheduleType === "scheduled" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Send At
                            </label>
                            <input
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                    )}

                   
                </div>
                
               
            </div>
             <div className="flex justify-end mt-6">
                    <button
                        onClick={handleSendNotification}
                        className="px-6 py-3 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center gap-2"
                    >
                        <Send size={20} />
                        Send Notification
                    </button>
                </div>

            <div className="">
                <h2 className="text-[16px] font-semibold text-gray-900 mb-4">Notification History</h2>
                <div className="space-y-3">
                    {[
                        { title: "New Feature: Invoice Templates", message: "We've added professional invoice templates...", audience: "All Users", sentAt: "2024-03-15 10:30 AM", status: "sent" },
                        { title: "Scheduled Maintenance", message: "Platform maintenance scheduled for March 20...", audience: "All Users", sentAt: "2024-03-14 02:00 PM", status: "sent" },
                        { title: "Premium Plan Upgrade Offer", message: "Get 20% off on Premium plan this month...", audience: "Free Plan Users", sentAt: "2024-03-10 09:00 AM", status: "sent" },
                    ].map((notif, idx) => (
                        <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-100">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-[14px] text-gray-800">{notif.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Users size={16} />
                                            {notif.audience}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Clock size={16} />
                                            {notif.sentAt}
                                        </div>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                    {notif.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminNotificationsPage;
