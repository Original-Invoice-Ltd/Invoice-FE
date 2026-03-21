"use client";

import { X, Mail, Lock, User } from "lucide-react";
import { useState } from "react";

interface Admin {
    id?: string;
    email: string;
    fullName: string;
    role: "ADMIN" | "SUPER_ADMIN";
    status: "active" | "inactive";
}

interface AdminFormModalProps {
    admin?: Admin;
    onClose: () => void;
    onSubmit: (data: Admin) => void;
}

const AdminFormModal = ({ admin, onClose, onSubmit }: AdminFormModalProps) => {
    const [formData, setFormData] = useState<Admin>(
        admin || {
            email: "",
            fullName: "",
            role: "ADMIN",
            status: "active",
        }
    );
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.fullName) {
            newErrors.fullName = "Full name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            onSubmit(formData);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
                <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC]">
                    <h2 className="text-xl font-bold text-gray-900">
                        {admin ? "Edit Admin" : "Add New Admin"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.fullName
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#E4E7EC] focus:ring-blue-500"
                                }`}
                            />
                        </div>
                        {errors.fullName && (
                            <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.email
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-[#E4E7EC] focus:ring-blue-500"
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Role
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {!admin && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-sm text-blue-700">
                                A temporary password will be sent to the email address provided.
                            </p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : admin ? "Update Admin" : "Add Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminFormModal;
