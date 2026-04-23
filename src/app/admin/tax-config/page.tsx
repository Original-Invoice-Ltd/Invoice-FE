"use client";

import { useState, useEffect } from "react";
import { Plus, MoreVertical } from "lucide-react";
import TaxFormModal from "@/components/admin/modals/TaxFormModal";
import DeleteConfirmModal from "@/components/admin/modals/DeleteConfirmModal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { AdminApi, TaxType } from "@/lib/adminApi";

const AdminTaxConfigPage = () => {
    const [taxTypes, setTaxTypes] = useState<TaxType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTax, setEditingTax] = useState<TaxType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingTaxId, setDeletingTaxId] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

    const handleOpenDropdown = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setDropdownPos({ top: rect.bottom + window.scrollY, right: window.innerWidth - rect.right });
        setOpenDropdown(prev => prev === id ? null : id);
    };
    const { toast, showSuccess, showError, hideToast } = useToast();

    const fetchTaxTypes = async () => {
        setLoading(true);
        const typesRes = await AdminApi.getTaxTypes();
        if (typesRes.status === 200 && typesRes.data) {
            console.log('[TaxConfig] fetched tax types:', typesRes.data);
            setTaxTypes(typesRes.data);
        }
        setLoading(false);
    };

    useEffect(() => { fetchTaxTypes(); }, []);

    const handleSaveTax = async (tax: TaxType) => {
        if (editingTax) {
            const res = await AdminApi.updateTaxType(tax.id, tax);
            if (res.status === 200) { await fetchTaxTypes(); showSuccess("Tax type updated successfully"); }
            else showError(res.error || "Failed to update tax type");
        } else {
            const { id, ...data } = tax;
            const res = await AdminApi.createTaxType(data);
            if (res.status === 200 || res.status === 201) { await fetchTaxTypes(); showSuccess("Tax type created successfully"); }
            else showError(res.error || "Failed to create tax type");
        }
        setShowModal(false);
    };

    const confirmDeleteTax = async () => {
        if (!deletingTaxId) return;
        const res = await AdminApi.deleteTaxType(deletingTaxId);
        if (res.status === 200 || res.status === 204) {
            setTaxTypes(taxTypes.filter(t => t.id !== deletingTaxId));
            showSuccess("Tax type deleted");
        } else {
            showError(res.error || "Failed to delete tax type");
        }
        setDeletingTaxId(null);
        setShowDeleteModal(false);
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
                                                <p className="font-medium text-gray-900 text-sm">{tax.name || "—"}</p>
                                                <p className="text-xs text-gray-500">{tax.description || "—"}</p>
                                            </div>
                                        </td>
                                        <td className="hidden sm:table-cell px-6 py-4">
                                            <span className="px-3 py-1 bg-[#E8F2FE] text-[#2F80ED] rounded-full text-xs font-semibold">{tax.taxType || "—"}</span>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-sm font-medium text-gray-900">{tax.individualRate != null ? `${tax.individualRate}%` : "—"}</td>
                                        <td className="hidden lg:table-cell px-6 py-4 text-sm font-medium text-gray-900">{tax.businessRate != null ? `${tax.businessRate}%` : "—"}</td>
                                        <td className="hidden sm:table-cell px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(tax.active ?? tax.isActive) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                                                {(tax.active ?? tax.isActive) ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-4">
                                            <button
                                                onClick={(e) => handleOpenDropdown(tax.id, e)}
                                                className="p-2 hover:bg-[#EBF5FF] rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={18} className="text-[#2F80ED]" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
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

            <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />

            {/* Fixed dropdown portal */}
            {openDropdown && (() => {
                const tax = taxTypes.find(t => t.id === openDropdown);
                if (!tax) return null;
                return (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                        <div
                            className="fixed z-50 w-48 bg-white border border-[#E4E7EC] rounded-xl shadow-xl overflow-hidden"
                            style={{ top: dropdownPos.top, right: dropdownPos.right }}
                        >
                            <button onClick={() => { setEditingTax(tax); setShowModal(true); setOpenDropdown(null); }} className="w-full text-left px-4 py-2.5 text-xs text-[#2F80ED] font-medium hover:bg-[#EBF5FF]">Edit Tax</button>
                            <div className="border-t border-[#E4E7EC]" />
                            <button
                                onClick={async () => {
                                    const isActive = tax.active ?? tax.isActive ?? false;
                                    const action = isActive ? "disable" : "enable";
                                    console.log(`[TaxConfig] ${action} tax:`, { id: tax.id, name: tax.name, active: tax.active, isActive: tax.isActive });
                                    const res = isActive ? await AdminApi.disableTaxType(tax.id) : await AdminApi.enableTaxType(tax.id);
                                    console.log(`[TaxConfig] ${action} response:`, res.status, res.data ?? res.error);
                                    if (res.status === 200) { await fetchTaxTypes(); showSuccess(`Tax type ${isActive ? "disabled" : "enabled"}`); }
                                    else showError(res.error || "Action failed — backend error");
                                    setOpenDropdown(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50"
                            >
                                {(tax.active ?? tax.isActive) ? "Disable" : "Enable"}
                            </button>
                            <div className="border-t border-[#E4E7EC]" />
                            <button onClick={() => { setDeletingTaxId(tax.id); setShowDeleteModal(true); setOpenDropdown(null); }} className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                    </>
                );
            })()}
        </div>
    );
};

export default AdminTaxConfigPage;
