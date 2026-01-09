"use client";

import { X, Check } from "lucide-react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateInvoice: () => void;
}

const SuccessModal = ({ isOpen, onClose, onCreateInvoice }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#667085] hover:text-[#101828]"
                >
                    <X size={20} />
                </button>
                
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mb-4">
                        <Check size={32} className="text-[#10B981]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#101828] mb-2">Client added successfully</h2>
                    <p className="text-sm text-[#667085] mb-6">You can now create an invoice for this client.</p>
                    
                    <div className="flex items-center gap-3 w-full">
                        <button 
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-[#D0D5DD] text-[#344054] rounded-lg text-sm font-medium hover:bg-[#F9FAFB]"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={onCreateInvoice}
                            className="flex-1 px-6 py-3 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB]"
                        >
                            Create Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
