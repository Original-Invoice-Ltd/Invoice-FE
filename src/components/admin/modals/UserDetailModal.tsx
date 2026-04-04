"use client";

import { X, Mail, Phone, Calendar, FileText } from "lucide-react";

interface User {
    id: string;
    email: string;
    fullName: string;
    status: string;
    role: string;
    plan: string;
    currentPlan?: string;
    invoiceCount: number;
    registeredDate?: string;
    createdAt?: string;
    lastLogin?: string;
    phone?: string;
}

interface UserDetailModalProps {
    user: User;
    onClose: () => void;
}

const UserDetailModal = ({ user, onClose }: UserDetailModalProps) => {
    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[98vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-[#E4E7EC] flex-shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">User Details</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto scrollbar-hide lg:scrollbar-default">
                    <style jsx>{`
                        .scrollbar-hide::-webkit-scrollbar {
                            display: none;
                        }
                        .scrollbar-hide {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }
                        @media (min-width: 1024px) {
                            .scrollbar-default::-webkit-scrollbar {
                                display: block;
                                width: 6px;
                            }
                            .scrollbar-default::-webkit-scrollbar-track {
                                background: #f1f1f1;
                                border-radius: 10px;
                            }
                            .scrollbar-default::-webkit-scrollbar-thumb {
                                background: #cbd5e0;
                                border-radius: 10px;
                            }
                            .scrollbar-default::-webkit-scrollbar-thumb:hover {
                                background: #a0aec0;
                            }
                            .scrollbar-default {
                                scrollbar-width: thin;
                                scrollbar-color: #cbd5e0 #f1f1f1;
                            }
                        }
                    `}</style>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-600">Full Name</label>
                                <p className="text-sm text-gray-900 font-medium mt-0.5">{user.fullName}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-600">Email</label>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                                    <p className="text-sm text-gray-900 font-medium truncate">{user.email}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-600">Status</label>
                                <p className={`text-xs font-medium mt-0.5 px-2 py-1 rounded-full w-fit ${["ACTIVE","VERIFIED"].includes(user.status?.toUpperCase()) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {user.status}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-600">Role</label>
                                <p className="text-sm text-gray-900 font-medium mt-0.5">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Subscription</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-gray-600">Plan</label>
                                <p className="text-sm text-gray-900 font-medium mt-0.5">{user.currentPlan ?? user.plan}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-600">Registered Date</label>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Calendar size={14} className="text-gray-400 flex-shrink-0" />
                                    <p className="text-sm text-gray-900 font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : user.registeredDate ?? "—"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Activity</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-[#F5F9FF] p-3 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-[#2F80ED] flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-600">Total Invoices</p>
                                        <p className="text-xl font-bold text-gray-900">{user.invoiceCount}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <p className="text-xs text-gray-600">Last Login</p>
                                <p className="text-base font-bold text-gray-900 mt-1">2 hours ago</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Recent Payments</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Premium Plan</p>
                                    <p className="text-xs text-gray-500">2024-03-01</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">$99.00</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-[#E4E7EC] flex gap-2 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Close
                    </button>
                    <button className="flex-1 px-4 py-2 text-sm bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] transition-colors">
                        Edit User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
