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
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Client Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Invoice ID</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Due Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Balance Due</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 text-sm text-gray-900">{payment.date}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{payment.clientName}</td>
                <td className="py-4 px-4 text-sm text-gray-900">{payment.invoiceId}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{payment.dueDate}</td>
                <td className="py-4 px-4 text-sm text-gray-900">${payment.amount.toLocaleString()}</td>
                <td className="py-4 px-4 text-sm text-gray-900">${payment.balanceDue.toLocaleString()}</td>
                <td className="py-4 px-4 relative">
                  <button
                    onClick={() => toggleMenu(payment.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <MoreVertical size={20} className="text-gray-600" />
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

      {/* Mobile List */}
      <div className="md:hidden space-y-4">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-900">{payment.clientName}</p>
                <p className="text-sm text-gray-600">{payment.invoiceId}</p>
              </div>
              <button
                onClick={() => toggleMenu(payment.id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="text-gray-900">{payment.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="text-gray-900">{payment.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="text-gray-900">${payment.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balance Due:</span>
                <span className="text-gray-900">${payment.balanceDue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
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
