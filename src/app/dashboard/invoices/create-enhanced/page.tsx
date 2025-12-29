'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProductSelector from '@/components/invoiceCreation/ProductSelector';
import { ApiClient } from '@/lib/api';
import { clientCache } from '@/lib/clientCache';

interface InvoiceItem {
  id: string;
  productId?: string;
  itemName: string;
  category: string;
  description?: string;
  quantity: number;
  rate: number;
  amount: number;
  taxes?: Array<{
    id: string;
    name: string;
    taxType: string;
    rate: number;
    amount: number;
  }>;
  totalTaxAmount: number;
  amountWithTax: number;
}

interface Client {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  customerType: string;
}

export default function CreateEnhancedInvoicePage() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    title: 'Invoice',
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: '',
    currency: 'USD',
    discount: 0,
    customerNote: '',
    termsAndConditions: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      // Check cache first
      if (clientCache.isCacheValid()) {
        setClients(clientCache.getClients());
        return;
      }

      const response = await ApiClient.getAllUserClients();
      
      if (response.status === 200 && response.data) {
        const clientsData = Array.isArray(response.data) ? response.data : [];
        setClients(clientsData);
        clientCache.setClients(clientsData);
      }
    } catch (err) {
      console.error('Error loading clients:', err);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTotalTax = () => {
    return items.reduce((sum, item) => sum + item.totalTaxAmount, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const totalTax = calculateTotalTax();
    const discount = invoiceData.discount || 0;
    return subtotal + totalTax - discount;
  };

  const handleCreateInvoice = async () => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    setLoading(true);

    try {
      // Prepare invoice data for API
      const invoicePayload = {
        ...invoiceData,
        clientId: selectedClient,
        items: items.map(item => ({
          productId: item.productId,
          itemName: item.itemName,
          category: item.category,
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          taxIds: item.taxes?.map(tax => tax.id) || []
        })),
        subtotal: calculateSubtotal(),
        totalTaxAmount: calculateTotalTax(),
        totalDue: calculateTotal()
      };

      // Here you would call the invoice creation API
      console.log('Creating invoice with data:', invoicePayload);
      
      // For now, just show success message
      alert('Invoice created successfully!');
      
      // Redirect to invoices list
      // router.push('/dashboard/invoices');
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard/invoices" className="p-2 text-blue-600 hover:text-blue-800">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create Invoice (Enhanced)</h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={invoiceData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Date *
                </label>
                <input
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Client Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Bill To</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Client *
              </label>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fullName} - {client.businessName}
                  </option>
                ))}
              </select>
              {clients.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  No clients found. <Link href="/dashboard/clients" className="text-blue-600 hover:underline">Add a client first</Link>
                </p>
              )}
            </div>
          </div>

          {/* Product Selector */}
          <ProductSelector items={items} onItemsChange={setItems} />

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Terms
                </label>
                <select
                  value={invoiceData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select payment terms</option>
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on receipt">Due on receipt</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Note
                </label>
                <textarea
                  value={invoiceData.customerNote}
                  onChange={(e) => handleInputChange('customerNote', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a note for your customer..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={invoiceData.termsAndConditions}
                  onChange={(e) => handleInputChange('termsAndConditions', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add terms and conditions..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Invoice Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Tax</span>
                <span className="font-medium">${calculateTotalTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <div className="flex items-center gap-2">
                  <span>$</span>
                  <input
                    type="number"
                    value={invoiceData.discount}
                    onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Due</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Currency Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Currency</h3>
            <select
              value={invoiceData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="NGN">NGN - Nigerian Naira</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-3">
              <button
                onClick={handleCreateInvoice}
                disabled={loading || !selectedClient || items.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                Save as Draft
              </button>
              <Link
                href="/dashboard/invoices"
                className="block w-full text-center border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}