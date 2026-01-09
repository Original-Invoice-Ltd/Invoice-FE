"use client";

import { useState } from "react";
import EmptyState from "./EmptyState";
import PaymentTableHeader from "./PaymentTableHeader";
import PaymentTable from "./PaymentTable";
import Pagination from "./Pagination";
import Modals from "./Modals";
import { Payment, ModalType } from "./types";

// Mock data for demonstration
const mockPayments: Payment[] = [
  {
    id: "1",
    date: "Oct 25, 2025",
    clientName: "Tech Solutions Ltd",
    invoiceId: "INV-001",
    status: "Paid",
    dueDate: "Nov 25, 2025",
    amount: 5000,
    balanceDue: 0,
  },
  {
    id: "2",
    date: "Oct 23, 2025",
    clientName: "Creative Hub",
    invoiceId: "INV-002",
    status: "Unpaid",
    dueDate: "Nov 23, 2025",
    amount: 3500,
    balanceDue: 3500,
  },
  {
    id: "3",
    date: "Oct 15, 2025",
    clientName: "Global Services",
    invoiceId: "INV-003",
    status: "Overdue",
    dueDate: "Oct 30, 2025",
    amount: 7200,
    balanceDue: 7200,
  },
];

interface PaymentReceivedProps {
  onCreateInvoice: () => void;
}

const PaymentReceived = ({ onCreateInvoice }: PaymentReceivedProps) => {
  const [hasPayments, setHasPayments] = useState(false);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const totalPages = 99;

  const handleMarkPaid = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalType('markPaid');
  };

  const handleRevertStatus = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalType('revertStatus');
  };

  const handleConfirmMarkPaid = () => {
    if (selectedPayment) {
      setPayments(payments.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, status: 'Paid' as const, balanceDue: 0 }
          : p
      ));
    }
    setModalType('paymentSuccess');
  };

  const handleConfirmRevert = () => {
    if (selectedPayment) {
      setPayments(payments.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, status: 'Unpaid' as const, balanceDue: p.amount }
          : p
      ));
    }
    setModalType('revertSuccess');
  };

  const handleEmail = (payment: Payment) => {
    console.log('Email invoice:', payment);
  };

  const handleGetLink = (payment: Payment) => {
    console.log('Get link for:', payment);
  };

  const handleDelete = (payment: Payment) => {
    setPayments(payments.filter(p => p.id !== payment.id));
  };

  return (
    <div className="max-w-7xl mx-auto mb-[200px] p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Payments
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and manage all payments received, pending, or overdue across your invoices.
            </p>
          </div>
          <button
            onClick={onCreateInvoice}
            className="text-white rounded-md font-medium hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center px-4 py-3 bg-[#2F80ED]"
          >
            + Create Invoice
          </button>
        </div>
      </div>

      {/* Main Content */}
      {!hasPayments ? (
        <div className="w-full bg-white rounded-lg border border-[#E4E7EC]" style={{ minHeight: '372px' }}>
          <div className="pt-4 pr-[14px] pl-[14px] flex flex-col sm:flex-row sm:items-center 
          sm:justify-between gap-[18px] border-b border-[#E4E7EC] pb-4">
            <PaymentTableHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
          <EmptyState onViewUnpaid={() => setHasPayments(true)} />
        </div>
      ) : (
        <div className="w-full rounded-lg bg-white p-4">
          <div className="flex flex-col sm:flex-row sm:items-center 
          sm:justify-between gap-[18px] border-b border-[#E4E7EC] pb-4">
            <PaymentTableHeader
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
          
          <PaymentTable
            payments={payments}
            onMarkPaid={handleMarkPaid}
            onRevertStatus={handleRevertStatus}
            onEmail={handleEmail}
            onGetLink={handleGetLink}
            onDelete={handleDelete}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Modals */}
      {modalType && (
        <Modals
          modalType={modalType}
          onClose={() => {
            setModalType(null);
            setSelectedPayment(null);
          }}
          onConfirm={() => {
            if (modalType === 'markPaid') {
              handleConfirmMarkPaid();
            } else if (modalType === 'revertStatus') {
              handleConfirmRevert();
            }
          }}
        />
      )}
    </div>
  );
};

export default PaymentReceived;
