"use client";

import React, { useState } from "react";
import { Search, MoreVertical } from "lucide-react";
import UploadReceiptModal from "./UploadReceiptModal";

interface Invoice {
  id: number;
  date: string;
  issuedBy: string;
  invoiceId: string;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
  amount: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 1,
    date: "Oct 25, 2025",
    issuedBy: "Tech Solutions Ltd",
    invoiceId: "INV-00123",
    status: "Paid",
    dueDate: "Nov 25, 2025",
    amount: "₦450,000",
  },
  {
    id: 2,
    date: "Oct 23, 2025",
    issuedBy: "Tech Solutions Ltd",
    invoiceId: "INV-00122",
    status: "Pending",
    dueDate: "Nov 25, 2025",
    amount: "₦85,000",
  },
  {
    id: 3,
    date: "Oct 15, 2025",
    issuedBy: "Tech Solutions Ltd",
    invoiceId: "INV-00121",
    status: "Paid",
    dueDate: "Nov 25, 2025",
    amount: "₦112,000",
  },
  {
    id: 4,
    date: "Oct 15, 2025",
    issuedBy: "Tech Solutions Ltd",
    invoiceId: "INV-00121",
    status: "Overdue",
    dueDate: "Nov 25, 2025",
    amount: "₦112,000",
  },
];

interface ActionMenuProps {
  status: "Paid" | "Pending" | "Overdue";
  onViewDetail: () => void;
  onViewReceipt?: () => void;
  onUploadReceipt?: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
  status,
  onViewDetail,
  onViewReceipt,
  onUploadReceipt,
}) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
      <button
        onClick={onViewDetail}
        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-t-lg"
      >
        View Detail
      </button>
      {status === "Paid" && onViewReceipt && (
        <button
          onClick={onViewReceipt}
          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-b-lg"
        >
          View Receipt
        </button>
      )}
      {status === "Pending" && onUploadReceipt && (
        <button
          onClick={onUploadReceipt}
          className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 rounded-b-lg"
        >
          Upload Receipt
        </button>
      )}
    </div>
  );
};

interface DashboardProps {
  onViewDetail: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewDetail }) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="bg-[#F9FAFB] p-4 md:p-8">
      <div>
        {/* Header and Summary Cards Container */}
        <div style={{ maxWidth: '1108px', height: '185px', gap: '20px', opacity: 1 }}>
          {/* Header */}
          <div style={{ maxWidth: '1108px', height: '48px', gap: '24px', opacity: 1 }} className="mb-8">
            <h1 style={{ maxWidth: '360px', height: '48px', gap: '4px', opacity: 1, fontFamily: 'Inter Tight', fontWeight: 600, fontSize: '20px', lineHeight: '120%', letterSpacing: '0%', color: '#000000' }}>
              Welcome back, Chiamaka
            </h1>
            <p style={{ maxWidth: '360px', height: '20px', opacity: 1, fontFamily: 'Inter Tight', fontWeight: 400, fontSize: '14px', lineHeight: '140%', letterSpacing: '1%', color: '#333436' }}>
              Here are all your invoices from Tech Solutions Ltd.
            </p>
          </div>

          {/* Summary Cards */}
          <div style={{ maxWidth: '1108px', height: '117px', gap: '24px', opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div style={{ width: '258.67px', height: '117px', gap: '20px', opacity: 1, borderRadius: '8px', borderWidth: '1px', paddingTop: '24px', paddingRight: '16px', paddingBottom: '24px', paddingLeft: '16px', background: '#EFF8FF66', border: '1px solid #E4E7EC' }}>
              <div className="text-3xl font-bold text-gray-900 mb-2">42</div>
              <div className="text-gray-600">Total Invoice Received</div>
            </div>
            <div style={{ width: '260px', height: '117px', gap: '20px', opacity: 1, borderRadius: '8px', borderWidth: '1px', paddingTop: '24px', paddingRight: '16px', paddingBottom: '24px', paddingLeft: '16px', background: '#EFF8FF66', border: '1px solid #E4E7EC' }}>
              <div className="text-3xl font-bold text-gray-900 mb-2">30</div>
              <div className="text-gray-600">Paid Invoice</div>
            </div>
            <div style={{ width: '258.67px', height: '117px', gap: '20px', opacity: 1, borderRadius: '8px', borderWidth: '1px', paddingTop: '24px', paddingRight: '16px', paddingBottom: '24px', paddingLeft: '16px', background: '#EFF8FF66', border: '1px solid #E4E7EC' }}>
              <div className="text-3xl font-bold text-gray-900 mb-2">7</div>
              <div className="text-gray-600">Pending Invoice</div>
            </div>
            <div style={{ width: '258.67px', height: '117px', gap: '20px', opacity: 1, borderRadius: '8px', borderWidth: '1px', paddingTop: '24px', paddingRight: '16px', paddingBottom: '24px', paddingLeft: '16px', background: '#EFF8FF66', border: '1px solid #E4E7EC' }}>
              <div className="text-3xl font-bold text-gray-900 mb-2">4</div>
              <div className="text-gray-600">Overdue Invoice</div>
            </div>
          </div>
        </div>

        {/* Recent Invoice Section */}
        <div style={{ maxWidth: '1108px', height: '394px', gap: '18px', opacity: 1, borderRadius: '8px', paddingTop: '16px', paddingRight: '14px', paddingLeft: '14px', background: '#FFFFFF' }}>
          <div style={{ width: '1080px', height: '38px', justifyContent: 'space-between', opacity: 1, display: 'flex', alignItems: 'center' }} className="p-6">
            <div style={{ width: '119px', height: '38px', gap: '6px', opacity: 1 }}>
              <h2 style={{ width: '119px', height: '25px', opacity: 1, fontFamily: 'Lato', fontWeight: 600, fontSize: '18px', lineHeight: '140%', letterSpacing: '1%', color: '#000000' }}>Recent Invoice</h2>
            </div>
            <div style={{ width: '344px', height: '38px', gap: '24px', opacity: 1, display: 'flex', alignItems: 'center' }} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search invoice"
                style={{ width: '292px', height: '22px', opacity: 1, fontFamily: 'Lato', fontWeight: 400, fontSize: '16px', lineHeight: '140%', letterSpacing: '1%', color: '#B0B3B5' }}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-t border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    S/N
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Issued By
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Invoice ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-gray-900">{invoice.date}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {invoice.issuedBy}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {invoice.invoiceId}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{invoice.dueDate}</td>
                    <td className="px-6 py-4 text-gray-900">{invoice.amount}</td>
                    <td className="px-6 py-4 relative">
                      <button
                        onClick={() =>
                          setActiveMenu(
                            activeMenu === invoice.id ? null : invoice.id
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {activeMenu === invoice.id && (
                        <ActionMenu
                          status={invoice.status}
                          onViewDetail={() => {
                            onViewDetail();
                            setActiveMenu(null);
                          }}
                          onViewReceipt={() => {
                            console.log("View Receipt");
                            setActiveMenu(null);
                          }}
                          onUploadReceipt={() => {
                            setSelectedInvoiceId(invoice.invoiceId);
                            setIsUploadModalOpen(true);
                            setActiveMenu(null);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden p-4 space-y-4">
            {mockInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {invoice.invoiceId}
                    </div>
                    <div className="text-sm text-gray-600">{invoice.date}</div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {invoice.issuedBy}
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-gray-900">{invoice.amount}</div>
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === invoice.id ? null : invoice.id)
                    }
                    className="p-1 hover:bg-gray-100 rounded relative"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                    {activeMenu === invoice.id && (
                      <ActionMenu
                        status={invoice.status}
                        onViewDetail={() => {
                          onViewDetail();
                          setActiveMenu(null);
                        }}
                        onViewReceipt={() => {
                          console.log("View Receipt");
                          setActiveMenu(null);
                        }}
                        onUploadReceipt={() => {
                          setSelectedInvoiceId(invoice.invoiceId);

                          setIsUploadModalOpen(true);
                          setActiveMenu(null);
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="p-6 flex justify-center items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded">
              <span className="text-gray-600">&lt;</span>
            </button>
            <button
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              className={`px-4 py-2 rounded ${
                currentPage === 2
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <button
              className={`px-4 py-2 rounded ${
                currentPage === 3
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(3)}
            >
              3
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <span className="text-gray-600">&gt;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Receipt Modal */}
      <UploadReceiptModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedInvoiceId(null);
        }}
        invoiceId={selectedInvoiceId || undefined}
      />
    </div>
  );
};

export default Dashboard;
