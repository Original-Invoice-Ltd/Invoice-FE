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
import { useToast } from "@/hooks/useToast";
import Toast from "../ui/Toast";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

interface PaymentReceivedProps {
  onCreateInvoice: () => void;
}

const PaymentReceived = ({ onCreateInvoice }: PaymentReceivedProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [hasPayments, setHasPayments] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const { showError, hideToast, toast } = useToast()
  const totalPages = 99;

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setIsLoading(true);
        const response = await ApiClient.getAllUserInvoices(user?.id);

        if (response.status === 200 && response.data) {
          // Filter only PAID and PENDING invoices and transform to Payment format
          const paidAndPendingInvoices = response.data
            .filter((invoice: any) => invoice.status === 'PAID' || invoice.status === 'PENDING')
            .map((invoice: any) => ({
              id: invoice.id,
              date: new Date(invoice.creationDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
              }),
              clientName: invoice.billTo?.fullName || invoice.billTo?.businessName || 'Unknown Client',
              invoiceId: invoice.invoiceNumber || `INV-${invoice.id}`,
              status: invoice.status === 'PAID' ? 'Paid' as const : 'Pending' as const,
              dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
              }),
              amount: invoice.totalDue || 0,
              balanceDue: invoice.status === 'PAID' ? 0 : (invoice.totalDue || 0),
            }));

          setPayments(paidAndPendingInvoices);
          setHasPayments(paidAndPendingInvoices.length > 0);
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

    loadPayments();
  }, [user?.id]);

  const handleMarkPaid = (payment: Payment) => {
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
        const response = await ApiClient.markInvoiceAsPaid(selectedPayment.id, "Bank Transfer");

        if (response.status === 200) {
          setPayments(payments.map(p =>
            p.id === selectedPayment.id
              ? { ...p, status: 'Paid' as const, balanceDue: 0 }
              : p
          ));
          setModalType('paymentSuccess');
        } else {
          showError('Failed to mark invoice as paid');
        }
      } catch (error) {
        showError('Failed to mark invoice as paid');
        console.log("Error marking invoice as paid: ", error)
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

  const handleViewReceipt = async (payment: Payment) => {
    try {
      console.log('Viewing receipt for payment:', payment);
      console.log('Invoice ID being sent:', payment.id);
      
      const response = await ApiClient.getPaymentEvidenceUrl(payment.id);
      console.log('Receipt API response:', response);
      
      if (response.status === 200 && response.data) {
        // The API might return the URL directly as a string, or in an object
        const url = typeof response.data === 'string' ? response.data : response.data.url || response.data.evidenceUrl;
        
        if (url) {
          setReceiptUrl(url);
          setShowReceiptModal(true);
        } else {
          showError('No receipt found for this payment');
        }
      } else if (response.status === 403) {
        showError('You do not have permission to view this receipt');
      } else if (response.status === 404) {
        showError('No receipt has been uploaded for this invoice yet');
      } else {
        showError(response.error || 'No receipt found for this payment');
      }
    } catch (error: any) {
      console.error('Full error object:', error);
      
      if (error?.response?.status === 403) {
        showError('You do not have permission to view this receipt');
      } else if (error?.response?.status === 404) {
        showError('No receipt has been uploaded for this invoice yet');
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load receipt';
        showError(errorMessage);
      }
      console.error('Error loading receipt:', error);
    }
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
    <div className="max-w-7xl mx-auto px-6">
      {/* Header Section */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      <div className="mb-2">
        <div className="flex flex-col md:flex-row gap-2 md:gap-0 items-start md:items-center  justify-between">
          <div>
            <h1 className="text-[20px] md:text-[20px] font-semibold text-gray-900">
              Incoming Payments
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and manage all payments received from your invoices.
            </p>
          </div>
          <button
            onClick={onCreateInvoice}
            className="text-white flex gap-4 justify-center md:max-w-[200px] w-full rounded-md font-medium hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center px-4 py-3 bg-[#2F80ED]"
          >
            <Plus size={20} />
            {t('create_invoice')}
          </button>
        </div>
      </div>

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
            onViewReceipt={handleViewReceipt}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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

      {showReceiptModal && receiptUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Payment Receipt</h2>
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setReceiptUrl(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <img 
                src={receiptUrl} 
                alt="Payment Receipt" 
                className="w-full h-auto"
                onError={(e) => {
                  // If image fails to load, try to open as PDF or other file
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const iframe = document.createElement('iframe');
                  iframe.src = receiptUrl;
                  iframe.className = 'w-full h-[70vh]';
                  target.parentElement?.appendChild(iframe);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentReceived;
