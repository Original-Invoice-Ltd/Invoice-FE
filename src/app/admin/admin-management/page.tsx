"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Edit2, Trash2, Clock, Download } from "lucide-react";
import AdminFormModal from "@/components/admin/modals/AdminFormModal";
import { AdminApi, AdminManagementUser, AuditLog } from "@/lib/adminApi";

const downloadCSV = (rows: any[], filename: string) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map(r => headers.map(h => `"${r[h] ?? ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
};

const AdminManagementPage = () => {
    const [admins, setAdmins] = useState<AdminManagementUser[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loadingAdmins, setLoadingAdmins] = useState(true);
    const [loadingAudit, setLoadingAudit] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [auditSearch, setAuditSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState<AdminManagementUser | null>(null);
    const [activeTab, setActiveTab] = useState<"admins" | "audit">("admins");

    const itemsPerPage = 10;

    const fetchAdmins = useCallback(async () => {
        setLoadingAdmins(true);
        const res = await AdminApi.getAdmins({
            search: searchTerm || undefined,
            role: roleFilter !== "all" ? roleFilter : undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
        });
        if (res.status === 200 && res.data) {
            const data = res.data as any;
            setAdmins(Array.isArray(data) ? data : data.content ?? data.data ?? []);
        }
        setLoadingAdmins(false);
    }, [searchTerm, roleFilter, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(fetchAdmins, searchTerm ? 400 : 0);
        return () => clearTimeout(timer);
    }, [fetchAdmins, searchTerm]);

    useEffect(() => {
        if (activeTab === "audit" && auditLogs.length === 0) {
            setLoadingAudit(true);
            AdminApi.getAuditLogs().then((res) => {
                if (res.status === 200 && res.data) {
                    const data = res.data as any;
                    setAuditLogs(Array.isArray(data) ? data : data.content ?? data.data ?? []);
                }
                setLoadingAudit(false);
            });
        }
    }, [activeTab, auditLogs.length]);

    const handleFormSubmit = async (data: Pick<AdminManagementUser, "id" | "email" | "fullName" | "role" | "status">) => {
        if (selectedAdmin) {
            const res = await AdminApi.updateAdmin(selectedAdmin.id, {
                fullName: data.fullName,
                role: data.role,
                status: data.status,
            });
            if (res.status === 200) await fetchAdmins();
        } else {
            const payload = {
                email: data.email,
                fullName: data.fullName,
                role: data.role,
                status: data.status,
            };
            console.log('[createAdmin] payload:', JSON.stringify(payload, null, 2));
            const res = await AdminApi.createAdmin(payload);
            console.log('[createAdmin] response:', res.status, res.data ?? res.error);
            if (res.status === 200 || res.status === 201) await fetchAdmins();
        }
        setShowFormModal(false);
    };

    const handleDeleteAdmin = async (id: string) => {
        if (!confirm("Are you sure you want to delete this admin?")) return;
        const res = await AdminApi.deleteAdmin(id);
        if (res.status === 200 || res.status === 204) {
            setAdmins(admins.filter(a => a.id !== id));
        }
    };

    const getRoleColor = (role: string) => role === "SUPER_ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700";
    const getStatusColor = (status: string) => {
        const s = status?.toUpperCase();
        if (s === "ACTIVE" || s === "VERIFIED") return "bg-green-100 text-green-700";
        if (s === "INACTIVE" || s === "SUSPENDED") return "bg-red-100 text-red-700";
        return "bg-yellow-100 text-yellow-700";
    };

    const totalPages = Math.ceil(admins.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAdmins = admins.slice(startIndex, startIndex + itemsPerPage);

    const filteredAuditLogs = auditLogs.filter(log =>
        !auditSearch || [log.admin, log.action, log.target, log.details].some(f => f?.toLowerCase().includes(auditSearch.toLowerCase()))
    );

    const handleDownloadAdmins = () => downloadCSV(admins, "admins.csv");
    const handleDownloadAudit = () => downloadCSV(filteredAuditLogs, "audit-logs.csv");

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Admin Management</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage admin users and view audit logs</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={handleDownloadAdmins}
                        className="flex-1 sm:flex-none px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
                    >
                        <Download size={18} />
                        Export
                    </button>
                    <button
                        onClick={() => { setSelectedAdmin(null); setShowFormModal(true); }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus size={20} />
                        Add Admin
                    </button>
                </div>
            </div>

            <div className="flex gap-2 sm:gap-4 border-b border-[#E4E7EC] overflow-x-auto">
                {(["admins", "audit"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 sm:px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap text-sm ${
                            activeTab === tab ? "border-[#2F80ED] text-[#2F80ED]" : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        {tab === "admins" ? "Admin Users" : "Audit Logs"}
                    </button>
                ))}
            </div>

            {activeTab === "admins" && (
                <>
                    <div className="bg-white border border-[#E4E7EC] rounded-xl p-3 sm:p-4 space-y-3">
                        <div className="relative">
                            <Search size={20} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by email or name..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-xs sm:text-sm">
                                <option value="all">All Roles</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2 border border-[#E4E7EC] rounded-lg text-xs sm:text-sm">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                                    <tr>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Admin</th>
                                        <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                                        <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Login</th>
                                        <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Created</th>
                                        <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E4E7EC]">
                                    {loadingAdmins ? (
                                        Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i}>
                                                <td className="px-3 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></td>
                                                <td className="hidden sm:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                                                <td className="hidden md:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></td>
                                                <td className="hidden lg:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>
                                                <td className="hidden lg:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                                                <td className="px-3 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></td>
                                            </tr>
                                        ))
                                    ) : paginatedAdmins.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 text-sm">No admins found</td>
                                        </tr>
                                    ) : (
                                        paginatedAdmins.map((admin) => (
                                            <tr key={admin.id} className="hover:bg-gray-50">
                                                <td className="px-3 sm:px-6 py-4">
                                                    <p className="font-medium text-gray-900 text-sm">{admin.fullName}</p>
                                                    <p className="text-xs text-gray-500">{admin.email}</p>
                                                </td>
                                                <td className="hidden sm:table-cell px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(admin.role)}`}>{admin.role}</span>
                                                </td>
                                                <td className="hidden md:table-cell px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(admin.status)}`}>{admin.status}</span>
                                                </td>
                                                <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-600">{admin.lastLogin ?? "—"}</td>
                                                <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-600">{admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : admin.createdDate ?? "—"}</td>
                                                <td className="px-3 sm:px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => { setSelectedAdmin(admin); setShowFormModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg">
                                                            <Edit2 size={18} className="text-gray-600" />
                                                        </button>
                                                        <button onClick={() => handleDeleteAdmin(admin.id)} className="p-2 hover:bg-gray-100 rounded-lg">
                                                            <Trash2 size={18} className="text-red-600" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-3 sm:px-6 py-4 border-t border-[#E4E7EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <p className="text-xs sm:text-sm text-gray-600">
                                Showing {admins.length === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, admins.length)} of {admins.length} admins
                            </p>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="flex-1 sm:flex-none px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50 text-sm">Previous</button>
                                <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages || totalPages === 0} className="flex-1 sm:flex-none px-4 py-2 border border-[#E4E7EC] rounded-lg disabled:opacity-50 text-sm">Next</button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeTab === "audit" && (
                <>
                    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                        <div className="relative flex-1 w-full sm:max-w-sm">
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search audit logs..."
                                value={auditSearch}
                                onChange={(e) => setAuditSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm"
                            />
                        </div>
                        <button onClick={handleDownloadAudit} className="w-full sm:w-auto px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 text-sm">
                            <Download size={18} />
                            Download CSV
                        </button>
                    </div>
                <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                                <tr>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Admin</th>
                                    <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                                    <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Target</th>
                                    <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900">Details</th>
                                    <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E4E7EC]">
                                {loadingAudit ? (
                                    Array.from({ length: 3 }).map((_, i) => (
                                        <tr key={i}>
                                            <td className="px-3 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>
                                            <td className="hidden sm:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-32" /></td>
                                            <td className="hidden md:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-28" /></td>
                                            <td className="hidden lg:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-40" /></td>
                                            <td className="px-3 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                                        </tr>
                                    ))
                                ) : auditLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm">No audit logs found</td>
                                    </tr>
                                ) : (
                                    filteredAuditLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-4">
                                                <p className="font-medium text-gray-900 text-sm">{log.admin}</p>
                                            </td>
                                            <td className="hidden sm:table-cell px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{log.action}</span>
                                            </td>
                                            <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">{log.target}</td>
                                            <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-600">{log.details}</td>
                                            <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    <span className="hidden sm:inline">{log.timestamp}</span>
                                                    <span className="sm:hidden">{log.timestamp?.split(" ")[0]}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                </>
            )}

            {showFormModal && (
                <AdminFormModal
                    admin={selectedAdmin || undefined}
                    onClose={() => setShowFormModal(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default AdminManagementPage;
