"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Eye, ChevronDown, Download } from "lucide-react";
import UserDetailModal from "@/components/admin/modals/UserDetailModal";
import UserActionModal from "@/components/admin/modals/UserActionModal";
import { AdminApi, AdminUser } from "@/lib/adminApi";

const AdminUsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState<"deactivate" | "role" | "reset" | "delete">("deactivate");

    const PAGE_SIZE = 10;

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const res = await AdminApi.getUsers({
            page: currentPage,
            size: PAGE_SIZE,
            search: searchTerm || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            role: roleFilter !== "all" ? roleFilter : undefined,
            plan: planFilter !== "all" ? planFilter : undefined,
        });
        if (res.data) {
            setUsers(res.data.content);
            setTotalPages(res.data.totalPages);
            setTotalElements(res.data.totalElements);
        }
        setLoading(false);
    }, [currentPage, searchTerm, statusFilter, roleFilter, planFilter]);

    useEffect(() => {
        const debounce = setTimeout(fetchUsers, 300);
        return () => clearTimeout(debounce);
    }, [fetchUsers]);

    const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
        setter(e.target.value);
        setCurrentPage(0);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    const handleViewUser = (user: AdminUser) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    const handleAction = (user: AdminUser, type: typeof actionType) => {
        setSelectedUser(user);
        setActionType(type);
        setShowActionModal(true);
    };

    const handleActionComplete = () => {
        setShowActionModal(false);
        fetchUsers();
    };

    const handleExport = async () => {
        const res = await AdminApi.exportUsers();
        if (res.status === 200 && res.data) {
            if (typeof res.data === "string" && res.data.startsWith("http")) {
                window.open(res.data, "_blank");
            }
        } else {
            // Fallback: download current page data as CSV
            const rows = users.map(u => ({
                fullName: u.fullName, email: u.email,
                status: u.status, role: u.role,
                plan: u.currentPlan ?? u.plan, invoiceCount: u.invoiceCount,
                createdAt: u.createdAt ?? u.registeredDate ?? ""
            }));
            const headers = Object.keys(rows[0]);
            const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${(r as any)[h] ?? ""}"`).join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a"); a.href = url; a.download = "users.csv"; a.click();
            URL.revokeObjectURL(url);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN": return "bg-purple-100 text-purple-700";
            case "ADMIN": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusColor = (status: string) =>
        status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

    const startIndex = currentPage * PAGE_SIZE;

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage platform users and permissions</p>
                </div>
                <button onClick={handleExport} className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                    <Download size={18} />
                    Export Users
                </button>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-3 sm:p-4 space-y-3">
                <div className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
                    <div className="flex-1 relative">
                        <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email or name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <button className="px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap text-sm">
                        <Filter size={18} />
                        <span className="hidden sm:inline">Filters</span>
                    </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    <select value={statusFilter} onChange={handleFilterChange(setStatusFilter)} className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-xs sm:text-sm">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select value={roleFilter} onChange={handleFilterChange(setRoleFilter)} className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-xs sm:text-sm">
                        <option value="all">All Roles</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                    <select value={planFilter} onChange={handleFilterChange(setPlanFilter)} className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-xs sm:text-sm col-span-2 sm:col-span-1">
                        <option value="all">All Plans</option>
                        <option value="FREE">Free</option>
                        <option value="ESSENTIALS">Essentials</option>
                        <option value="PREMIUM">Premium</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">User</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Plan</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Invoices</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Registered</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E7EC]">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={7} className="px-6 py-4">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">
                                        No users found
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-3 sm:px-6 py-4">
                                        <p className="font-medium text-gray-900 text-sm">{user.fullName}</p>
                                        <p className="text-xs text-gray-500">{user.email}</p>
                                    </td>
                                    <td className="hidden sm:table-cell px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>{user.status}</span>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>{user.role}</span>
                                    </td>
                                    <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-900">{user.plan}</td>
                                    <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-900">{user.invoiceCount}</td>
                                    <td className="hidden lg:table-cell px-6 py-4 text-xs text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : user.registeredDate ?? "—"}</td>
                                    <td className="px-3 sm:px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleViewUser(user)} className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                                                <Eye size={16} className="text-gray-600" />
                                            </button>
                                            <div className="relative group">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <ChevronDown size={16} className="text-gray-600" />
                                                </button>
                                                <div className="hidden group-hover:block absolute right-0 mt-1 w-44 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-10">
                                                    <button onClick={() => handleAction(user, "role")} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Change Role</button>
                                                    <button onClick={() => handleAction(user, "reset")} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">Reset Password</button>
                                                    <button onClick={() => handleAction(user, "deactivate")} className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50">
                                                        {["ACTIVE","VERIFIED"].includes(user.status?.toUpperCase()) ? "Deactivate" : "Activate"}
                                                    </button>
                                                    <button onClick={() => handleAction(user, "delete")} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-gray-50">Delete Account</button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-3 sm:px-6 py-4 border-t border-[#E4E7EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-gray-600">
                        Showing {totalElements === 0 ? 0 : startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, totalElements)} of {totalElements} users
                    </p>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="flex-1 sm:flex-none px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50 text-sm">Previous</button>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage >= totalPages - 1} className="flex-1 sm:flex-none px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50 text-sm">Next</button>
                    </div>
                </div>
            </div>

            {showDetailModal && selectedUser && (
                <UserDetailModal user={selectedUser} onClose={() => setShowDetailModal(false)} />
            )}
            {showActionModal && selectedUser && (
                <UserActionModal user={selectedUser} actionType={actionType} onClose={handleActionComplete} />
            )}
        </div>
    );
};

export default AdminUsersPage;
