"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import TaxFormModal from "@/components/admin/modals/TaxFormModal";

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

const AdminTaxConfigPage = () => {
    const [taxTypes, setTaxTypes] = useState<TaxType[]>([
        { id: "1", name: "VAT", category: "VAT", baseRate: 7.5, individualRate: 7.5, businessRate: 7.5, isActive: true, description: "Value Added Tax" },
        { id: "2", name: "Sales Tax", category: "SALES_TAX", baseRate: 5, individualRate: 5, businessRate: 3, isActive: true, description: "Sales Tax" },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingTax, setEditingTax] = useState<TaxType | null>(null);
    const [defaultTaxes, setDefaultTaxes] = useState<string[]>(["1"]);

    const handleAddTax = () => {
        setEditingTax(null);
        setShowModal(true);
    };

    const handleEditTax = (tax: TaxType) => {
        setEditingTax(tax);
        setShowModal(true);
    };

    const handleDeleteTax = (id: string) => {
        if (confirm("Are you sure you want to delete this tax type?")) {
            setTaxTypes(taxTypes.filter(t => t.id !== id));
        }
    };

    const handleSaveTax = (tax: TaxType) => {
        if (editingTax) {
            setTaxTypes(taxTypes.map(t => t.id === tax.id ? tax : t));
        } else {
            setTaxTypes([...taxTypes, { ...tax, id: Date.now().toString() }]);
        }
        setShowModal(false);
    };

    const toggleDefault = (id: string) => {
        setDefaultTaxes(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tax Configuration</h1>
                    <p className="text-gray-600 mt-1">Manage tax types and rates</p>
                </div>
                <button
                    onClick={handleAddTax}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
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
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Base Rate</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Individual</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Business</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Default</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E7EC]">
                            {taxTypes.map((tax) => (
                                <tr key={tax.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{tax.name}</p>
                                            <p className="text-sm text-gray-500">{tax.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            {tax.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tax.baseRate}%</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tax.individualRate}%</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{tax.businessRate}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            tax.isActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}>
                                            {tax.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={defaultTaxes.includes(tax.id)}
                                            onChange={() => toggleDefault(tax.id)}
                                            className="w-4 h-4 rounded border-gray-300"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditTax(tax)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Edit2 size={18} className="text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTax(tax.id)}
                                                className="p-2 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Trash2 size={18} className="text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white border border-[#E4E7EC] rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tax Rules</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Default Tax for Individual Customers
                        </label>
                        <select className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Select a tax type</option>
                            {taxTypes.map(tax => (
                                <option key={tax.id} value={tax.id}>{tax.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Default Tax for Business Customers
                        </label>
                        <select className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Select a tax type</option>
                            {taxTypes.map(tax => (
                                <option key={tax.id} value={tax.id}>{tax.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Tax Calculation Method
                        </label>
                        <select className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="inclusive">Inclusive (Tax included in price)</option>
                            <option value="exclusive">Exclusive (Tax added to price)</option>
                        </select>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                        Save Tax Rules
                    </button>
                </div>
            </div>

            {showModal && (
                <TaxFormModal
                    tax={editingTax}
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveTax}
                />
            )}
        </div>
    );
};

export default AdminTaxConfigPage;
