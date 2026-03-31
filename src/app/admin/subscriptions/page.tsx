"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, AlertCircle } from "lucide-react";
import SubscriptionActionModal from "@/components/admin/modals/SubscriptionActionModal";
import { AdminApi, AdminSubscription } from "@/lib/adminApi";

const AdminSubscriptionsPage = () => {
    const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [planFilter, setPlanFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [selectedSubscription, setSelectedSubscription] = useState<AdminSubscription | null>(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState<"upgrade" | "downgrade" | "extend" | "cancel">("upgrade");

    const itemsPerPage = 10;

    const fetchSubscriptions = useCallback(async () => {
        setLoading(true);
        const res = await AdminApi.getSubscriptions({
            page: currentPage - 1,
            size: itemsPerPage,
            search: searchTerm || undefined,
            plan: planFilter !== "all" ? planFilter : undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
        });
        if (res.status === 200 && res.data) {
            const data = res.data as any;
            const list = Array.isArray(data) ? data : data.content ?? data.data ?? [];
            setSubscriptions(list);
            setTotalPages(data.totalPages ?? 1);
            setTotalElements(data.totalElements ?? list.length);
        }
        setLoading(false);
    }, [currentPage, searchTerm, planFilter, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(fetchSubscriptions, searchTerm ? 400 : 0);
        return () => clearTimeout(timer);
    }, [fetchSubscriptions, searchTerm]);

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

    const isExpiringSoon = (days: number) => days <= 7 && days > 0;

    const formatDaysLeft = (days: number): string => {
        if (days >= 365) return `${Math.floor(days / 365)}yr`;
        return `${days}d`;
    };

    const handleAction = (subscription: AdminSubscription, type: typeof actionType) => {
        setSelectedSubscription(subscription);
        setActionType(type);
        setShowActionModal(true);
    };

    const handleModalClose = () => {
        setShowActionModal(false);
        fetchSubscriptions();
    };

    const expiringSoonCount = subscriptions.filter(s => isExpiringSoon(s.daysUntilExpiry)).length;
    const startIndex = (currentPage - 1) * itemsPerPage;

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Subscription Management</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">View and manage user subscriptions</p>
            </div>

            {expiringSoonCount > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                    <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-yellow-900 text-sm sm:text-base">
                            {expiringSoonCount} subscription{expiringSoonCount > 1 ? "s" : ""} expiring within 7 days
                        </p>
                        <p className="text-xs sm:text-sm text-yellow-700">Review and extend subscriptions to prevent service interruption</p>
                    </div>
                </div>
            )}

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 space-y-4">
                <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email or name..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm">
                        <option value="all">All Plans</option>
                        <option value="FREE">Free</option>
                        <option value="ESSENTIALS">Essentials</option>
                        <option value="PREMIUM">Premium</option>
                    </select>
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">User</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Plan</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Start Date</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Expiry Date</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Days Left</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E7EC]">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></td>
                                        <td className="hidden sm:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                                        <td className="hidden sm:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></td>
                                        <td className="hidden md:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>
                                        <td className="hidden md:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>
                                        <td className="hidden lg:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></td>
                                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                                    </tr>
                                ))
                            ) : subscriptions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">No subscriptions found</td>
                                </tr>
                            ) : (
                                subscriptions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{sub.userName}</p>
                                                <p className="text-xs text-gray-500">{sub.userEmail}</p>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(sub.plan)}`}>{sub.plan}</span>
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}>{sub.status}</span>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-900">{sub.startDate}</td>
                                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-900">{sub.expiryDate}</td>
                                        <td className="hidden lg:table-cell px-6 py-4">
                                            <span className={`text-sm font-semibold ${isExpiringSoon(sub.daysUntilExpiry) ? "text-red-600" : "text-gray-900"}`}>
                                                {formatDaysLeft(sub.daysUntilExpiry)}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleAction(sub, "upgrade")} className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-[#E8F2FE] text-[#2F80ED] rounded hover:bg-[#D4E7FC]">Upgrade</button>
                                                <button onClick={() => handleAction(sub, "extend")} className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">Extend</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 sm:px-6 py-4 border-t border-[#E4E7EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-gray-600">
                        Showing {totalElements === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalElements)} of {totalElements}
                    </p>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex-1 sm:flex-none px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50 text-sm">Previous</button>
                        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="flex-1 sm:flex-none px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50 text-sm">Next</button>
                    </div>
                </div>
            </div>

            {showActionModal && selectedSubscription && (
                <SubscriptionActionModal
                    subscription={selectedSubscription}
                    actionType={actionType}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
};

export default AdminSubscriptionsPage;
