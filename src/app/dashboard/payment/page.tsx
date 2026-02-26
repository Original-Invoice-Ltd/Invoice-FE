"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PaymentReceived from "@/components/paymentReceived";
import ReceivedInvoices from "@/components/paymentReceived/receivedInvoices";
import { useTranslation } from "react-i18next";

const PaymentReceivedPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const handleCreateInvoice = () => {
    router.push('/dashboard/invoices');
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="px-6 pt-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('all_payments')}</h1>
      </div>

      <PaymentReceived onCreateInvoice={handleCreateInvoice} />

      <ReceivedInvoices />
   
      {openDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
};

export default PaymentReceivedPage;
