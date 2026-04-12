"use client";

import { X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { AdminApi, AdminSubscription } from "@/lib/adminApi";

interface SubscriptionActionModalProps {
    subscription: AdminSubscription;
    actionType: "upgrade" | "downgrade" | "extend" | "cancel";
    onClose: () => void;
}

const SubscriptionActionModal = ({ subscription, actionType, onClose }: SubscriptionActionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(subscription.plan);
    const [extendDays, setExtendDays] = useState(30);
    const [reason, setReason] = useState("");

    const handleConfirm = async () => {
        setLoading(true);
        setError("");
        try {
            let res;
            switch (actionType) {
                case "upgrade":
                    res = await AdminApi.upgradeSubscription(subscription.id, selectedPlan);
                    break;
                case "downgrade":
                    res = await AdminApi.downgradeSubscription(subscription.id, selectedPlan);
                    break;
                case "extend":
                    res = await AdminApi.extendSubscription(subscription.id, extendDays);
                    break;
                case "cancel":
                    res = await AdminApi.cancelSubscription(subscription.id, reason);
                    break;
            }
            if (res && (res.status === 200 || res.status === 204)) {
                onClose();
            } else {
                setError(res?.error || "Action failed. Please try again.");
            }
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const getActionContent = () => {
        switch (actionType) {
            case "upgrade":
                return { title: "Upgrade Subscription", description: `Upgrade ${subscription.userName}'s subscription plan`, showPlanSelect: true };
            case "downgrade":
                return { title: "Downgrade Subscription", description: `Downgrade ${subscription.userName}'s subscription plan`, showPlanSelect: true };
            case "extend":
                return { title: "Extend Subscription", description: `Extend ${subscription.userName}'s subscription expiry date`, showExtendDays: true };
            case "cancel":
                return { title: "Cancel Subscription", description: `Cancel ${subscription.userName}'s subscription`, showReason: true, isDangerous: true };
        }
    };

    const content = getActionContent();

    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[98vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC] flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">{content.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X size={24} /></button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <p className="text-gray-600 text-sm">{content.description}</p>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Current Plan</p>
                        <p className="text-lg font-semibold text-gray-900">{subscription.plan}</p>
                        <p className="text-sm text-gray-500 mt-1">Expires: {subscription.expiryDate}</p>
                    </div>

                    {content.showPlanSelect && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">New Plan</label>
                            <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value as any)} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm">
                                <option value="FREE">Free</option>
                                <option value="ESSENTIALS">Essentials</option>
                                <option value="PREMIUM">Premium</option>
                            </select>
                        </div>
                    )}

                    {content.showExtendDays && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Extend by (days)</label>
                            <input type="number" value={extendDays} onChange={(e) => setExtendDays(parseInt(e.target.value))} min="1" className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                            <p className="text-xs text-gray-500 mt-2">
                                New expiry: {new Date(new Date(subscription.expiryDate).getTime() + extendDays * 86400000).toISOString().split("T")[0]}
                            </p>
                        </div>
                    )}

                    {content.showReason && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Reason for Cancellation</label>
                            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Enter reason..." rows={3} className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED] text-sm" />
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#E4E7EC] flex gap-3 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50 text-sm">Cancel</button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-white text-sm ${content.isDangerous ? "bg-red-600 hover:bg-red-700" : "bg-[#2F80ED] hover:bg-[#2868C7]"} disabled:opacity-50`}
                    >
                        {loading ? "Processing..." : content.title}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionActionModal;
