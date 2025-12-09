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
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.281 18.2194C19.3507 18.289 19.406 18.3718 19.4437 18.4628C19.4814 18.5539 19.5008 18.6514 19.5008 18.75C19.5008 18.8485 19.4814 18.9461 19.4437 19.0372C19.406 19.1282 19.3507 19.2109 19.281 19.2806C19.2114 19.3503 19.1286 19.4056 19.0376 19.4433C18.9465 19.481 18.849 19.5004 18.7504 19.5004C18.6519 19.5004 18.5543 19.481 18.4632 19.4433C18.3722 19.4056 18.2895 19.3503 18.2198 19.2806L12.0004 13.0603L5.78104 19.2806C5.64031 19.4213 5.44944 19.5004 5.25042 19.5004C5.05139 19.5004 4.86052 19.4213 4.71979 19.2806C4.57906 19.1399 4.5 18.949 4.5 18.75C4.5 18.551 4.57906 18.3601 4.71979 18.2194L10.9401 12L4.71979 5.78061C4.57906 5.63988 4.5 5.44901 4.5 5.24999C4.5 5.05097 4.57906 4.8601 4.71979 4.71936C4.86052 4.57863 5.05139 4.49957 5.25042 4.49957C5.44944 4.49957 5.64031 4.57863 5.78104 4.71936L12.0004 10.9397L18.2198 4.71936C18.3605 4.57863 18.5514 4.49957 18.7504 4.49957C18.9494 4.49957 19.1403 4.57863 19.281 4.71936C19.4218 4.8601 19.5008 5.05097 19.5008 5.24999C19.5008 5.44901 19.4218 5.63988 19.281 5.78061L13.0607 12L19.281 18.2194Z" fill="black"/>
</svg>

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
