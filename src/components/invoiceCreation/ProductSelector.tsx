'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { productCache, Product } from '@/lib/productCache';
import { Plus, Search, Package, X } from 'lucide-react';

interface InvoiceItem {
  id: string;
  productId?: string; // Reference to product if selected from existing
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

interface ProductSelectorProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

export default function ProductSelector({ items, onItemsChange }: ProductSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      // Check cache first
      if (productCache.isCacheValid()) {
        setProducts(productCache.getProducts());
        return;
      }

      const response = await ApiClient.getAllUserProducts();
      
      if (response.status === 200 && response.data) {
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
        productCache.setProducts(productsData);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addProductToInvoice = (product: Product) => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      productId: product.id,
      itemName: product.itemName,
      category: product.category,
      description: product.description,
      quantity: 1, // Default quantity
      rate: product.rate || 0,
      amount: product.rate || 0,
      taxes: product.taxes?.map(tax => ({
        id: tax.id,
        name: tax.name,
        taxType: tax.taxType,
        rate: tax.baseTaxRate,
        amount: ((product.rate || 0) * tax.baseTaxRate) / 100
      })) || [],
      totalTaxAmount: product.totalTaxAmount || 0,
      amountWithTax: product.amountWithTax || product.rate || 0
    };

    onItemsChange([...items, newItem]);
    setShowProductModal(false);
  };

  const addManualItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      itemName: '',
      category: 'PRODUCT',
      quantity: 1,
      rate: 0,
      amount: 0,
      taxes: [],
      totalTaxAmount: 0,
      amountWithTax: 0
    };

    onItemsChange([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        
        // Recalculate amounts when quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
          
          // Recalculate tax amounts
          if (updated.taxes && updated.taxes.length > 0) {
            updated.taxes = updated.taxes.map(tax => ({
              ...tax,
              amount: (updated.amount * tax.rate) / 100
            }));
            updated.totalTaxAmount = updated.taxes.reduce((sum, tax) => sum + tax.amount, 0);
          }
          
          updated.amountWithTax = updated.amount + updated.totalTaxAmount;
        }
        
        return updated;
      }
      return item;
    });

    onItemsChange(updatedItems);
  };

  const removeItem = (id: string) => {
    onItemsChange(items.filter(item => item.id !== id));
  };

  const filteredProducts = products.filter(product =>
    product.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Invoice Items</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProductModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Package size={16} />
            Add Product
          </button>
          <button
            onClick={addManualItem}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Item/Description</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Qty</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Rate</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Amount</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Tax</th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">Total</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-3 px-2">
                  <div>
                    <input
                      type="text"
                      value={item.itemName}
                      onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                      placeholder="Item name"
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    )}
                    {item.productId && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 mt-1">
                        <Package size={12} className="mr-1" />
                        From Products
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                  />
                </td>
                <td className="py-3 px-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </td>
                <td className="py-3 px-2 font-medium">
                  ${item.amount.toFixed(2)}
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm">
                    {item.taxes && item.taxes.length > 0 ? (
                      <div>
                        {item.taxes.map((tax, index) => (
                          <div key={tax.id} className="text-xs">
                            {tax.name}: ${tax.amount.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No tax</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-2 font-semibold">
                  ${item.amountWithTax.toFixed(2)}
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No items added yet</p>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setShowProductModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Package size={16} />
              Add Product
            </button>
            <button
              onClick={addManualItem}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>
      )}

      {/* Product Selection Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">Select Products</h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Search */}
              <div className="relative mb-4">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Products Grid */}
              <div className="max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No products found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => addProductToInvoice(product)}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-gray-900 truncate">{product.itemName}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.category === 'PRODUCT' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.category}
                          </span>
                        </div>
                        {product.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">
                            ${product.rate?.toFixed(2) || '0.00'}
                          </span>
                          {product.taxes && product.taxes.length > 0 && (
                            <span className="text-xs text-gray-500">
                              +{product.taxes.length} tax{product.taxes.length > 1 ? 'es' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}