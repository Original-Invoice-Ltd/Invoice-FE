"use client";

import { X, Mail, Phone, Calendar, FileText } from "lucide-react";

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

interface UserDetailModalProps {
    user: User;
    onClose: () => void;
}

const UserDetailModal = ({ user, onClose }: UserDetailModalProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC]">
                    <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Full Name</label>
                                <p className="text-gray-900 font-medium mt-1">{user.fullName}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Email</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Mail size={18} className="text-gray-400" />
                                    <p className="text-gray-900 font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Status</label>
                                <p className={`text-gray-900 font-medium mt-1 px-3 py-1 rounded-full text-sm w-fit ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {user.status}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Role</label>
                                <p className="text-gray-900 font-medium mt-1">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Plan</label>
                                <p className="text-gray-900 font-medium mt-1">{user.plan}</p>
                            </div>
                            <div>
                                <label className="text-sm text-gray-600">Registered Date</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Calendar size={18} className="text-gray-400" />
                                    <p className="text-gray-900 font-medium">{user.registeredDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FileText size={20} className="text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Invoices</p>
                                        <p className="text-2xl font-bold text-gray-900">{user.invoiceCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">Last Login</p>
                                <p className="text-lg font-bold text-gray-900 mt-1">2 hours ago</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">Premium Plan</p>
                                    <p className="text-sm text-gray-500">2024-03-01</p>
                                </div>
                                <p className="font-semibold text-gray-900">$99.00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-[#E4E7EC] flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50">
                        Close
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                        Edit User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
