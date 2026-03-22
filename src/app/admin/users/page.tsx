"use client";

import { useState } from "react";
import { Search, Filter, Download, MoreVertical } from "lucide-react";
import UserDetailModal from "@/components/admin/modals/UserDetailModal";
import UserActionModal from "@/components/admin/modals/UserActionModal";

interface User {
    id: string;
    email: string;
    fullName: string;
    status: "active" | "inactive";
    role: "USER" | "ADMIN" | "SUPER_ADMIN";
    plan: "FREE" | "ESSENTIALS" | "PREMIUM";
    invoiceCount: number;
    registeredDate: string;
}

const AdminUsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [planFilter, setPlanFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionType, setActionType] = useState<"deactivate" | "role" | "reset" | "delete">("deactivate");

    const mockUsers: User[] = [
        { id: "1", email: "john@example.com", fullName: "John Doe", status: "active", role: "USER", plan: "PREMIUM", invoiceCount: 45, registeredDate: "2024-01-15" },
        { id: "2", email: "jane@example.com", fullName: "Jane Smith", status: "active", role: "USER", plan: "ESSENTIALS", invoiceCount: 12, registeredDate: "2024-02-20" },
        { id: "3", email: "admin@example.com", fullName: "Admin User", status: "active", role: "ADMIN", plan: "PREMIUM", invoiceCount: 0, registeredDate: "2023-12-01" },
    ];

    const itemsPerPage = 10;
    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) || user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesPlan = planFilter === "all" || user.plan === planFilter;
        return matchesSearch && matchesStatus && matchesRole && matchesPlan;
    });

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const getRoleColor = (role: string) => {
        switch (role) {
            case "SUPER_ADMIN": return "bg-purple-100 text-purple-700";
            case "ADMIN": return "bg-[#E8F2FE] text-[#2F80ED]";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusColor = (status: string) => {
        return status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
    };

    const handleViewUser = (user: User) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    const handleAction = (user: User, type: typeof actionType) => {
        setSelectedUser(user);
        setActionType(type);
        setShowActionModal(true);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-1">Manage platform users and permissions</p>
                </div>
                <button className="px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7]">
                    Export Users
                </button>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 space-y-4">
                <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="flex-1 relative">
                        <Search size={20} className=" absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by email, name, or ID..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                        />
                    </div>
                    <button className="px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2">
                        <Filter size={20} />
                        More Filters
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm">
                        <option value="all">All Roles</option>
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>

                    <select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setCurrentPage(1); }} className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm">
                        <option value="all">All Plans</option>
                        <option value="FREE">Free</option>
                        <option value="ESSENTIALS">Essentials</option>
                        <option value="PREMIUM">Premium</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                            <tr>
                                <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-700">User</th>
                                <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-700">Role</th>
                                <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-700">Plan</th>
                                <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-700">Invoices</th>
                                <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-700">Registered</th>
                                <th className="px-6 py-3 text-left text-[14px] font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E7EC]">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{user.fullName}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.plan}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.invoiceCount}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.registeredDate}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center">
                                            <div className="relative group">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <MoreVertical size={18} className="text-gray-600" />
                                                </button>
                                                <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-[9999]">
                                                    <button onClick={() => handleViewUser(user)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg">
                                                        View Details
                                                    </button>
                                                    <button onClick={() => handleAction(user, "role")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Change Role
                                                    </button>
                                                    <button onClick={() => handleAction(user, "reset")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        Reset Password
                                                    </button>
                                                    <button onClick={() => handleAction(user, "deactivate")} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                        {user.status === "active" ? "Deactivate" : "Activate"}
                                                    </button>
                                                    <button onClick={() => handleAction(user, "delete")} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg">
                                                        Delete Account
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-[#E4E7EC] flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50">
                            Previous
                        </button>
                        <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {showDetailModal && selectedUser && (
                <UserDetailModal user={selectedUser} onClose={() => setShowDetailModal(false)} />
            )}

            {showActionModal && selectedUser && (
                <UserActionModal user={selectedUser} actionType={actionType} onClose={() => setShowActionModal(false)} />
            )}
        </div>
    );
};

export default AdminUsersPage;
