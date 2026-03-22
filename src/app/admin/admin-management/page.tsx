"use client";

import { useState } from "react";
import { Search, Plus, Eye, Edit2, Trash2, ChevronDown, Clock } from "lucide-react";
import AdminFormModal from "@/components/admin/modals/AdminFormModal";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";

interface Admin {
    id: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "SUPER_ADMIN";
    status: "active" | "inactive";
    lastLogin: string;
    createdDate: string;
}

interface AuditLog {
    id: string;
    admin: string;
    action: string;
    target: string;
    timestamp: string;
    details: string;
}

const AdminManagementPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
    const [activeTab, setActiveTab] = useState<"admins" | "audit">("admins");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);
    const [admins, setAdmins] = useState<Admin[]>([
        {
            id: "1",
            email: "admin@example.com",
            fullName: "Admin User",
            role: "ADMIN",
            status: "active",
            lastLogin: "2024-03-20 14:30",
            createdDate: "2023-12-01",
        },
        {
            id: "2",
            email: "superadmin@example.com",
            fullName: "Super Admin",
            role: "SUPER_ADMIN",
            status: "active",
            lastLogin: "2024-03-21 09:15",
            createdDate: "2023-11-15",
        },
        {
            id: "3",
            email: "manager@example.com",
            fullName: "Manager Admin",
            role: "ADMIN",
            status: "inactive",
            lastLogin: "2024-02-28 16:45",
            createdDate: "2024-01-10",
        },
    ]);

    const mockAuditLogs: AuditLog[] = [
        {
            id: "1",
            admin: "Super Admin",
            action: "User Deactivated",
            target: "john@example.com",
            timestamp: "2024-03-21 10:30",
            details: "User account deactivated due to inactivity",
        },
        {
            id: "2",
            admin: "Admin User",
            action: "Tax Configuration Updated",
            target: "Tax Rate - VAT",
            timestamp: "2024-03-21 09:15",
            details: "VAT rate updated from 15% to 16%",
        },
        {
            id: "3",
            admin: "Super Admin",
            action: "Admin Added",
            target: "manager@example.com",
            timestamp: "2024-03-20 14:00",
            details: "New admin user created with ADMIN role",
        },
        {
            id: "4",
            admin: "Admin User",
            action: "Subscription Upgraded",
            target: "jane@example.com",
            timestamp: "2024-03-20 11:20",
            details: "User upgraded from ESSENTIALS to PREMIUM plan",
        },
        {
            id: "5",
            admin: "Super Admin",
            action: "System Configuration Changed",
            target: "Invoice Settings",
            timestamp: "2024-03-19 16:45",
            details: "Invoice prefix changed from INV to INVOICE",
        },
    ];

    const itemsPerPage = 10;
    const filteredAdmins = admins.filter(admin => {
        const matchesSearch = admin.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            admin.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || admin.role === roleFilter;
        const matchesStatus = statusFilter === "all" || admin.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAdmins = filteredAdmins.slice(startIndex, startIndex + itemsPerPage);

    const getRoleColor = (role: string) => {
        return role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" : "bg-[#E8F2FE] text-[#2F80ED]";
    };

    const getStatusColor = (status: string) => {
        return status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
    };

    const handleAddAdmin = () => {
        setSelectedAdmin(null);
        setShowFormModal(true);
    };

    const handleEditAdmin = (admin: Admin) => {
        setSelectedAdmin(admin);
        setShowFormModal(true);
    };

    const handleFormSubmit = (data: Admin) => {
        console.log("Admin form submitted:", data);
    };

    const handleDeleteAdmin = (id: string) => {
        setDeletingAdminId(id);
        setShowDeleteModal(true);
    };

    const confirmDeleteAdmin = () => {
        if (deletingAdminId) {
            setAdmins(admins.filter(a => a.id !== deletingAdminId));
            setDeletingAdminId(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Admin Management</h1>
                    <p className="text-gray-600 mt-1">Manage admin users and view audit logs</p>
                </div>
                <button
                    onClick={handleAddAdmin}
                    className="px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Admin
                </button>
            </div>

            <div className="flex gap-4 border-b border-[#E4E7EC]">
                <button
                    onClick={() => setActiveTab("admins")}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                        activeTab === "admins"
                            ? "border-[#2F80ED] text-[#2F80ED]"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Admin Users
                </button>
                <button
                    onClick={() => setActiveTab("audit")}
                    className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                        activeTab === "audit"
                            ? "border-[#2F80ED] text-[#2F80ED]"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                >
                    Audit Logs
                </button>
            </div>

            {activeTab === "admins" && (
                <>
                    <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 space-y-4">
                        <div className="flex gap-4 flex-col sm:flex-row">
                            <div className="flex-1 relative">
                                <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email or name..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            >
                                <option value="all">All Roles</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Admin
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Last Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E4E7EC]">
                                    {paginatedAdmins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {admin.fullName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{admin.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(
                                                        admin.role
                                                    )}`}
                                                >
                                                    {admin.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                        admin.status
                                                    )}`}
                                                >
                                                    {admin.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {admin.lastLogin}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {admin.createdDate}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditAdmin(admin)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                        title="Edit admin"
                                                    >
                                                        <Edit2 size={18} className="text-gray-600" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                                        title="Delete admin"
                                                    >
                                                        <Trash2 size={18} className="text-red-600" />
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
                                Showing {startIndex + 1} to{" "}
                                {Math.min(startIndex + itemsPerPage, filteredAdmins.length)} of{" "}
                                {filteredAdmins.length} admins
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
                                    onClick={() =>
                                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === "audit" && (
                <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Admin
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Action
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Target
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Timestamp
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {mockAuditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{log.admin}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-3 py-1 bg-[#E8F2FE] text-[#2F80ED] rounded-full text-xs font-semibold`}
                                            >
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {log.target}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {log.details}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} />
                                                {log.timestamp}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showFormModal && (
                <AdminFormModal
                    admin={selectedAdmin || undefined}
                    onClose={() => setShowFormModal(false)}
                    onSubmit={handleFormSubmit}
                />
            )}

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeletingAdminId(null);
                }}
                onConfirm={confirmDeleteAdmin}
                title="Delete Admin"
                message="Are you sure you want to delete admin"
                itemName={admins.find(a => a.id === deletingAdminId)?.fullName}
            />
        </div>
    );
};

export default AdminManagementPage;
