"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface TaxType {
    id: string;
    name: string;
    category: "WHT" | "VAT" | "SALES_TAX" | "EXCISE_TAX" | "CUSTOM";
    baseRate: number;
    individualRate: number;
    businessRate: number;
    isActive: boolean;
    description: string;
}

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
            category: "VAT",
            baseRate: 0,
            individualRate: 0,
            businessRate: 0,
            isActive: true,
            description: ""
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : 
                    ["baseRate", "individualRate", "businessRate"].includes(name) ? parseFloat(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC]">
                    <h2 className="text-xl font-bold text-gray-900">
                        {tax ? "Edit Tax Type" : "Add Tax Type"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Tax Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., VAT"
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Category *
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="WHT">WHT</option>
                            <option value="VAT">VAT</option>
                            <option value="SALES_TAX">Sales Tax</option>
                            <option value="EXCISE_TAX">Excise Tax</option>
                            <option value="CUSTOM">Custom</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tax description"
                            rows={3}
                            className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Base Rate (%)
                            </label>
                            <input
                                type="number"
                                name="baseRate"
                                value={formData.baseRate}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Individual (%)
                            </label>
                            <input
                                type="number"
                                name="individualRate"
                                value={formData.individualRate}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Business (%)
                            </label>
                            <input
                                type="number"
                                name="businessRate"
                                value={formData.businessRate}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <label className="text-sm font-medium text-gray-900">
                            Active
                        </label>
                    </div>

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
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                        >
                            {tax ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxFormModal;
