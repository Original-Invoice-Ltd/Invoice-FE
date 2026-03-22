"use client";

import { useState } from "react";
import { Save, Lock, Mail, User, Eye, EyeOff, AlertCircle } from "lucide-react";

interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    status: string;
}

interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const AdminProfilePage = () => {
    const [profile, setProfile] = useState<ProfileData>({
        fullName: "Super Admin",
        email: "superadmin@example.com",
        phone: "+1 (555) 123-4567",
        role: "SUPER_ADMIN",
        status: "active",
    });

    const [passwords, setPasswords] = useState<PasswordData>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [profileSaved, setProfileSaved] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value,
        }));
        setPasswordError("");
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (!passwords.currentPassword) {
            setPasswordError("Current password is required");
            return;
        }

        if (!passwords.newPassword) {
            setPasswordError("New password is required");
            return;
        }

        if (passwords.newPassword.length < 8) {
            setPasswordError("New password must be at least 8 characters");
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setPasswordSaved(true);
            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setTimeout(() => setPasswordSaved(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your admin account settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-1">
                    <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6 sticky top-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                                <span className="text-xl sm:text-2xl font-bold text-white">
                                    {profile.fullName.charAt(0)}
                                </span>
                            </div>
                            <h2 className="text-base sm:text-lg font-bold text-gray-900">{profile.fullName}</h2>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 break-all">{profile.email}</p>
                            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                    {profile.role}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                    {profile.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#E4E7EC] space-y-3">
                            <div>
                                <p className="text-xs text-gray-600 uppercase font-semibold">
                                    Account Created
                                </p>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1">
                                    December 1, 2023
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 uppercase font-semibold">
                                    Last Login
                                </p>
                                <p className="text-xs sm:text-sm font-medium text-gray-900 mt-1">
                                    March 21, 2024 - 09:15 AM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <form onSubmit={handleSaveProfile} className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Personal Information</h2>

                        {profileSaved && (
                            <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm">✓</span>
                                </div>
                                <p className="text-green-700 font-medium text-sm sm:text-base">
                                    Profile updated successfully
                                </p>
                            </div>
                        )}

                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profile.fullName}
                                        onChange={handleProfileChange}
                                        className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        className="w-full pl-10 pr-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Email cannot be changed. Contact super admin if needed.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleProfileChange}
                                    className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                                        Role
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.role}
                                        disabled
                                        className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg bg-gray-50 text-gray-600 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                                        Status
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.status}
                                        disabled
                                        className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg bg-gray-50 text-gray-600 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
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
                            <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 font-medium text-sm sm:text-base">{passwordError}</p>
                            </div>
                        )}

                        {passwordSaved && (
                            <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                                <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-sm">✓</span>
                                </div>
                                <p className="text-green-700 font-medium text-sm sm:text-base">
                                    Password changed successfully
                                </p>
                            </div>
                        )}

                        <div className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type={showPasswords.current ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwords.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-10 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswords(prev => ({
                                                ...prev,
                                                current: !prev.current,
                                            }))
                                        }
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type={showPasswords.new ? "text" : "password"}
                                        name="newPassword"
                                        value={passwords.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-10 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswords(prev => ({
                                                ...prev,
                                                new: !prev.new,
                                            }))
                                        }
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type={showPasswords.confirm ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwords.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full pl-10 pr-10 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswords(prev => ({
                                                ...prev,
                                                confirm: !prev.confirm,
                                            }))
                                        }
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
                            >
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
