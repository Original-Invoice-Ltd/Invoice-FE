'use client';

import { useRouter } from 'next/navigation';
import PaymentMethod from '@/components/paymentMethod';

export default function PaymentMethodPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful!');
    // You can add additional logic here, like redirecting to a success page
    // router.push('/dashboard');
  };

  const handlePaymentFailed = () => {
    console.log('Payment failed!');
    // You can add additional logic here, like logging the error
  };

  return (
    <PaymentMethod
      onBack={handleBack}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentFailed={handlePaymentFailed}
    />
  );
}
