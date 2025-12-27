import React from 'react';

interface PaymentModalProps {
  type: 'success' | 'failed';
  onCancel: () => void;
  onPrimaryAction: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ type, onCancel, onPrimaryAction }) => {
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`relative w-24 h-24 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
            {/* Petal effect */}
            <div className={`absolute inset-0 ${isSuccess ? 'bg-green-100' : 'bg-red-100'} rounded-full`} style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }}></div>
            
            {isSuccess ? (
              <svg className="w-12 h-12 text-green-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-red-600 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          {isSuccess ? 'Payment Successful' : 'Payment Failed'}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-8">
          {isSuccess
            ? 'Your payment has been processed successfully. Thank you!'
            : "Your payment couldn't be processed. Please try again."}
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onPrimaryAction}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isSuccess ? 'Back to Home' : 'Try Again'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
