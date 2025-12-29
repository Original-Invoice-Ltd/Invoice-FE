'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { Product } from '@/lib/productCache';
import { X } from 'lucide-react';

interface Tax {
  id: string;
  name: string;
  taxType: string;
  baseTaxRate: number;
  isActive: boolean;
}

interface AddProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export default function AddProductModal({ product, onClose, onSave }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'PRODUCT',
    description: '',
    quantity: '',
    rate: '',
    amount: '',
    taxIds: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTaxes, setAvailableTaxes] = useState<Tax[]>([]);
  const [loadingTaxes, setLoadingTaxes] = useState(true);

  useEffect(() => {
    loadTaxes();
    
    if (product) {
      setFormData({
        itemName: product.itemName || '',
        category: product.category || 'PRODUCT',
        description: product.description || '',
        quantity: product.quantity?.toString() || '',
        rate: product.rate?.toString() || '',
        amount: product.amount?.toString() || '',
        taxIds: product.taxes?.map(tax => tax.id) || []
      });
    }
  }, [product]);

  const loadTaxes = async () => {
    try {
      setLoadingTaxes(true);
      const response = await ApiClient.getActiveTaxes();
      
      if (response.status === 200 && response.data) {
        setAvailableTaxes(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Error loading taxes:', err);
      setAvailableTaxes([]);
    } finally {
      setLoadingTaxes(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate amount when quantity or rate changes
    if (name === 'quantity' || name === 'rate') {
      const quantity = name === 'quantity' ? parseFloat(value) || 0 : parseFloat(formData.quantity) || 0;
      const rate = name === 'rate' ? parseFloat(value) || 0 : parseFloat(formData.rate) || 0;
      const calculatedAmount = quantity * rate;
      
      setFormData(prev => ({
        ...prev,
        amount: calculatedAmount > 0 ? calculatedAmount.toString() : ''
      }));
    }
  };

  const handleTaxChange = (taxId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      taxIds: checked 
        ? [...prev.taxIds, taxId]
        : prev.taxIds.filter(id => id !== taxId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        itemName: formData.itemName.trim(),
        category: formData.category,
        description: formData.description.trim() || undefined,
        quantity: formData.quantity ? parseInt(formData.quantity) : undefined,
        rate: formData.rate ? parseFloat(formData.rate) : undefined,
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        taxIds: formData.taxIds.length > 0 ? formData.taxIds : undefined
      };

      const response = product 
        ? await ApiClient.updateProduct(product.id, productData)
        : await ApiClient.addProduct(productData);

      if (response.status === 200 || response.status === 201) {
        // For new products, we need to fetch the created product or construct it
        const savedProduct: Product = product 
          ? { ...product, ...productData }
          : { 
              id: Date.now().toString(), // Temporary ID - in real app this would come from server
              ...productData,
              createdAt: new Date().toISOString()
            };
        
        onSave(savedProduct);
      } else {
        setError(response.error || 'Failed to save product');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PRODUCT">Product</option>
                <option value="SERVICE">Service</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter product description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rate ($)
              </label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {!loadingTaxes && availableTaxes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable Taxes
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {availableTaxes.map((tax) => (
                  <label key={tax.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.taxIds.includes(tax.id)}
                      onChange={(e) => handleTaxChange(tax.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {tax.name} ({tax.baseTaxRate}% {tax.taxType})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}