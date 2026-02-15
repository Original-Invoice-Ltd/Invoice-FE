'use client';

import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';
import { productCache, Product } from '@/lib/productCache';
import { Plus, Edit, Trash2, Package, Search } from 'lucide-react';
import AddProductModal from '@/components/productManagement/AddProductModal';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';
import { useTranslation } from 'react-i18next';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      if (productCache.isCacheValid()) {
        setProducts(productCache.getProducts());
        setLoading(false);
        return;
      }

      const response = await ApiClient.getAllUserProducts();
      
      if (response.status === 200 && response.data) {
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
        productCache.setProducts(productsData);
      } else {
        setError(response.error || 'Failed to load products');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      const response = await ApiClient.deleteProduct(productToDelete.id);
      
      if (response.status === 200) {
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        productCache.removeProduct(productToDelete.id);
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        setError(response.error || 'Failed to delete product');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Error deleting product:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const handleProductSaved = (savedProduct: Product) => {
    if (editingProduct) {
      // Update existing product
      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
      productCache.updateProduct(savedProduct);
    } else {
      // Add new product
      setProducts(prev => [...prev, savedProduct]);
      productCache.addProduct(savedProduct);
    }
    handleModalClose();
  };

  const filteredProducts = products.filter(product =>
    (product.itemName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return (a.itemName || '').localeCompare(b.itemName || '');
      case "category":
        return (a.category || '').localeCompare(b.category || '');
      case "quantity":
        return (b.quantity || 0) - (a.quantity || 0);
      case "rate":
        return (b.rate || 0) - (a.rate || 0);
      case "amount":
        return (b.amount || 0) - (a.amount || 0);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mb-[200px] p-6">
      <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-4 md:gap-0">
        <div className="flex flex-col justify-between w-full h-full items-start">
          <h1 className="text-[20px] font-semibold text-[#101828] mb-1">{t('products')}</h1>
          <p className="flex md:text-[14px] text-[#667085]">
            {t('manage_products_desc')}
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-5 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-[16px] font-medium whitespace-nowrap"
        >
          <Plus size={20} />
          {t('add_product')}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-[#E4E7EC]">
        <div className="flex items-center justify-between px-3 sm:px-6 py-4 border-b border-[#E4E7EC]">
          <h2 className="text-[0.85rem] md:text-[18px] font-semibold text-[#101828]">{t('all_products')}</h2>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#98A2B3]" size={18} />
              <input
                type="text"
                placeholder={t('search_products')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-[200px] sm:max-w-full sm:w-full pl-10 pr-4 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] text-[#667085] placeholder:text-[#98A2B3] bg-white focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="hidden md:flex px-4 py-2.5 border border-[#D0D5DD] rounded-lg text-[14px] text-[#667085] bg-white focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
            >
              <option value="name">{t('sort_by_name')}</option>
              <option value="category">{t('sort_by_category')}</option>
              <option value="quantity">{t('sort_by_quantity')}</option>
              <option value="rate">{t('sort_by_rate')}</option>
              <option value="amount">{t('sort_by_amount')}</option>
            </select>
          </div>
        </div>

        {sortedProducts.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-[16px] font-semibold text-[#101828] mb-2">
              {searchQuery ? t('no_products_found') : t('no_products_yet')}
            </h3>
            <p className="text-[14px] text-[#667085] mb-6 text-center max-w-md leading-relaxed">
              {searchQuery
                ? t('try_adjusting_search_products')
                : t('add_first_product')
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddProduct}
                className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-[#EFF8FF] transition-colors text-[16px] font-medium"
              >
                <Plus size={20} />
                {t('add_product')}
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-200">
                    {t('product')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-200">
                    {t('category')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-200">
                    {t('quantity')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-200">
                    {t('rate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-200">
                    {t('amount')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.itemName}
                        </div>
                        {product.description && (
                          <div className="text-sm text-gray-500 truncate w-[100px]">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-200">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.category === 'PRODUCT' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-gray-200">
                      {product.quantity || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-gray-200">
                      {product.rate ? `₦${product.rate.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r-2 border-gray-200">
                      {product.amount ? `₦${product.amount.toFixed(2)}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddProductModal
          product={editingProduct}
          onClose={handleModalClose}
          onSave={handleProductSaved}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={t('delete_product')}
        message={`${t('delete_product_confirm')} "${productToDelete?.itemName}"? ${t('product_action_cannot_undone')}`}
        type="product"
        isLoading={deleting}
      />
    </div>
  );
}