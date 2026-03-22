"use client";

import { Save, AlertCircle } from "lucide-react";
import { useState } from "react";

const AdminSystemConfigPage = () => {
    const [config, setConfig] = useState({
        freeMaxInvoices: 5,
        freeMaxLogos: 1,
        essentialsMaxInvoices: 100,
        essentialsMaxLogos: 5,
        premiumMaxInvoices: 999,
        premiumMaxLogos: 999,
        essentialPrice: 29,
        premiumPrice: 99,
        invoicePrefix: "INV",
        invoiceNumberFormat: "sequential",
        invoiceAutoIncrement: true,
        paystackApiKey: "",
        paystackSecretKey: "",
        paystackMode: "test",
        emailNotifications: true,
        smsNotifications: false,
        inAppNotifications: true,
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
                    ["freeMaxInvoices", "freeMaxLogos", "essentialsMaxInvoices", "essentialsMaxLogos", "premiumMaxInvoices", "premiumMaxLogos", "essentialPrice", "premiumPrice"].includes(name) ? parseInt(value) : value
        }));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">System Configuration</h1>
                    <p className="text-gray-600 mt-1">Platform-wide settings and business rules</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
                    Super Admin Only
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-semibold text-yellow-900">
                        Changes to system configuration affect all users
                    </p>
                    <p className="text-sm text-yellow-700">Please review carefully before saving</p>
                </div>
            </div>

            {saved && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
                    <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-green-700 font-medium">Configuration saved successfully</p>
                </div>
            )}

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription Plan Limits</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 border border-[#E4E7EC] rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-4">Free Plan</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Max Invoices</label>
                                <input type="number" name="freeMaxInvoices" value={config.freeMaxInvoices} onChange={handleChange} className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Max Logos</label>
                                <input type="number" name="freeMaxLogos" value={config.freeMaxLogos} onChange={handleChange} className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-[#E4E7EC] rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-4">Essentials Plan</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Max Invoices</label>
                                <input type="number" name="essentialsMaxInvoices" value={config.essentialsMaxInvoices} onChange={handleChange} className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Max Logos</label>
                                <input type="number" name="essentialsMaxLogos" value={config.essentialsMaxLogos} onChange={handleChange} className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border border-[#E4E7EC] rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-4">Premium Plan</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Max Invoices</label>
                                <input type="number" name="premiumMaxInvoices" value={config.premiumMaxInvoices} onChange={handleChange} className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Max Logos</label>
                                <input type="number" name="premiumMaxLogos" value={config.premiumMaxLogos} onChange={handleChange} className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Essentials Plan (Monthly)
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-900">$</span>
                            <input type="number" name="essentialPrice" value={config.essentialPrice} onChange={handleChange} className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Premium Plan (Monthly)
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-gray-900">$</span>
                            <input type="number" name="premiumPrice" value={config.premiumPrice} onChange={handleChange} className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Invoice Generation Rules</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Invoice Number Prefix
                        </label>
                        <input type="text" name="invoicePrefix" value={config.invoicePrefix} onChange={handleChange} placeholder="e.g., INV" className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Number Format
                        </label>
                        <select name="invoiceNumberFormat" value={config.invoiceNumberFormat} onChange={handleChange} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                            <option value="sequential">Sequential (INV-001, INV-002)</option>
                            <option value="date">Date-based (INV-20240315-001)</option>
                            <option value="random">Random (INV-A7K9M2)</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="invoiceAutoIncrement" checked={config.invoiceAutoIncrement} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" />
                        <label className="text-sm font-medium text-gray-900">
                            Auto-increment invoice numbers
                        </label>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Gateway (Paystack)</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Mode
                        </label>
                        <select name="paystackMode" value={config.paystackMode} onChange={handleChange} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                            <option value="test">Test Mode</option>
                            <option value="live">Live Mode</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Public API Key
                        </label>
                        <input type="password" name="paystackApiKey" value={config.paystackApiKey} onChange={handleChange} placeholder="pk_test_..." className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Secret API Key
                        </label>
                        <input type="password" name="paystackSecretKey" value={config.paystackSecretKey} onChange={handleChange} placeholder="sk_test_..." className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center gap-2"
                >
                    <Save size={20} />
                    Save Configuration
                </button>
            </div>
        </div>
    );
};

export default AdminSystemConfigPage;
