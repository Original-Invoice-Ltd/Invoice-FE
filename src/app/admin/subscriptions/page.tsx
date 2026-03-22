"use client";

import { useState } from "react";
import { Search, Filter, AlertCircle } from "lucide-react";
import SubscriptionActionModal from "@/components/admin/modals/SubscriptionActionModal";

interface Subscription {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    plan: "FREE" | "ESSENTIALS" | "PREMIUM";
    status: "active" | "expired" | "cancelled";
    startDate: string;
    expiryDate: string;
    daysUntilExpiry: number;
}

const AdminSubscriptionsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState<"upgrade" | "downgrade" | "extend" | "cancel">("upgrade");

    const mockSubscriptions: Subscription[] = [
        { id: "1", userId: "user1", userName: "John Doe", userEmail: "john@example.com", plan: "PREMIUM", status: "active", startDate: "2024-01-15", expiryDate: "2024-04-15", daysUntilExpiry: 25 },
        { id: "2", userId: "user2", userName: "Jane Smith", userEmail: "jane@example.com", plan: "ESSENTIALS", status: "active", startDate: "2024-02-01", expiryDate: "2024-03-20", daysUntilExpiry: 3 },
        { id: "3", userId: "user3", userName: "Bob Wilson", userEmail: "bob@example.com", plan: "FREE", status: "active", startDate: "2024-01-01", expiryDate: "2025-01-01", daysUntilExpiry: 365 },
    ];

    const itemsPerPage = 10;
    const filteredSubscriptions = mockSubscriptions.filter(sub => {
        const matchesSearch = sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || sub.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = planFilter === "all" || sub.plan === planFilter;
        const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
        return matchesSearch && matchesPlan && matchesStatus;
    });

    const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedSubscriptions = filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage);

    const getPlanColor = (plan: string) => {
        switch (plan) {
            case "PREMIUM": return "bg-purple-100 text-purple-700";
            case "ESSENTIALS": return "bg-[#E8F2FE] text-[#2F80ED]";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-100 text-green-700";
            case "expired": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const isExpiringoon = (daysUntilExpiry: number) => daysUntilExpiry <= 7 && daysUntilExpiry > 0;

    const formatDaysLeft = (days: number): string => {
        if (days >= 365) {
            const years = Math.floor(days / 365);
            return `${years}yr`;
        }
        return `${days}d`;
    };

    const handleAction = (subscription: Subscription, type: typeof actionType) => {
        setSelectedSubscription(subscription);
        setActionType(type);
        setShowActionModal(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Subscription Management</h1>
                    <p className="text-gray-600 mt-1">View and manage user subscriptions</p>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold text-yellow-900">
                        {mockSubscriptions.filter(s => isExpiringoon(s.daysUntilExpiry)).length} subscriptions expiring within 7 days
                    </p>
                    <p className="text-sm text-yellow-700">Review and extend subscriptions to prevent service interruption</p>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 space-y-4">
                <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email or name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                        value={planFilter}
                        onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm"
                    >
                        <option value="all">All Plans</option>
                        <option value="FREE">Free</option>
                        <option value="ESSENTIALS">Essentials</option>
                        <option value="PREMIUM">Premium</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">User</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Plan</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Start Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Expiry Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Days Left</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E7EC]">
                            {paginatedSubscriptions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{sub.userName}</p>
                                            <p className="text-sm text-gray-500">{sub.userEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(sub.plan)}`}>
                                            {sub.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{sub.startDate}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{sub.expiryDate}</td>
                                    <td className="px-6 py-4">
                                        <div className={`text-sm font-semibold ${
                                            isExpiringoon(sub.daysUntilExpiry) ? "text-red-600" : "text-gray-900"
                                        }`}>
                                            {formatDaysLeft(sub.daysUntilExpiry)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleAction(sub, "upgrade")}
                                                className="px-3 py-1 text-sm bg-[#E8F2FE] text-[#2F80ED] rounded hover:bg-[#D4E7FC]"
                                            >
                                                Upgrade
                                            </button>
                                            <button
                                                onClick={() => handleAction(sub, "extend")}
                                                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                                            >
                                                Extend
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-[#E4E7EC] flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSubscriptions.length)} of {filteredSubscriptions.length}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {showActionModal && selectedSubscription && (
                <SubscriptionActionModal
                    subscription={selectedSubscription}
                    actionType={actionType}
                    onClose={() => setShowActionModal(false)}
                />
            )}
        </div>
    );
};

export default AdminSubscriptionsPage;
