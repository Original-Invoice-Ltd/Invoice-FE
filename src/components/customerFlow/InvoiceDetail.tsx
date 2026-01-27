"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Upload, Send, FileDown } from "lucide-react";
import UploadReceiptModal from "./UploadReceiptModal";
import { ApiClient } from "@/lib/api";

interface InvoiceDetailProps {
  invoiceId: string;
  onBack?: () => void;
}

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ invoiceId, onBack }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await ApiClient.getInvoiceDetail(invoiceId);
        
        if (response.status === 200 && response.data) {
          setInvoice(response.data);
        } else {
          setError(response.error || 'Failed to load invoice');
        }
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError('An error occurred while loading the invoice');
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleUploadReceipt = () => {
    setIsUploadModalOpen(true);
  };

  const handleSend = () => {
    console.log("Send invoice");
  };

  const handleDownloadPDF = () => {
    console.log("Download PDF");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    const symbol = currency === 'NGN' ? '₦' : currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'OVERDUE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Invoice not found'}</p>
    
          <div>Invoice not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header - Desktop */}
      <div className="hidden md:flex justify-between items-center p-6 bg-white border-b border-gray-200">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <button
          onClick={handleUploadReceipt}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          <Upload className="w-5 h-5" />
          Upload Receipt
        </button>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <button onClick={handleBack} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <button
          onClick={handleUploadReceipt}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Receipt
        </button>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-12 relative overflow-hidden">
          {/* Watermark */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5"
            style={{ transform: "rotate(-45deg)" }}
          >
            <div className="text-6xl font-bold text-gray-400">
              www.originalinvoice.com
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex justify-end mb-4">
            <span className={`${getStatusColor(invoice.status)} px-4 py-1 rounded-full text-sm font-medium`}>
              {invoice.status || 'Unpaid'}
            </span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
            <div>
              {invoice.billFrom?.logo ? (
                <img src={invoice.billFrom.logo} alt="Logo" className="h-16 mb-8" />
              ) : (
                <div className="text-4xl font-bold mb-8">Logo</div>
              )}
              <div className="text-sm">
                <div className="font-semibold mb-2">Bill To</div>
                <div className="text-gray-700">
                  {invoice.billTo?.businessName || invoice.billTo?.fullName || 'N/A'}
                </div>
                <div className="text-gray-600">
                  {invoice.billTo?.address || invoice.billTo?.country || ''}
                </div>
                <div className="text-gray-600">
                  {invoice.billTo?.email || ''}
                </div>
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-3xl font-bold mb-6">INVOICE</h1>
              <div className="text-sm space-y-2">
                <div className="font-semibold">Bill From</div>
                <div className="text-gray-700">
                  {invoice.billFrom?.businessName || invoice.billFrom?.fullName || 'N/A'}
                </div>
                <div className="text-gray-600">
                  {invoice.billFrom?.address || invoice.billFrom?.country || ''}
                </div>
                <div className="text-gray-600">
                  {invoice.billFrom?.email || ''}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-700">
                {invoice.invoiceNumber || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Balance Due</div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(invoice.totalDue || 0, invoice.currency)}
              </div>
            </div>
          </div>

          {/* Date Info Bar */}
          <div className="bg-blue-600 text-white rounded-lg p-4 mb-6 grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm opacity-90">Invoice Date</div>
              <div className="font-semibold">{invoice.creationDate ? formatDate(invoice.creationDate) : 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Payment Terms</div>
              <div className="font-semibold">
                {invoice.paymentTerms || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-90">Due Date</div>
              <div className="font-semibold">{invoice.dueDate ? formatDate(invoice.dueDate) : 'N/A'}</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-3 text-sm font-semibold text-gray-700">
                    #
                  </th>
                  <th className="text-left py-3 text-sm font-semibold text-gray-700">
                    Item Detail
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700">
                    Qty
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700">
                    Rate
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item: any, index: number) => (
                    <tr key={item.id || index} className="border-b border-gray-200">
                      <td className="py-4 text-gray-700">{index + 1}</td>
                      <td className="py-4 text-gray-700">{item.itemName || item.description || 'N/A'}</td>
                      <td className="py-4 text-right text-gray-700">{item.quantity || 0}</td>
                      <td className="py-4 text-right text-gray-700">{formatCurrency(item.rate || 0, invoice.currency)}</td>
                      <td className="py-4 text-right text-gray-700">
                        {formatCurrency(item.amount || 0, invoice.currency)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Sub Total</span>
                <span>{formatCurrency(invoice.subTotal || 0, invoice.currency)}</span>
              </div>
              {invoice.taxes && invoice.taxes.length > 0 && invoice.taxes.map((tax: any, index: number) => (
                <div key={index} className="flex justify-between text-gray-700">
                  <span>{tax.name} ({tax.rate}%)</span>
                  <span>{formatCurrency(tax.amount || 0, invoice.currency)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t pt-2">
                <span>Total</span>
                <span>{formatCurrency(invoice.totalDue || 0, invoice.currency)}</span>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-lg flex justify-between items-center font-bold">
                <span>Balance Due</span>
                <span>{formatCurrency(invoice.totalDue || 0, invoice.currency)}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          {invoice.signature && (
            <div className="mb-6">
              <div className="font-semibold text-gray-900 mb-2">Signature</div>
              <div
                className="text-3xl text-gray-700"
                style={{ fontFamily: "cursive" }}
              >
                {invoice.signature}
              </div>
            </div>
          )}

          {/* Note */}
          {invoice.note && (
            <div className="mb-6">
              <div className="font-semibold text-gray-900 mb-2">Note</div>
              <p className="text-gray-600 text-sm">{invoice.note}</p>
            </div>
          )}

          {/* Terms of Payment */}
          {invoice.termsOfPayment && (
            <div className="mb-6">
              <div className="font-semibold text-gray-900 mb-2">
                Terms of Payment
              </div>
              <p className="text-gray-600 text-sm">
                {invoice.termsOfPayment}
              </p>
            </div>
          )}

          {/* Payment Method */}
          {invoice.bankDetails && (
            <div>
              <div className="font-semibold text-gray-900 mb-3">
                Payment Method: Bank Transfer
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Bank Name:</div>
                  <div className="font-semibold text-gray-900">
                    {invoice.bankDetails.bankName || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Account Number</div>
                  <div className="font-semibold text-gray-900">
                    {invoice.bankDetails.accountNumber || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Account Name</div>
                  <div className="font-semibold text-gray-900">
                    {invoice.bankDetails.accountName || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3">
          <button
            onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50"
          >
            <FileDown className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        {/* Action Buttons - Desktop */}
        <div className="hidden md:flex justify-end gap-4 mt-6 mb-8">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            <FileDown className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            <Send className="w-5 h-5" />
            Share
          </button>
        </div>
      </div>

      {/* Upload Receipt Modal */}
      <UploadReceiptModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        invoiceId={invoiceId}
      />
    </div>
  );
};

export default InvoiceDetail;
