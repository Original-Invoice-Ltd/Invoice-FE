"use client";

import { X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { AdminApi } from "@/lib/adminApi";

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

interface UserActionModalProps {
    user: User;
    actionType: "deactivate" | "role" | "reset" | "delete";
    onClose: () => void;
}

const UserActionModal = ({ user, actionType, onClose }: UserActionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user.role);
    const [confirmEmail, setConfirmEmail] = useState("");
    const [error, setError] = useState("");

    const handleConfirm = async () => {
        setError("");
        if (actionType === "delete" && confirmEmail !== user.email) {
            setError("Email does not match.");
            return;
        }
        setLoading(true);
        try {
            let res;
            switch (actionType) {
                case "deactivate": res = await AdminApi.toggleUserStatus(user.id); break;
                case "role":       res = await AdminApi.updateUserRole(user.id, selectedRole); break;
                case "reset":      res = await AdminApi.resetUserPassword(user.id); break;
                case "delete":     res = await AdminApi.deleteUser(user.id); break;
            }
            if (res?.error) setError(res.error);
            else onClose();
        } finally {
            setLoading(false);
        }
    };

    const configs = {
        deactivate: {
            title: user.status === "active" ? "Deactivate User" : "Activate User",
            description: user.status === "active"
                ? `Deactivating ${user.fullName} will remove their account access.`
                : `Activating ${user.fullName} will restore their account access.`,
            buttonText: user.status === "active" ? "Deactivate" : "Activate",
            isDangerous: user.status === "active",
        },
        role: {
            title: "Change User Role",
            description: `Update the role for ${user.fullName}.`,
            buttonText: "Update Role",
            isDangerous: false,
        },
        reset: {
            title: "Reset Password",
            description: `A password reset email will be sent to ${user.email}.`,
            buttonText: "Send Reset Email",
            isDangerous: false,
        },
        delete: {
            title: "Delete User Account",
            description: `This cannot be undone. All data for ${user.fullName} will be permanently deleted.`,
            buttonText: "Delete Account",
            isDangerous: true,
        },
    };

    const config = configs[actionType];

    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E4E7EC]">
                    <h2 className="text-lg font-bold text-gray-900">{config.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                </div>

                <div className="p-4 sm:p-6 space-y-4">
                    {config.isDangerous && (
                        <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">This action cannot be undone.</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <p className="text-sm text-gray-600">{config.description}</p>

                    {actionType === "role" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">New Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as typeof selectedRole)}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                        </div>
                    )}

                    {actionType === "delete" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Type <span className="font-mono text-red-600">{user.email}</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                                placeholder="Enter email to confirm"
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 sm:p-6 border-t border-[#E4E7EC] flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50 text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-white text-sm disabled:opacity-50 ${config.isDangerous ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {loading ? "Processing..." : config.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserActionModal;
