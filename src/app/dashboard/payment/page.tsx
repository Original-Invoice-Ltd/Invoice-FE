"use client";

import { useRouter } from "next/navigation";
import PaymentReceived from "@/components/paymentReceived";

const PaymentReceivedPage = () => {
  const router = useRouter();

  const handleCreateInvoice = () => {
    router.push('/dashboard/invoices');
  };

  return <PaymentReceived onCreateInvoice={handleCreateInvoice} />;
};

export default PaymentReceivedPage;
