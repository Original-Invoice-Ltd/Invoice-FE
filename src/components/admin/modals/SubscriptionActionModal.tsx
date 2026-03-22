"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface Subscription {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    plan: "FREE" | "ESSENTIALS" | "PREMIUM";
    status: "active" | "expired" | "cancelled";
    startDate: string;
    expiryDate: string;
    daysUntilExpiry: number;
}

interface SubscriptionActionModalProps {
    subscription: Subscription;
    actionType: "upgrade" | "downgrade" | "extend" | "cancel";
    onClose: () => void;
}

const SubscriptionActionModal = ({ subscription, actionType, onClose }: SubscriptionActionModalProps) => {
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(subscription.plan);
    const [extendDays, setExtendDays] = useState(30);
    const [reason, setReason] = useState("");

    const handleConfirm = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            onClose();
        }, 1000);
    };

    const getActionContent = () => {
        switch (actionType) {
            case "upgrade":
                return {
                    title: "Upgrade Subscription",
                    description: `Upgrade ${subscription.userName}'s subscription plan`,
                    showPlanSelect: true
                };
            case "downgrade":
                return {
                    title: "Downgrade Subscription",
                    description: `Downgrade ${subscription.userName}'s subscription plan`,
                    showPlanSelect: true
                };
            case "extend":
                return {
                    title: "Extend Subscription",
                    description: `Extend ${subscription.userName}'s subscription expiry date`,
                    showExtendDays: true
                };
            case "cancel":
                return {
                    title: "Cancel Subscription",
                    description: `Cancel ${subscription.userName}'s subscription`,
                    showReason: true,
                    isDangerous: true
                };
            default:
                return {};
        }
    };

    const content = getActionContent() as any;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[98vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-[#E4E7EC] flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">{content.title}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                    <p className="text-gray-600">{content.description}</p>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Current Plan</p>
                        <p className="text-lg font-semibold text-gray-900">{subscription.plan}</p>
                        <p className="text-sm text-gray-500 mt-1">Expires: {subscription.expiryDate}</p>
                    </div>

                    {content.showPlanSelect && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                New Plan
                            </label>
                            <select
                                value={selectedPlan}
                                onChange={(e) => setSelectedPlan(e.target.value as any)}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            >
                                <option value="FREE">Free</option>
                                <option value="ESSENTIALS">Essentials - $29/month</option>
                                <option value="PREMIUM">Premium - $99/month</option>
                            </select>
                        </div>
                    )}

                    {content.showExtendDays && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Extend by (days)
                            </label>
                            <input
                                type="number"
                                value={extendDays}
                                onChange={(e) => setExtendDays(parseInt(e.target.value))}
                                min="1"
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                New expiry: {new Date(new Date(subscription.expiryDate).getTime() + extendDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                            </p>
                        </div>
                    )}

                    {content.showReason && (
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                Reason for Cancellation
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter reason..."
                                rows={3}
                                className="w-full px-4 py-2 border border-[#E4E7EC] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                            />
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#E4E7EC] flex gap-3 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-[#E4E7EC] rounded-lg font-medium hover:bg-gray-50">
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-white ${
                            content.isDangerous
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-[#2F80ED] hover:bg-[#2868C7]"
                        } disabled:opacity-50`}
                    >
                        {loading ? "Processing..." : content.title}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionActionModal;
