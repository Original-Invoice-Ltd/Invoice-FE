export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  country: string;
  acceptTerms: boolean;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export interface PaymentMethodProps {
  onBack?: () => void;
  onPaymentSuccess?: () => void;
  onPaymentFailed?: () => void;
}
