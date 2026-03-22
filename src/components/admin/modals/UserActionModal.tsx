"use client";

import { X, AlertCircle } from "lucide-react";
import { useState } from "react";

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

    const handleConfirm = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onClose();
        }, 1000);
    };

    const getActionContent = () => {
        switch (actionType) {
            case "deactivate":
                return {
                    title: user.status === "active" ? "Deactivate User" : "Activate User",
                    description: user.status === "active"
                        ? `Are you sure you want to deactivate ${user.fullName}? They will not be able to access their account.`
                        : `Are you sure you want to activate ${user.fullName}? They will regain access to their account.`,
                    buttonText: user.status === "active" ? "Deactivate" : "Activate",
                    isDangerous: user.status === "active"
                };
            case "role":
                return {
                    title: "Change User Role",
                    description: `Update the role for ${user.fullName}`,
                    buttonText: "Update Role",
                    isDangerous: false,
                    showRoleSelect: true
                };
            case "reset":
                return {
                    title: "Reset Password",
                    description: `Send a password reset email to ${user.email}. They will receive a link to set a new password.`,
                    buttonText: "Send Reset Email",
                    isDangerous: false
                };
            case "delete":
                return {
                    title: "Delete User Account",
                    description: `This action cannot be undone. All data associated with ${user.fullName} will be permanently deleted.`,
                    buttonText: "Delete Account",
                    isDangerous: true,
                    requiresConfirmation: true
                };
            default:
                return {};
        }
    };

    const content = getActionContent() as any;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[98vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC] flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {content.isDangerous && (
                        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">This action cannot be undone.</p>
                        </div>
                    )}

                    <p className="text-gray-600">{content.description}</p>

                    {content.showRoleSelect && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                New Role
                            </label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value as any)}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            >
                                <option value="USER">User</option>
                                <option value="ADMIN">Admin</option>
                                <option value="SUPER_ADMIN">Super Admin</option>
                            </select>
                        </div>
                    )}

                    {content.requiresConfirmation && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Type "{user.email}" to confirm
                            </label>
                            <input
                                type="text"
                                placeholder="Confirm email"
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#E4E7EC] flex gap-3 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${
                            content.isDangerous
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-[#2F80ED] hover:bg-[#2868C7]"
                        } disabled:opacity-50`}
                    >
                        {loading ? "Processing..." : content.buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserActionModal;
