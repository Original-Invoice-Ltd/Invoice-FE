"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import TaxFormModal from "@/components/admin/modals/TaxFormModal";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import { AdminApi, TaxType, TaxRules } from "@/lib/adminApi";

const AdminTaxConfigPage = () => {
    const [taxTypes, setTaxTypes] = useState<TaxType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTax, setEditingTax] = useState<TaxType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingTaxId, setDeletingTaxId] = useState<string | null>(null);
    const [taxRules, setTaxRules] = useState<TaxRules>({
        defaultIndividualTaxId: "",
        defaultBusinessTaxId: "",
        calculationMethod: "exclusive",
    });
    const [savingRules, setSavingRules] = useState(false);
    const [rulesSaved, setRulesSaved] = useState(false);

    const fetchTaxTypes = async () => {
        setLoading(true);
        const [typesRes, rulesRes] = await Promise.all([
            AdminApi.getTaxTypes(),
            AdminApi.getTaxRules(),
        ]);
        if (typesRes.status === 200 && typesRes.data) setTaxTypes(typesRes.data);
        if (rulesRes.status === 200 && rulesRes.data) setTaxRules(rulesRes.data);
        setLoading(false);
    };

    useEffect(() => { fetchTaxTypes(); }, []);

    const handleSaveTax = async (tax: TaxType) => {
        if (editingTax) {
            const res = await AdminApi.updateTaxType(tax.id, tax);
            if (res.status === 200) await fetchTaxTypes();
        } else {
            const { id, ...data } = tax;
            const res = await AdminApi.createTaxType(data);
            if (res.status === 200 || res.status === 201) await fetchTaxTypes();
        }
        setShowModal(false);
    };

    const confirmDeleteTax = async () => {
        if (!deletingTaxId) return;
        const res = await AdminApi.deleteTaxType(deletingTaxId);
        if (res.status === 200 || res.status === 204) {
            setTaxTypes(taxTypes.filter(t => t.id !== deletingTaxId));
        }
        setDeletingTaxId(null);
        setShowDeleteModal(false);
    };

    const handleSaveRules = async () => {
        setSavingRules(true);
        const res = await AdminApi.updateTaxRules(taxRules);
        if (res.status === 200) {
            setRulesSaved(true);
            setTimeout(() => setRulesSaved(false), 3000);
        }
        setSavingRules(false);
    };

    return (
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Tax Configuration</h1>
                    <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage tax types and rates</p>
                </div>
                <button
                    onClick={() => { setEditingTax(null); setShowModal(true); }}
                    className="w-full sm:w-auto px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center justify-center gap-2 text-sm"
                >
                    <Plus size={20} />
                    Add Tax Type
                </button>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-[#E4E7EC]">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Name</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Category</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Base Rate</th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Individual</th>
                                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Business</th>
                                <th className="hidden sm:table-cell px-6 py-3 text-left text-sm font-semibold text-gray-900 whitespace-nowrap">Status</th>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E7EC]">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24" /></td>
                                        <td className="hidden sm:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20" /></td>
                                        <td className="hidden md:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></td>
                                        <td className="hidden md:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></td>
                                        <td className="hidden lg:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-12" /></td>
                                        <td className="hidden sm:table-cell px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></td>
                                        <td className="px-4 sm:px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16" /></td>
                                    </tr>
                                ))
                            ) : taxTypes.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 text-sm">No tax types configured</td>
                                </tr>
                            ) : (
                                taxTypes.map((tax) => (
                                    <tr key={tax.id} className="hover:bg-gray-50">
                                        <td className="px-4 sm:px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{tax.name}</p>
                                                <p className="text-xs text-gray-500">{tax.description}</p>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4">
                                            <span className="px-3 py-1 bg-[#E8F2FE] text-[#2F80ED] rounded-full text-xs font-semibold">{tax.category}</span>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-sm font-medium text-gray-900">{tax.baseRate}%</td>
                                        <td className="hidden md:table-cell px-6 py-4 text-sm font-medium text-gray-900">{tax.individualRate}%</td>
                                        <td className="hidden lg:table-cell px-6 py-4 text-sm font-medium text-gray-900">{tax.businessRate}%</td>
                                        <td className="hidden sm:table-cell px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tax.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                                {tax.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { setEditingTax(tax); setShowModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Edit2 size={18} className="text-gray-600" />
                                                </button>
                                                <button onClick={() => { setDeletingTaxId(tax.id); setShowDeleteModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg">
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
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Tax Rules</h2>
                {rulesSaved && (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-700 font-medium">Tax rules saved successfully</p>
                    </div>
                )}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Default Tax for Individual Customers</label>
                        <select
                            value={taxRules.defaultIndividualTaxId}
                            onChange={(e) => setTaxRules(prev => ({ ...prev, defaultIndividualTaxId: e.target.value }))}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm"
                        >
                            <option value="">Select a tax type</option>
                            {taxTypes.map(tax => <option key={tax.id} value={tax.id}>{tax.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Default Tax for Business Customers</label>
                        <select
                            value={taxRules.defaultBusinessTaxId}
                            onChange={(e) => setTaxRules(prev => ({ ...prev, defaultBusinessTaxId: e.target.value }))}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm"
                        >
                            <option value="">Select a tax type</option>
                            {taxTypes.map(tax => <option key={tax.id} value={tax.id}>{tax.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Tax Calculation Method</label>
                        <select
                            value={taxRules.calculationMethod}
                            onChange={(e) => setTaxRules(prev => ({ ...prev, calculationMethod: e.target.value as "inclusive" | "exclusive" }))}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm"
                        >
                            <option value="inclusive">Inclusive (Tax included in price)</option>
                            <option value="exclusive">Exclusive (Tax added to price)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSaveRules}
                    disabled={savingRules}
                    className="w-full sm:w-auto px-6 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] disabled:opacity-50 text-sm"
                >
                    {savingRules ? "Saving..." : "Save Tax Rules"}
                </button>
            </div>

            {showModal && (
                <TaxFormModal
                    tax={editingTax}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveTax}
                />
            )}

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => { setShowDeleteModal(false); setDeletingTaxId(null); }}
                onConfirm={confirmDeleteTax}
                title="Delete Tax Type"
                message="Are you sure you want to delete"
                itemName={taxTypes.find(t => t.id === deletingTaxId)?.name}
            />
        </div>
    );
};

export default AdminTaxConfigPage;
