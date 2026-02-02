"use client";

import { useState, useEffect } from "react";
import EmptyState from "./EmptyState";
import PaymentTableHeader from "./PaymentTableHeader";
import PaymentTable from "./PaymentTable";
import Pagination from "./Pagination";
import Modals from "./Modals";
import { Payment, ModalType } from "./types";
import { ApiClient } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface PaymentReceivedProps {
  onCreateInvoice: () => void;
}

const PaymentReceived = ({ onCreateInvoice }: PaymentReceivedProps) => {
  const { user } = useAuth();
  const [hasPayments, setHasPayments] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const totalPages = 99;

  useEffect(() => {
    const loadPaidInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await ApiClient.getAllUserInvoices(user?.id);
        
        if (response.status === 200 && response.data) {
          // Filter only PAID invoices and transform to Payment format
          const paidInvoices = response.data
            .filter((invoice: any) => invoice.status === 'PAID')
            .map((invoice: any) => ({
              id: invoice.id,
              date: new Date(invoice.creationDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: '2-digit' 
              }),
              clientName: invoice.billTo?.fullName || invoice.billTo?.businessName || 'Unknown Client',
              invoiceId: invoice.invoiceNumber || `INV-${invoice.id}`,
              status: 'Paid' as const,
              dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: '2-digit' 
              }),
              amount: invoice.totalDue || 0,
              balanceDue: 0, // Paid invoices have 0 balance due
            }));
          
          setPayments(paidInvoices);
          setHasPayments(paidInvoices.length > 0);
        } else {
          setHasPayments(false);
        }
      } catch (error) {
        console.error('Error loading invoices:', error);
        setHasPayments(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadPaidInvoices();
  }, [user?.id]);

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
    // TODO: Implement email functionality
  };

  const handleGetLink = (payment: Payment) => {
    // TODO: Implement get link functionality
  };

  const handleDelete = (payment: Payment) => {
    setPayments(payments.filter(p => p.id !== payment.id));
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto mb-[200px] p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
        </div>
      </div>
    );
  }

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
              View and manage all payments received from your invoices.
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
