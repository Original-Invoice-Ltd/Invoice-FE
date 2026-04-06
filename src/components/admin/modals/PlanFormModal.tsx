"use client";

import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface Plan {
    id?: string;
    name: string;
    description: string;
    maxInvoices: number;
    maxLogos: number;
    monthlyPrice: number;
    annualPrice: number;
    features: string[];
    isActive: boolean;
    active?: boolean;
}

interface PlanFormModalProps {
    plan: Plan | null;
    onClose: () => void;
    onSave: (plan: Plan) => void;
}

const PlanFormModal = ({ plan, onClose, onSave }: PlanFormModalProps) => {
    const [form, setForm] = useState<Plan>(() => {
        if (!plan) return {
            name: "", description: "", maxInvoices: 0, maxLogos: 1,
            monthlyPrice: 0, annualPrice: 0, features: [], isActive: true,
        };
        const p = plan as any;
        return {
            ...plan,
            features: Array.isArray(plan.features) ? plan.features : [],
            isActive: p.isActive ?? p.active ?? true,
        };
    });
    const [newFeature, setNewFeature] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked :
                ["maxInvoices", "maxLogos", "monthlyPrice", "annualPrice"].includes(name) ? Number(value) : value
        }));
    };

    const addFeature = () => {
        if (!newFeature.trim()) return;
        setForm(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
        setNewFeature("");
    };

    const removeFeature = (i: number) => {
        setForm(prev => ({ ...prev, features: prev.features.filter((_, idx) => idx !== i) }));
    };

    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[95vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC]">
                    <h2 className="text-lg font-bold text-gray-900">{plan ? "Edit Plan" : "Add New Plan"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-900 mb-1">Plan Name *</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Essentials"
                                className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" required />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                                placeholder="Short plan description"
                                className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Max Invoices</label>
                            <input type="number" name="maxInvoices" value={form.maxInvoices} onChange={handleChange} min={0}
                                className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Max Logos</label>
                            <input type="number" name="maxLogos" value={form.maxLogos} onChange={handleChange} min={0}
                                className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Monthly Price (₦)</label>
                            <input type="number" name="monthlyPrice" value={form.monthlyPrice} onChange={handleChange} min={0}
                                className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">Annual Price (₦)</label>
                            <input type="number" name="annualPrice" value={form.annualPrice} onChange={handleChange} min={0}
                                className="w-full px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Features</label>
                        <div className="space-y-2 mb-2">
                            {form.features.map((f, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                    <span className="flex-1 text-sm text-gray-700">{f}</span>
                                    <button onClick={() => removeFeature(i)} className="text-red-500 hover:text-red-700">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={newFeature} onChange={e => setNewFeature(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                placeholder="Add a feature..."
                                className="flex-1 px-3 py-2 border border-[#E4E7EC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]" />
                            <button onClick={addFeature} className="px-3 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2868C7]">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="isActive" checked={form.isActive}
                            onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                            className="w-4 h-4 rounded border-gray-300 accent-[#2F80ED]" />
                        <label className="text-sm font-medium text-gray-900">Active</label>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-[#E4E7EC]">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50 text-sm">Cancel</button>
                    <button onClick={() => onSave(form)} className="flex-1 px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] text-sm">
                        {plan ? "Update Plan" : "Create Plan"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanFormModal;
