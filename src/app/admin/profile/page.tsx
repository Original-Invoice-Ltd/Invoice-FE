"use client";

import { useState } from "react";
import { Save, Lock, Mail, User, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminApi } from "@/lib/adminApi";

const AdminProfilePage = () => {
    const { user, refreshUser } = useAuth();

    const [fullName, setFullName] = useState(user?.fullName || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [profileSaved, setProfileSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [profileError, setProfileError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError("");
        setLoading(true);
        const payload = { fullName, phoneNumber: phone };
        console.log('[Profile] update payload:', payload);
        const res = await AdminApi.updateAdminProfile(payload);
        console.log('[Profile] update response:', res.status, res.data ?? res.error);
        if (res.status === 200) {
            await refreshUser();
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        } else {
            setProfileError(res.error || "Failed to update profile.");
        }
        setLoading(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (!passwords.currentPassword) return setPasswordError("Current password is required");
        if (!passwords.newPassword) return setPasswordError("New password is required");
        if (passwords.newPassword.length < 8) return setPasswordError("New password must be at least 8 characters");
        if (passwords.newPassword !== passwords.confirmPassword) return setPasswordError("Passwords do not match");

        setLoading(true);
        const pwPayload = { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword };
        console.log('[Profile] change password payload:', pwPayload);
        const res = await AdminApi.changeAdminPassword(pwPayload);
        console.log('[Profile] change password response:', res.status, res.data ?? res.error);
        if (res.status === 200) {
            setPasswordSaved(true);
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setTimeout(() => setPasswordSaved(false), 3000);
        } else {
            setPasswordError(res.error || "Failed to change password.");
        }
        setLoading(false);
    };

    const togglePassword = (field: "current" | "new" | "confirm") => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const role = user?.roles?.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "ADMIN";
    const createdAt = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—";

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your admin account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6 sticky top-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-[#2F80ED] to-blue-600 rounded-full flex items-center justify-center mb-4">
                                <span className="text-xl sm:text-2xl font-bold text-white">
                                    {(user?.fullName || "A").charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-gray-900">{user?.fullName}</h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">{user?.email}</p>
                            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{role}</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">active</span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-[#E4E7EC] space-y-3">
                            <div>
                                <p className="text-xs text-gray-600 uppercase font-semibold">Account Created</p>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1">{createdAt}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <form onSubmit={handleSaveProfile} className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Personal Information</h2>

                        {profileSaved && (
                            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-700 font-medium">Profile updated successfully</p>
                            </div>
                        )}
                        {profileError && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{profileError}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Full Name</label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input type="email" value={user?.email || ""} disabled className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg bg-gray-50 text-gray-500 text-sm" />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Role</label>
                                <input type="text" value={role} disabled className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg bg-gray-50 text-gray-600 text-sm" />
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6 flex justify-end">
                            <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </form>

                    <form onSubmit={handleChangePassword} className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                            <Lock size={20} />
                            Change Password
                        </h2>

                        {passwordError && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-700">{passwordError}</p>
                            </div>
                        )}
                        {passwordSaved && (
                            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                                <p className="text-sm text-green-700 font-medium">Password changed successfully</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {(["currentPassword", "newPassword", "confirmPassword"] as const).map((field) => {
                                const labels = { currentPassword: "Current Password", newPassword: "New Password", confirmPassword: "Confirm New Password" };
                                const showKey = field === "currentPassword" ? "current" : field === "newPassword" ? "new" : "confirm";
                                return (
                                    <div key={field}>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">{labels[field]}</label>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input
                                                type={showPasswords[showKey as keyof typeof showPasswords] ? "text" : "password"}
                                                value={passwords[field]}
                                                onChange={(e) => setPasswords(prev => ({ ...prev, [field]: e.target.value }))}
                                                className="w-full pl-10 pr-10 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm"
                                            />
                                            <button type="button" onClick={() => togglePassword(showKey as "current" | "new" | "confirm")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                                {showPasswords[showKey as keyof typeof showPasswords] ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {field === "newPassword" && <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters long</p>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 sm:mt-6 flex justify-end">
                            <button type="submit" disabled={loading} className="w-full sm:w-auto px-6 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
                                <Lock size={18} />
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;
