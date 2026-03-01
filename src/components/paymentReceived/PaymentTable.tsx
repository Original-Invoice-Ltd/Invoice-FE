"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Payment } from "./types";
import { useTranslation } from "react-i18next";

interface PaymentTableProps {
  payments: Payment[];
  onMarkPaid: (payment: Payment) => void;
  onRevertStatus: (payment: Payment) => void;
  onEmail: (payment: Payment) => void;
  onGetLink: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onViewReceipt: (payment: Payment) => void;
}

const PaymentTable = ({
  payments,
  onMarkPaid,
  onRevertStatus,
  onEmail,
  onGetLink,
  onDelete,
  onViewReceipt,
}: PaymentTableProps) => {
  const { t } = useTranslation();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Unpaid':
        return 'bg-orange-100 text-orange-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <>
      {/* Table - Desktop */}
      <div className="hidden md:block overflow-x-auto px-[14px]">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] border-b border-[#E4E7EC]">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">{t('date')}</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">{t('client_name')}</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">{t('invoice_id')}</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">{t('status')}</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">{t('due_date')}</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-[#7D7F81]">{t('amount')}</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-[#7D7F81]">{t('balance_due')}</th>
              <th className="bg-[#F9FAFB] text-right px-6 py-3 text-xs font-medium text-[#7D7F81]"></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-[#E4E7EC]">
                <td className="px-6 py-4 text-sm text-[#333436]">{payment.date}</td>
                <td className="px-6 py-4 text-sm text-[#333436]">{payment.clientName}</td>
                <td className="px-6 py-4 text-sm text-[#333436]">{payment.invoiceId}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[#333436]">{payment.dueDate}</td>
                <td className="px-6 py-4 text-sm text-[#333436] text-center">₦{payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-[#333436] text-center">₦{payment.balanceDue.toLocaleString()}</td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() => toggleMenu(payment.id)}
                    className="text-[#444444]"
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {openMenuId === payment.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="fixed bottom-full mb-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999] max-h-48 overflow-y-auto transform -translate-x-full" style={{ right: '2rem' }}>
                        {payment.status !== 'Paid' && (
                          <button
                            onClick={() => {
                              onMarkPaid(payment);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {t('mark_paid')}
                          </button>
                        )}
                        {payment.status === 'Paid' && (
                          <button
                            onClick={() => {
                              onRevertStatus(payment);
                              setOpenMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            {t('mark_unpaid')}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onEmail(payment);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {t('email')}
                        </button>
                        <button
                          onClick={() => {
                            onViewReceipt(payment);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View Receipt
                        </button>
                        <button
                          onClick={() => {
                            onDelete(payment);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-[#E4E7EC] px-[14px]">
        {payments.map((payment) => (
          <div key={payment.id} className="p-4">
            <div className="relative">
              <button
                onClick={() => toggleMenu(payment.id)}
                className="text-[#667085] hover:text-[#101828] ml-2"
              >
                <MoreVertical size={18} />
              </button>
            </div>
            {openMenuId === payment.id && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="fixed bottom-full mb-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[9999] max-h-48 overflow-y-auto transform -translate-x-full" style={{ right: '1rem' }}>
                  {payment.status !== 'Paid' && (
                    <button
                      onClick={() => {
                        onMarkPaid(payment);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('mark_paid')}
                    </button>
                  )}
                  {payment.status === 'Paid' && (
                    <button
                      onClick={() => {
                        onRevertStatus(payment);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('mark_unpaid')}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      onEmail(payment);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t('email')}
                  </button>
                  <button
                    onClick={() => {
                      onViewReceipt(payment);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View Receipt
                  </button>
                  <button
                    onClick={() => {
                      onDelete(payment);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    {t('delete')}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PaymentTable;
