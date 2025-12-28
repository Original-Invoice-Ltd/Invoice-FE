import React, { useState } from 'react';
import { PaymentFormData } from './types';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isProcessing: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit, isProcessing }) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: '',
    acceptTerms: false,
  });

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cardNumber: value });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setFormData({ ...formData, expiryDate: value });
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cvc: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 
        style={{
          width: '470px',
          height: '29px',
          fontFamily: 'Inter Tight, sans-serif',
          fontWeight: 500,
          fontSize: '24px',
          lineHeight: '120%',
          letterSpacing: '0%',
        }}
      >
        Card Information
      </h2>

      {/* Card Number */}
      <div>
        <div className="relative">
          <input
            type="text"
            value={formatCardNumber(formData.cardNumber)}
            onChange={handleCardNumberChange}
            placeholder="1234 1234 1234 1234"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-2 py-1 rounded text-white text-xs font-bold">
              VISA
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            value={formatExpiryDate(formData.expiryDate)}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.cvc}
            onChange={handleCvcChange}
            placeholder="CVC"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
          placeholder="Enter your cardname"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Country/Region */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Country or Region
        </label>
        <div className="relative">
          <select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            required
          >
            <option value="">Select country or region</option>
            <option value="NG">Nigeria</option>
            <option value="US">United States</option>
            <option value="GB">United Kingdom</option>
            <option value="CA">Canada</option>
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={formData.acceptTerms}
          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
          required
        />
        <label className="text-sm text-gray-600">
          Pay securely at Original Invoice and everywhere is accepted
        </label>
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Pay'}
      </button>

      {/* Footer Text */}
      <div className="text-xs text-gray-500 text-center" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <p>
          By confirming your payment, you allow Original Invoice to charge you for this payment and future payment in accordance with their terms.
        </p>
        <p className="flex items-center justify-center gap-1">
          Powered by <span className="text-blue-600 font-semibold">Paystack</span>
        </p>
      </div>
    </form>
  );
};

export default PaymentForm;
