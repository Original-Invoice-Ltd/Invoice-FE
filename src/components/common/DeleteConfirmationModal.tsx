"use client";

import { X, AlertTriangle, Trash2, UserX, FileX } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type: 'invoice' | 'client' | 'product' | 'general';
    isLoading?: boolean;
    error?: string | null;
}

const DeleteConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type,
    isLoading = false,
    error = null
}: DeleteConfirmationModalProps) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'invoice':
                return <FileX size={48} className="text-red-500" />;
            case 'client':
                return <UserX size={48} className="text-red-500" />;
            case 'product':
                return <Trash2 size={48} className="text-red-500" />;
            default:
                return <AlertTriangle size={48} className="text-red-500" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                        {/* Icon */}
                        <div className="mb-4">
                            {getIcon()}
                        </div>

                        {/* Message */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {message}
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;