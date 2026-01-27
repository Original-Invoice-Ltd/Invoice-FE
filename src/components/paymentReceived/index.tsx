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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(payments.length / itemsPerPage);
  
  // Get current page payments
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = payments.slice(startIndex, endIndex);

  // Load all invoices from API using userId
  useEffect(() => {
    const loadInvoices = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await ApiClient.getAllUserInvoicesByUserId(user.id);
        
        if (response.status === 200 && response.data) {
          // Transform all invoices to Payment format
          const allInvoices = (response.data as any[]).map((invoice: any) => ({
            id: invoice.id,
            date: new Date(invoice.creationDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: '2-digit' 
            }),
            clientName: invoice.billTo?.fullName || invoice.billTo?.businessName || 'Unknown Client',
            invoiceId: invoice.invoiceNumber || `INV-${invoice.id}`,
            status: invoice.status === 'PAID' ? 'Paid' as const : 
                   invoice.status === 'OVERDUE' ? 'Overdue' as const : 
                   'Unpaid' as const,
            dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: '2-digit' 
            }),
            amount: invoice.totalDue || 0,
            balanceDue: invoice.status === 'PAID' ? 0 : (invoice.totalDue || 0),
          }));
          
          setPayments(allInvoices);
          setHasPayments(allInvoices.length > 0);
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

    loadInvoices();
  }, [user?.id]);

  const handleMarkPaid = async (payment: Payment) => {
    setSelectedPayment(payment);
    setModalType('markPaid');
  };

  const handleRevertStatus = (payment: Payment) => {
    setSelectedPayment(payment);
    setModalType('revertStatus');
  };

  const handleConfirmMarkPaid = async () => {
    if (selectedPayment) {
      try {
        // Call API to mark invoice as paid
        const response = await ApiClient.markInvoiceAsPaid(selectedPayment.id);
        
        if (response.status === 200) {
          // Update local state
          setPayments(payments.map(p => 
            p.id === selectedPayment.id 
              ? { ...p, status: 'Paid' as const, balanceDue: 0 }
              : p
          ));
          setModalType('paymentSuccess');
        } else {
          console.error('Failed to mark invoice as paid:', response.error);
          setModalType(null);
        }
      } catch (error) {
        console.error('Error marking invoice as paid:', error);
        setModalType(null);
      }
    }
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
            payments={currentPayments}
            onMarkPaid={handleMarkPaid}
            onRevertStatus={handleRevertStatus}
            onEmail={handleEmail}
            onGetLink={handleGetLink}
            onDelete={handleDelete}
          />
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
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
