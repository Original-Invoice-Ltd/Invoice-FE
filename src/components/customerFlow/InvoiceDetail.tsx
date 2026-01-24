"use client";

import React, { useState } from "react";
import { ArrowLeft, Upload, Send, FileDown } from "lucide-react";
import UploadReceiptModal from "./UploadReceiptModal";

interface InvoiceItem {
  id: number;
  description: string;
  qty: number;
  rate: number;
  amount: number;
}

interface InvoiceDetailProps {
  onBack?: () => void;
}

const mockInvoiceData = {
  status: "Unpaid",
  invoiceId: "#INV-002",
  balanceDue: "₦590000.00",
  invoiceDate: "07 Nov 2025",
  paymentTerms: "Net 60",
  dueDate: "06 Jan 2026",
  billFrom: {
    name: "Tech Solution Limited",
    location: "Nigeria",
    email: "Techsolutionltd@gmail.com",
  },
  billTo: {
    name: "Joseph Original Invoice",
    location: "Lagos, Nigeria",
    email: "josephoriginal@gmail.com",
  },
  items: [
    {
      id: 1,
      description: "Cooperate Shoes",
      qty: 5,
      rate: 1000,
      amount: 5000,
    },
    {
      id: 2,
      description: "MacBook Pro 2020 Laptop",
      qty: 50000,
      rate: 50000,
      amount: 50000,
    },
  ],
  subTotal: 55000,
  vat: 3750,
  wht: 250,
  total: 59000,
  signature: "Chiamaka",
  note: "Kindly make payments via Paystack or bank transfer using the account details provided. Thank you for choosing us.",
  termsOfPayment:
    "All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.",
  bankDetails: {
    bankName: "Zenith Bank Plc",
    accountNumber: "1234567890",
    accountName: "Original Invoice Demo Ltd",
  },
};

const InvoiceDetail: React.FC<InvoiceDetailProps> = ({ onBack }) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
            <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium">
              {mockInvoiceData.status}
            </span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
            <div>
              <div className="text-4xl font-bold mb-8">Logo</div>
              <div className="text-sm">
                <div className="font-semibold mb-2">Bill To</div>
                <div className="text-gray-700">
                  {mockInvoiceData.billTo.name}
                </div>
                <div className="text-gray-600">
                  {mockInvoiceData.billTo.location}
                </div>
                <div className="text-gray-600">
                  {mockInvoiceData.billTo.email}
                </div>
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-3xl font-bold mb-6">INVOICE</h1>
              <div className="text-sm space-y-2">
                <div className="font-semibold">Bill From</div>
                <div className="text-gray-700">
                  {mockInvoiceData.billFrom.name}
                </div>
                <div className="text-gray-600">
                  {mockInvoiceData.billFrom.location}
                </div>
                <div className="text-gray-600">
                  {mockInvoiceData.billFrom.email}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-700">
                {mockInvoiceData.invoiceId}
              </div>
              <div className="text-sm text-gray-600">Balance Due</div>
              <div className="text-2xl font-bold text-gray-900">
                {mockInvoiceData.balanceDue}
              </div>
            </div>
          </div>

          {/* Date Info Bar */}
          <div className="bg-blue-600 text-white rounded-lg p-4 mb-6 grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm opacity-90">Invoice Date</div>
              <div className="font-semibold">{mockInvoiceData.invoiceDate}</div>
            </div>
            <div>
              <div className="text-sm opacity-90">Payment Terms</div>
              <div className="font-semibold">
                {mockInvoiceData.paymentTerms}
              </div>
            </div>
            <div>
              <div className="text-sm opacity-90">Due Date</div>
              <div className="font-semibold">{mockInvoiceData.dueDate}</div>
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
                {mockInvoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 text-gray-700">{item.id}</td>
                    <td className="py-4 text-gray-700">{item.description}</td>
                    <td className="py-4 text-right text-gray-700">{item.qty}</td>
                    <td className="py-4 text-right text-gray-700">{item.rate}</td>
                    <td className="py-4 text-right text-gray-700">
                      ₦{item.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-full md:w-1/2 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Sub Total</span>
                <span>{mockInvoiceData.subTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>VAT (7.5%)</span>
                <span>{mockInvoiceData.vat.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>WHT (5%)</span>
                <span>{mockInvoiceData.wht}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg border-t pt-2">
                <span>Total</span>
                <span>₦{mockInvoiceData.total.toLocaleString()}</span>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-lg flex justify-between items-center font-bold">
                <span>Balance Due</span>
                <span>₦{mockInvoiceData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Signature */}
          <div className="mb-6">
            <div className="font-semibold text-gray-900 mb-2">Signature</div>
            <div
              className="text-3xl text-gray-700"
              style={{ fontFamily: "cursive" }}
            >
              {mockInvoiceData.signature}
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <div className="font-semibold text-gray-900 mb-2">Note</div>
            <p className="text-gray-600 text-sm">{mockInvoiceData.note}</p>
          </div>

          {/* Terms of Payment */}
          <div className="mb-6">
            <div className="font-semibold text-gray-900 mb-2">
              Terms of Payment
            </div>
            <p className="text-gray-600 text-sm">
              {mockInvoiceData.termsOfPayment}
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <div className="font-semibold text-gray-900 mb-3">
              Payment Method: Bank Transfer
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Bank Name:</div>
                <div className="font-semibold text-gray-900">
                  {mockInvoiceData.bankDetails.bankName}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Account Number</div>
                <div className="font-semibold text-gray-900">
                  {mockInvoiceData.bankDetails.accountNumber}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Account Name</div>
                <div className="font-semibold text-gray-900">
                  {mockInvoiceData.bankDetails.accountName}
                </div>
              </div>
            </div>
          </div>
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
<<<<<<< HEAD
        invoiceId={mockInvoiceData.invoiceId.replace('#', '')}
=======
>>>>>>> 1586db6e7eef37b433fbf1dff6b1db7e827cec22
      />
    </div>
  );
};

export default InvoiceDetail;
