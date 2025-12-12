"use client";

interface EmptyStateProps {
  onViewUnpaid: () => void;
}

const EmptyState = ({ onViewUnpaid }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="#E8F4FF" />
          <rect x="35" y="30" width="50" height="60" rx="4" fill="white" stroke="#2F80ED" strokeWidth="2" />
          <line x1="45" y1="45" x2="75" y2="45" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" />
          <line x1="45" y1="55" x2="75" y2="55" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" />
          <line x1="45" y1="65" x2="65" y2="65" stroke="#2F80ED" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No payments recorded yet
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Payments will be added once your customers pay for their invoices.
      </p>
      <button
        onClick={onViewUnpaid}
        className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
      >
        + View unpaid Invoice
      </button>
    </div>
  );
};

export default EmptyState;
