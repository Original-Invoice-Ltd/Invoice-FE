import { X, Check } from "lucide-react";

interface SuccessModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}

export const SuccessModal = ({ isOpen, title, message, onClose }: SuccessModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(197, 199, 202, 0.90)' }}>
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex justify-end mb-4">
                    <button onClick={onClose} className="text-[#667085] hover:text-[#101828]">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#D1FADF] flex items-center justify-center mb-4">
                        <Check size={32} className="text-[#12B76A]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#101828] mb-2">{title}</h3>
                    <p className="text-sm text-[#667085] mb-6">{message}</p>
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
