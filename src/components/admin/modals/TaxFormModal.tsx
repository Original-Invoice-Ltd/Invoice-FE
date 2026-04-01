"use client";

import { X } from "lucide-react";
import { useState } from "react";
import type { TaxType } from "@/lib/adminApi";

interface TaxFormModalProps {
    tax: TaxType | null;
    onClose: () => void;
    onSave: (tax: TaxType) => void;
}

const TaxFormModal = ({ tax, onClose, onSave }: TaxFormModalProps) => {
    const [formData, setFormData] = useState<TaxType>(
        tax || {
            id: "",
            name: "",
            taxType: "VAT",
            individualRate: 0,
            businessRate: 0,
            active: true,
            description: ""
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked :
                    ["individualRate", "businessRate"].includes(name) ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[98vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC] flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">{tax ? "Edit Tax Type" : "Add Tax Type"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-6 space-y-4 overflow-y-auto flex-1">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Tax Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                placeholder="e.g., VAT" required
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Tax Type *</label>
                            <select name="taxType" value={formData.taxType} onChange={handleChange}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]">
                                <option value="WHT">WHT</option>
                                <option value="VAT">VAT</option>
                                <option value="CONSUMPTION_TAX">Consumption Tax</option>
                                <option value="EXCISE_TAX">Excise Tax</option>
                                <option value="CUSTOM">Custom</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange}
                                placeholder="Tax description" rows={3}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Individual Rate (%)</label>
                                <input type="number" name="individualRate" value={formData.individualRate}
                                    onChange={handleChange} step="0.01" required
                                    className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">Business Rate (%)</label>
                                <input type="number" name="businessRate" value={formData.businessRate}
                                    onChange={handleChange} step="0.01" required
                                    className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" name="active" checked={formData.active ?? formData.isActive ?? true}
                                onChange={handleChange} className="w-4 h-4 rounded border-gray-300" />
                            <label className="text-sm font-medium text-gray-900">Active</label>
                        </div>
                    </div>

                    <div className="flex gap-3 p-6 border-t border-[#E4E7EC] flex-shrink-0">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50">
                            Cancel
                        </button>
                        <button type="submit"
                            className="flex-1 px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7]">
                            {tax ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxFormModal;
