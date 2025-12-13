"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Payment } from "./types";

interface PaymentTableProps {
  payments: Payment[];
  onMarkPaid: (payment: Payment) => void;
  onRevertStatus: (payment: Payment) => void;
  onEmail: (payment: Payment) => void;
  onGetLink: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

const PaymentTable = ({
  payments,
  onMarkPaid,
  onRevertStatus,
  onEmail,
  onGetLink,
  onDelete,
}: PaymentTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'Unpaid':
        return 'bg-orange-100 text-orange-700';
      case 'Overdue':
        return 'bg-red-100 text-red-700';
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
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">Client Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">Invoice ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-[#7D7F81]">Due Date</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-[#7D7F81]">Amount</th>
              <th className="text-center px-6 py-3 text-xs font-medium text-[#7D7F81]">Balance Due</th>
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
                <td className="px-6 py-4 text-sm text-[#333436] text-center">${payment.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-[#333436] text-center">${payment.balanceDue.toLocaleString()}</td>
                <td className="px-6 py-4 text-right">
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
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-48 overflow-y-auto">
                        <button
                          onClick={() => {
                            payment.status === 'Paid' ? onRevertStatus(payment) : onMarkPaid(payment);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {payment.status === 'Paid' ? 'Mark as Unpaid' : 'Mark Paid'}
                        </button>
                        <button
                          onClick={() => {
                            onEmail(payment);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Email
                        </button>
                        <button
                          onClick={() => {
                            onGetLink(payment);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Get Link
                        </button>
                        <button
                          onClick={() => {
                            onDelete(payment);
                            setOpenMenuId(null);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
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
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#101828] mb-1">{payment.clientName}</h3>
                <span className="inline-block px-2 py-1 text-xs bg-[#F2F4F7] text-[#344054] rounded">{payment.invoiceId}</span>
              </div>
              <button
                onClick={() => toggleMenu(payment.id)}
                className="text-[#667085] hover:text-[#101828] ml-2"
              >
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-[#667085]">Date:</span>
                <span className="ml-1 text-[#101828]">{payment.date}</span>
              </div>
              <div>
                <span className="text-[#667085]">Due Date:</span>
                <span className="ml-1 text-[#101828]">{payment.dueDate}</span>
              </div>
              <div>
                <span className="text-[#667085]">Amount:</span>
                <span className="ml-1 text-[#101828] font-medium">${payment.amount.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#667085]">Balance:</span>
                <span className="ml-1 text-[#101828]">${payment.balanceDue.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-[#667085] mr-2">Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                {payment.status}
              </span>
            </div>

            {openMenuId === payment.id && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenMenuId(null)}
                />
                <div className="absolute right-4 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 max-h-48 overflow-y-auto">
                  <button
                    onClick={() => {
                      payment.status === 'Paid' ? onRevertStatus(payment) : onMarkPaid(payment);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {payment.status === 'Paid' ? 'Mark as Unpaid' : 'Mark Paid'}
                  </button>
                  <button
                    onClick={() => {
                      onEmail(payment);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Email
                  </button>
                  <button
                    onClick={() => {
                      onGetLink(payment);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Get Link
                  </button>
                  <button
                    onClick={() => {
                      onDelete(payment);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
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
