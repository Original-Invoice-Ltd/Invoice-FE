'use client';

import React, { useState } from 'react';
import PromotionalSection from './PromotionalSection';
import PaymentForm from './PaymentForm';
import PaymentModal from './PaymentModal';
import { PaymentFormData, PaymentStatus, PaymentMethodProps } from './types';

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  onBack,
  onPaymentSuccess,
  onPaymentFailed,
}) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

  const handlePaymentSubmit = async (data: PaymentFormData) => {
    setPaymentStatus('processing');

    // Simulate payment processing with Paystack
    // In production, integrate with actual Paystack API
    setTimeout(() => {
      // Randomly simulate success or failure for demo
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setPaymentStatus('success');
        onPaymentSuccess?.();
      } else {
        setPaymentStatus('failed');
        onPaymentFailed?.();
      }
    }, 2000);
  };

  const handleModalCancel = () => {
    setPaymentStatus('idle');
  };

  const handleSuccessAction = () => {
    // Navigate to home or dashboard
    window.location.href = '/';
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Go Back Link */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Go back</span>
        </button>
      </div>

      {/* Main Layout */}
      <div className="lg:grid lg:grid-cols-5 min-h-screen">
        {/* Left Column - Promotional Section (40%) */}
        <div className="lg:col-span-2">
          <PromotionalSection />
        </div>

        {/* Right Column - Payment Form (60%) */}
        <div className="lg:col-span-3 flex items-center justify-center p-6 lg:p-12">
          <div 
            className="w-full bg-white rounded-xl shadow-lg"
            style={{
              maxWidth: '518px',
              minHeight: '625px',
              padding: '32px 24px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                isProcessing={paymentStatus === 'processing'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {paymentStatus === 'success' && (
        <PaymentModal
          type="success"
          onCancel={handleModalCancel}
          onPrimaryAction={handleSuccessAction}
        />
      )}

      {paymentStatus === 'failed' && (
        <PaymentModal
          type="failed"
          onCancel={handleModalCancel}
          onPrimaryAction={handleRetry}
        />
      )}
    </div>
  );
};

export default PaymentMethod;
