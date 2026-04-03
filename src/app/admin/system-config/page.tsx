"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import PlanFormModal, { Plan } from "@/components/admin/modals/PlanFormModal";
import Toast from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { AdminApi } from "@/lib/adminApi";

const naira = "\u20A6";

const AdminSystemConfigPage = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const { toast, showSuccess, showError, hideToast } = useToast();

    const fetchPlans = async () => {
        setLoading(true);
        const res = await AdminApi.getSystemConfig();
        if (res.status === 200 && res.data) {
            // Map system config to plans array if backend returns flat config
            const d = res.data as any;
            if (Array.isArray(d)) {
                setPlans(d);
            } else if (d.plans) {
                setPlans(d.plans);
            } else {
                // Build from flat config fields
                setPlans([
                    { id: "free", name: "Free", description: "Basic plan", maxInvoices: d.freeMaxInvoices ?? 5, maxLogos: d.freeMaxLogos ?? 1, monthlyPrice: 0, annualPrice: 0, features: [], isActive: true },
                    { id: "essentials", name: "Essentials", description: "For growing businesses", maxInvoices: d.essentialsMaxInvoices ?? 100, maxLogos: d.essentialsMaxLogos ?? 5, monthlyPrice: d.essentialsMonthlyPrice ?? 5000, annualPrice: d.essentialsAnnualPrice ?? 50000, features: [], isActive: true },
                    { id: "premium", name: "Premium", description: "For large teams", maxInvoices: d.premiumMaxInvoices ?? 999, maxLogos: d.premiumMaxLogos ?? 999, monthlyPrice: d.premiumMonthlyPrice ?? 15000, annualPrice: d.premiumAnnualPrice ?? 150000, features: [], isActive: true },
                ]);
            }
        }
        setLoading(false);
    };

    useEffect(() => { fetchPlans(); }, []);

    const handleSave = async (plan: Plan) => {
        if (editingPlan?.id) {
            const res = await AdminApi.updateSystemConfig({ ...plan } as any);
            if (res.status === 200) { showSuccess("Plan updated successfully"); await fetchPlans(); }
            else showError(res.error || "Failed to update plan");
        } else {
            const res = await AdminApi.updateSystemConfig({ ...plan } as any);
            if (res.status === 200 || res.status === 201) { showSuccess("Plan created successfully"); await fetchPlans(); }
            else showError(res.error || "Failed to create plan");
        }
        setShowModal(false);
        setEditingPlan(null);
    };

    const handleDelete = async (plan: Plan) => {
        if (!confirm(`Delete "${plan.name}" plan?`)) return;
        showSuccess(`"${plan.name}" plan removed`);
        setPlans(prev => prev.filter(p => p.id !== plan.id));
    };

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">System Configuration</h1>
                    <p className="text-gray-600 mt-1 text-sm">Manage subscription plans and platform settings</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold">Super Admin Only</span>
                    <button
                        onClick={() => { setEditingPlan(null); setShowModal(true); }}
                        className="px-4 py-2 bg-[#2F80ED] text-white rounded-lg font-medium hover:bg-[#2868C7] flex items-center gap-2 text-sm"
                    >
                        <Plus size={18} />
                        Add Plan
                    </button>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800">Changes to subscription plans affect all users immediately. Review carefully before saving.</p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white border border-[#E4E7EC] rounded-xl p-6 animate-pulse">
                            <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
                            <div className="h-3 bg-gray-200 rounded w-2/3 mb-6" />
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-3 bg-gray-200 rounded w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                        <div key={plan.id ?? plan.name} className={`bg-white border rounded-xl p-5 flex flex-col gap-4 ${plan.isActive ? "border-[#E4E7EC]" : "border-gray-200 opacity-60"}`}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                                        {plan.isActive
                                            ? <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
                                            : <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">Inactive</span>}
                                    </div>
                                    {plan.description && <p className="text-xs text-gray-500 mt-1">{plan.description}</p>}
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setEditingPlan(plan); setShowModal(true); }} className="p-1.5 hover:bg-[#EBF5FF] rounded-lg">
                                        <Edit2 size={15} className="text-[#2F80ED]" />
                                    </button>
                                    <button onClick={() => handleDelete(plan)} className="p-1.5 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={15} className="text-red-500" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Max Invoices</p>
                                    <p className="text-lg font-bold text-gray-900">{plan.maxInvoices === 999 ? "∞" : plan.maxInvoices}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Max Logos</p>
                                    <p className="text-lg font-bold text-gray-900">{plan.maxLogos === 999 ? "∞" : plan.maxLogos}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="border border-[#E4E7EC] rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Monthly</p>
                                    <p className="text-sm font-bold text-gray-900">{plan.monthlyPrice === 0 ? "Free" : `${naira}${plan.monthlyPrice.toLocaleString()}`}</p>
                                </div>
                                <div className="border border-[#E4E7EC] rounded-lg p-3">
                                    <p className="text-xs text-gray-500">Annual</p>
                                    <p className="text-sm font-bold text-gray-900">{plan.annualPrice === 0 ? "Free" : `${naira}${plan.annualPrice.toLocaleString()}`}</p>
                                </div>
                            </div>

                            {plan.features.length > 0 && (
                                <div className="space-y-1.5">
                                    {plan.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                            <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <PlanFormModal
                    plan={editingPlan}
                    onClose={() => { setShowModal(false); setEditingPlan(null); }}
                    onSave={handleSave}
                />
            )}

            <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
        </div>
    );
};

export default AdminSystemConfigPage;
