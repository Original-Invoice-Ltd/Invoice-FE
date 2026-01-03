"use client";

import { Plus } from "lucide-react";

interface EmptyStateProps {
    onAddClient: () => void;
}

const EmptyState = ({ onAddClient }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16">
            <div className="w-32 h-32 mb-6">
                <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="60" cy="60" r="60" fill="#F3F4F6"/>
                    <path d="M60 40V80M40 60H80" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round"/>
                </svg>
            </div>
            <h3 className="text-lg font-medium text-[#101828] mb-2">No clients yet</h3>
            <p className="text-sm text-[#667085] mb-6">Add your first client to start sending invoices and tracking payments.</p>
            <button 
                onClick={onAddClient}
                className="flex items-center gap-2 px-4 py-2 border border-[#2F80ED] text-[#2F80ED] rounded-lg text-sm font-medium hover:bg-[#EFF8FF]"
            >
                <Plus size={18} />
                Add Client
            </button>
        </div>
    );
};

export default EmptyState;
