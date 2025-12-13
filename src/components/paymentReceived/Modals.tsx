"use client";

import { X, CheckCircle } from "lucide-react";
import { ModalType } from "./types";

interface ModalsProps {
  modalType: ModalType;
  onClose: () => void;
  onConfirm: () => void;
}

const Modals = ({ modalType, onClose, onConfirm }: ModalsProps) => {
  if (!modalType) return null;

  // Prevent body scroll when modal is open
  if (typeof document !== 'undefined') {
    document.body.style.overflow = 'hidden';
  }

  const handleClose = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'unset';
    }
    onClose();
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'markPaid':
        return (
          <div className="text-center" style={{ paddingTop: '32px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }}>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Mark as paid?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Record this invoice as paid to keep your payment history accurate.
            </p>
            <div style={{ width: '352px', height: '42px', display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
              <button
                onClick={handleClose}
                style={{
                  width: '82px',
                  height: '42px',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  gap: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #2F80ED',
                  boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                  color: '#2F80ED',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                style={{
                  width: '140px',
                  height: '42px',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  gap: '8px',
                  background: '#2F80ED',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-700 transition-colors"
              >
                Mark as Paid
              </button>
            </div>
          </div>
        );

      case 'revertStatus':
        return (
          <div className="text-center" style={{ paddingTop: '32px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }}>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Revert payment status?
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              This invoice will be marked as unpaid again. The client's payment record will be removed.
            </p>
            <div style={{ width: '352px', height: '42px', display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
              <button
                onClick={handleClose}
                style={{
                  width: '82px',
                  height: '42px',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  gap: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #2F80ED',
                  boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                  color: '#2F80ED',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                style={{
                  width: '140px',
                  height: '42px',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  gap: '8px',
                  background: '#2F80ED',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-700 transition-colors"
              >
                Mark as Unpaid
              </button>
            </div>
          </div>
        );

      case 'paymentSuccess':
        return (
          <div className="text-center" style={{ paddingTop: '32px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }}>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-teal-100 rounded-full p-4">
                  <CheckCircle size={40} className="text-teal-600" />
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Payment marked as paid.
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              The invoice has been updated.
            </p>
            <div style={{ width: '352px', height: '42px', display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
              <button
                onClick={handleClose}
                style={{
                  width: '82px',
                  height: '42px',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  gap: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #2F80ED',
                  boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                  color: '#2F80ED',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                style={{
                  width: '140px',
                  height: '42px',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  gap: '8px',
                  background: '#2F80ED',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        );

      case 'revertSuccess':
        return (
          <div className="text-center" style={{ paddingTop: '32px', paddingBottom: '24px', paddingLeft: '24px', paddingRight: '24px' }}>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-100 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-teal-100 rounded-full p-4">
                  <CheckCircle size={40} className="text-teal-600" />
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Payment status reverted.
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              The invoice is now unpaid.
            </p>
            <div style={{ width: '352px', height: '42px', display: 'flex', justifyContent: 'space-between', margin: '0 auto' }}>
              <button
                onClick={handleClose}
                style={{
                  width: '82px',
                  height: '42px',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  gap: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #2F80ED',
                  boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
                  color: '#2F80ED',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClose}
                style={{
                  width: '140px',
                  height: '42px',
                  borderRadius: '6px',
                  padding: '10px 16px',
                  gap: '8px',
                  background: '#2F80ED',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
                className="hover:bg-blue-700 transition-colors"
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
    <>
      {/* Backdrop with blur and semi-transparent overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="bg-white rounded-2xl pointer-events-auto"
          style={{
            width: '400px',
            minHeight: (modalType === 'paymentSuccess' || modalType === 'revertSuccess') ? '328px' : '234px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 10px 18px -2px rgba(10, 9, 11, 0.07)',
            borderRadius: '16px'
          }}
        >
          {renderModalContent()}
        </div>
      </div>
    </>
  );
};

export default Modals;
