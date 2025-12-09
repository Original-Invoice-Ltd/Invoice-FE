import { Trash2 } from "lucide-react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(197, 199, 202, 0.90)' }}>
            <div 
                className="bg-white rounded-2xl flex flex-col"
                style={{
                    width: '400px',
                    height: '348px',
                    paddingTop: '32px',
                    paddingBottom: '24px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                }}
            >
                <div 
                    className="flex flex-col items-center text-center"
                    style={{
                        width: '400px',
                        height: '202px',
                        paddingTop: '8px',
                        paddingRight: '24px',
                        paddingBottom: '8px',
                        paddingLeft: '24px',
                        gap: '24px'
                    }}
                >
                    <div className="w-12 h-12 rounded-full bg-[#FEE4E2] flex items-center justify-center">
                        <Trash2 size={24} className="text-[#F04438]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#101828]">Delete this item?</h3>
                    <p className="text-sm text-[#667085]">
                        This action can't be undone. The item will be permanently removed from your list.
                    </p>
                </div>
                <div 
                    className="flex"
                    style={{
                        width: '400px',
                        height: '90px',
                        gap: '20px',
                        padding: '24px'
                    }}
                >
                    <button
                        onClick={onClose}
                        className="rounded-md"
                        style={{
                            width: '82px',
                            height: '42px',
                            paddingTop: '10px',
                            paddingRight: '16px',
                            paddingBottom: '10px',
                            paddingLeft: '16px',
                            gap: '8px',
                            borderWidth: '1px',
                            background: '#FFFFFF',
                            border: '1px solid #2F80ED',
                            boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                            color: '#2F80ED',
                            fontWeight: '500'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-md"
                        style={{
                            width: '140px',
                            height: '42px',
                            paddingTop: '10px',
                            paddingRight: '16px',
                            paddingBottom: '10px',
                            paddingLeft: '16px',
                            gap: '8px',
                            background: '#2F80ED',
                            color: '#FFFFFF',
                            fontWeight: '500'
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
