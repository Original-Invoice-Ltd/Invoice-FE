"use client";

import { X, Check } from "lucide-react";
import { ModalType } from "./types";

interface ModalsProps {
  modalType: ModalType;
  onClose: () => void;
  onConfirm: () => void;
}

const Modals = ({ modalType, onClose, onConfirm }: ModalsProps) => {
  if (!modalType) return null;

  const renderModalContent = () => {
    switch (modalType) {
      case 'markPaid':
        return (
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Mark as paid?
            </h2>
            <p className="text-gray-600 mb-6">
              Record this invoice as paid to keep your payment history accurate.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mark as Paid
              </button>
            </div>
          </div>
        );

      case 'paymentSuccess':
        return (
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={40} className="text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Payment marked as paid.
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              The invoice has been updated.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/dashboard';
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        );

      case 'revertStatus':
        return (
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Revert payment status?
            </h2>
            <p className="text-gray-600 mb-6">
              This invoice will be marked as unpaid again. The client&apos;s payment record will be removed.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Mark as Unpaid
              </button>
            </div>
          </div>
        );

      case 'revertSuccess':
        return (
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Check size={40} className="text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center">
              Payment status reverted.
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              The invoice is now unpaid.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClose();
                  window.location.href = '/dashboard';
                }}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      {renderModalContent()}
    </div>
  );
};

export default Modals;
