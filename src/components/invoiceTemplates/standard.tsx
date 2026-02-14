'use client';

import React from 'react';
import { Edit, Download, Mail, Send, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/lib/currencyFormatter';

interface InvoiceItem {
  id: number;
  detail: string;
  qty: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  balanceDue: number;
  invoiceDate: string;
  terms: string;
  dueDate: string;
  billFrom: {
    name: string;
    location: string;
    email: string;
  };
  billTo: {
    name: string;
    location: string;
    email: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  vat: number;
  wht: number;
  total: number;
  signature?: string;
  note?: string;
  termsOfPayment?: string;
  paymentMethod: {
    type: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
}

const defaultInvoiceData: InvoiceData = {
  invoiceNumber: '#INV-0002',
  balanceDue: 59000.00,
  invoiceDate: '07 Nov 2025',
  terms: 'Net 60',
  dueDate: '06 Jan 2026',
  billFrom: {
    name: 'Godiya Veronica',
    location: 'Nigeria',
    email: 'jamesjoseph@gmail.com',
  },
  billTo: {
    name: 'Joseph Original Invoice',
    location: 'Lagos, Nigeria',
    email: 'josephoriginal@gmail.com',
  },
  items: [
    { id: 1, detail: 'Cooperate Shoes', qty: 5, rate: 1000, amount: 5000 },
    { id: 2, detail: 'MacBook Pro 2020 Laptop', qty: 50000, rate: 50000, amount: 50000 },
    { id: 3, detail: 'Apple Watch', qty: 50000, rate: 50000, amount: 50000 },
  ],
  subtotal: 55000,
  vat: 3750,
  wht: 250,
  total: 59000,
  signature: 'Veronica',
  note: 'Kindly make payments via Paystack or bank transfer using the account details provided. Thank you for choosing us.',
  termsOfPayment: 'All payments should be made in the currency stated above. Bank charges are the responsibility of the payer.',
  paymentMethod: {
    type: 'Bank Transfer',
    bankName: 'Zenith Bank Plc',
    accountNumber: '1234567890',
    accountName: 'Original Invoice Demo Ltd',
  },
};

export default function StandardInvoiceTemplate({ data = defaultInvoiceData }: { data?: InvoiceData }) {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:py-6 sm:px-6 lg:px-8 relative">
      {/* Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div 
          className="text-blue-100 text-4xl sm:text-6xl font-bold opacity-10 transform rotate-[-45deg] select-none"
          style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}
        >
          www.originalinvoice.com
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Action Buttons - Top Right */}
        <div className="flex justify-end gap-2 sm:gap-3 mb-6 sm:mb-8">
          <button className="px-3 py-2 sm:px-4 sm:py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-blue-600">
            <Edit className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">{t('edit')}</span>
          </button>
          <button className="px-3 py-2 sm:px-4 sm:py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 text-blue-600">
            <Download className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">{t('download_pdf')}</span>
          </button>
          <button className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span className="text-sm">{t('email')} {t('invoice')}</span>
          </button>
        </div>

        {/* Logo - Centered */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-3xl sm:text-4xl font-bold text-gray-900">{t('logo')}</div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">{t('invoice').toUpperCase()}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('bill_from')}</h3>
            <p className="text-sm text-gray-900">{data.billFrom.name}</p>
            <p className="text-sm text-gray-600">{data.billFrom.location}</p>
            <p className="text-sm text-gray-600">{data.billFrom.email}</p>
          </div>

          {/* Bill To - Right */}
          <div className="lg:text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('bill_to')}</h3>
            <p className="text-sm text-gray-900">{data.billTo.name}</p>
            <p className="text-sm text-gray-600">{data.billTo.location}</p>
            <p className="text-sm text-gray-600">{data.billTo.email}</p>
          </div>
        </div>

        {/* Invoice Meta Information */}
        <div className="mb-6 sm:mb-8">
          <div className="grid grid-cols-2 gap-y-2 text-sm max-w-md lg:max-w-full lg:ml-auto lg:w-80">
            <span className="text-gray-600">{t('invoice')}</span>
            <span className="text-right text-gray-900">{data.invoiceNumber}</span>
            <span className="text-gray-600">{t('invoice_date')}</span>
            <span className="text-right text-gray-900">{data.invoiceDate}</span>
            <span className="text-gray-600">{t('payment_terms')}</span>
            <span className="text-right text-gray-900">{data.terms}</span>
            <span className="text-gray-600">{t('due_date')}</span>
            <span className="text-right text-gray-900">{data.dueDate}</span>
          </div>
        </div>

        <div className="mb-6 sm:mb-8 overflow-x-auto w-full">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="text-left  text-nowrap py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700 w-12">#</th>
                <th className="text-left  text-nowrap py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700">{t('item_detail')}</th>
                <th className="text-right text-nowrap py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700 w-16 sm:w-20">{t('qty')}</th>
                <th className="text-right text-nowrap py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700 w-20 sm:w-24">{t('rate')}</th>
                <th className="text-right text-nowrap py-3 px-3 text-xs sm:text-sm font-semibold text-gray-700 w-24 sm:w-32">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="py-3 px-3 text-xs sm:text-sm text-gray-700">{item.id}</td>
                  <td className="py-3 px-3 text-xs sm:text-sm text-gray-900">{item.detail}</td>
                  <td className="py-3 px-3 text-xs sm:text-sm text-gray-700 text-right">{item.qty.toLocaleString()}</td>
                  <td className="py-3 px-3 text-xs sm:text-sm text-gray-700 text-right">{item.rate.toLocaleString()}</td>
                  <td className="py-3 px-3 text-xs sm:text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary - Right Aligned */}
        <div className="flex justify-end mb-6 sm:mb-8">
          <div className="w-full sm:w-80 space-y-2">
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-600">{t('sub_total')}</span>
              <span className="text-gray-900">{formatCurrency(data.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-600">VAT (7.5%)</span>
              <span className="text-gray-900">{data.vat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-600">WHT (5%)</span>
              <span className="text-gray-900">{data.wht.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-t border-gray-200 pt-2">
              <span className="text-gray-700 font-semibold">Total</span>
              <span className="text-gray-900 font-bold">₦{data.total.toLocaleString()}</span>
            </div>
            
            {/* Balance Due Highlight */}
            <div className="bg-blue-100 rounded-lg px-4 py-3 flex justify-between items-center">
              <span className="text-gray-800 font-semibold">Balance Due</span>
              <span className="text-gray-900 font-bold">₦{data.balanceDue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="space-y-6 pt-6 border-t border-gray-200">
          {/* Signature */}
          {data.signature && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('signature')}</h3>
              <div className="text-2xl font-signature italic text-gray-800" style={{ fontFamily: 'cursive' }}>
                {data.signature}
              </div>
            </div>
          )}

          {/* Note */}
          {data.note && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('note')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{data.note}</p>
            </div>
          )}

          {/* Terms of Payment */}
          {data.termsOfPayment && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('terms_of_payment')}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{data.termsOfPayment}</p>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('payment_method')}: {data.paymentMethod.type}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between sm:block">
                <span className="text-gray-600">{t('bank_name')}:</span>
                <span className="text-gray-900 sm:ml-0 ml-2">{data.paymentMethod.bankName}</span>
              </div>
              <div className="flex justify-between sm:block">
                <span className="text-gray-600">{t('account_number')}:</span>
                <span className="text-gray-900 sm:ml-0 ml-2">{data.paymentMethod.accountNumber}</span>
              </div>
              <div className="flex justify-between sm:block sm:col-span-2">
                <span className="text-gray-600">{t('account_name')}:</span>
                <span className="text-gray-900 sm:ml-0 ml-2">{data.paymentMethod.accountName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Send Button - Bottom Right */}
        <div className="flex justify-end mt-8">
          <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium">
            <Send className="w-5 h-5" />
            <span>{t('send')}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
