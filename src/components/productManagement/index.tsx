"use client";

import { useState } from "react";
import { Search, Plus, X, Check, MoreVertical, ChevronDown, Trash2 } from "lucide-react";

interface Product {
    id: string;
    itemName: string;
    category: "Product" | "Service";
    description: string;
    unit: string;
    unitPrice: string;
    tax: string;
    lastUpdated: string;
}

const ProductManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        itemType: "",
        itemName: "",
        description: "",
        unit: "",
        unitPrice: "",
        currency: "USD",
        tax: "",
    });

    const handleSaveProduct = () => {
        const newProduct: Product = {
            id: `${products.length + 1}`,
            itemName: formData.itemName,
            category: formData.itemType as "Product" | "Service",
            description: formData.description,
            unit: formData.unit,
            unitPrice: `₦${formData.unitPrice}`,
            tax: formData.tax,
            lastUpdated: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        };

        setProducts([...products, newProduct]);
        setShowAddModal(false);
        setShowSuccessModal(true);

        setFormData({
            itemType: "",
            itemName: "",
            description: "",
            unit: "",
            unitPrice: "",
            currency: "USD",
            tax: "",
        });
    };

    const handleDeleteProduct = () => {
        if (selectedProduct) {
            setProducts(products.filter(p => p.id !== selectedProduct));
            setShowDeleteModal(false);
            setShowDeleteSuccessModal(true);
            setSelectedProduct(null);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="max-w-[1108px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="font-semibold text-[20px] leading-[120%] text-[#000000]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                            Products
                        </h1>
                        <p className="text-[14px] leading-[140%] text-[#333436]" style={{ fontFamily: 'Inter Tight, sans-serif', letterSpacing: '0.01em' }}>
                            Manage the items you sell and reuse them easily when creating invoices.
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[139px] h-12 px-4 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>

                {/* Conditional Rendering: Empty State or Table */}
                {products.length === 0 ? (
                    /* Empty State - width: 1108px; height: 372px; border-radius: 8px; padding: 16px 14px 32px 14px; gap: 18px */
                    <div className="w-full max-w-[1108px] bg-white rounded-lg border border-[#E4E7EC]" style={{ minHeight: '372px' }}>
                        {/* Header with search and sort */}
                        <div className="pt-4 pr-[14px] pl-[14px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[18px] border-b border-[#E4E7EC] pb-4">
                            <h2 className="text-lg font-semibold text-[#101828]">All Products</h2>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
                                    <input
                                        type="text"
                                        placeholder="search clients"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                    />
                                </div>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] hover:bg-[#F9FAFB] whitespace-nowrap">
                                    Sort by
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Empty state content */}
                        <div className="px-[14px] pb-8 pt-6 sm:pt-12 flex flex-col items-center justify-center">
                            <div className="mb-6">
                                <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 sm:w-[108px] sm:h-[108px]">
                                    <circle cx="54" cy="54" r="54" fill="#F2F4F7"/>
                                    <path d="M54 34V54M54 54V74M54 54H74M54 54H34" stroke="#98A2B3" strokeWidth="4" strokeLinecap="round"/>
                                    <circle cx="54" cy="54" r="30" stroke="#D0D5DD" strokeWidth="2"/>
                                </svg>
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-[#101828] mb-2 text-center">No products or services added</h3>
                            <p className="text-sm sm:text-base text-[#667085] mb-6 text-center max-w-md px-4">
                                Add your first item with a name, description, and price to make invoicing faster.
                            </p>
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-[#EFF8FF] transition-colors"
                            >
                                <Plus size={20} />
                                Add Item
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white rounded-lg border border-[#E4E7EC]">
                        {/* Header with search and sort */}
                        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E4E7EC]">
                            <h2 className="text-lg font-semibold text-[#101828]">All Products</h2>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative flex-1 sm:w-64">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
                                    <input
                                        type="text"
                                        placeholder="search clients"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                    />
                                </div>
                                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] hover:bg-[#F9FAFB] whitespace-nowrap">
                                    Sort by
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Table - Desktop */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F9FAFB] border-b border-[#E4E7EC]">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Item Name</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Category</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Description</th>
                                        <th className="text-center px-6 py-3 text-xs font-medium text-[#667085]">Unit</th>
                                        <th className="text-center px-6 py-3 text-xs font-medium text-[#667085]">Unit Price</th>
                                        <th className="text-center px-6 py-3 text-xs font-medium text-[#667085]">Tax</th>
                                        <th className="text-center px-6 py-3 text-xs font-medium text-[#667085]">Last Updated</th>
                                        <th className="text-right px-6 py-3 text-xs font-medium text-[#667085]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                                            <td className="px-6 py-4 text-sm text-[#101828]">{product.itemName}</td>
                                            <td className="px-6 py-4 text-sm text-[#101828]">{product.category}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085]">{product.description}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085] text-center">{product.unit}</td>
                                            <td className="px-6 py-4 text-sm text-[#101828] text-center">{product.unitPrice}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085] text-center">{product.tax}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085] text-center">{product.lastUpdated}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => {
                                                        setSelectedProduct(product.id);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    className="text-[#667085] hover:text-[#101828]"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-[#E4E7EC]">
                            {products.map((product) => (
                                <div key={product.id} className="p-4 hover:bg-[#F9FAFB]">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-semibold text-[#101828] mb-1">{product.itemName}</h3>
                                            <span className="inline-block px-2 py-1 text-xs bg-[#F2F4F7] text-[#344054] rounded">{product.category}</span>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setSelectedProduct(product.id);
                                                setShowDeleteModal(true);
                                            }}
                                            className="text-[#667085] hover:text-[#101828] ml-2"
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-[#667085] mb-3">{product.description}</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-[#667085]">Unit:</span>
                                            <span className="ml-1 text-[#101828]">{product.unit}</span>
                                        </div>
                                        <div>
                                            <span className="text-[#667085]">Price:</span>
                                            <span className="ml-1 text-[#101828] font-medium">{product.unitPrice}</span>
                                        </div>
                                        <div>
                                            <span className="text-[#667085]">Tax:</span>
                                            <span className="ml-1 text-[#101828]">{product.tax}</span>
                                        </div>
                                        <div>
                                            <span className="text-[#667085]">Updated:</span>
                                            <span className="ml-1 text-[#101828]">{product.lastUpdated}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add New Item Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(197, 199, 202, 0.90)' }}>
                        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-xl font-semibold text-[#000000]">Add New Item</h2>
                                    <button onClick={() => setShowAddModal(false)} className="text-[#667085] hover:text-[#101828]">
                                        <X size={24} />
                                    </button>
                                </div>
                                <p className="text-sm text-[#333436] mb-6">
                                    Create a product or service you can reuse in your invoices.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <span className="text-[#000000]">Item Type</span>
                                            <span className="text-[#F04438]">*</span>
                                        </label>
                                        <select
                                            value={formData.itemType}
                                            onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        >
                                            <option value="">Select item type</option>
                                            <option value="Product">Product</option>
                                            <option value="Service">Service</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <span className="text-[#000000]">Item Name</span>
                                            <span className="text-[#F04438]">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter item name"
                                            value={formData.itemName}
                                            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#000000] mb-2">Description</label>
                                        <textarea
                                            placeholder="Enter details about product/service"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <span className="text-[#000000]">Unit</span>
                                                <span className="text-[#F04438]">*</span>
                                            </label>
                                            <select
                                                value={formData.unit}
                                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            >
                                                <option value="">Select unit</option>
                                                <option value="pcs">pcs</option>
                                                <option value="project">project</option>
                                                <option value="year">year</option>
                                                <option value="hour">hour</option>
                                                <option value="Bag">Bag</option>
                                                <option value="Bottle">Bottle</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <span className="text-[#000000]">Unit Price</span>
                                                <span className="text-[#F04438]">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="0.00"
                                                    value={formData.unitPrice}
                                                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                                                    className="w-full px-4 py-2 pr-20 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                                />
                                                <select
                                                    value={formData.currency}
                                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm border-none focus:outline-none bg-transparent"
                                                >
                                                    <option value="USD">USD</option>
                                                    <option value="NGN">NGN</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <span className="text-[#000000]">Tax</span>
                                            <span className="text-[#F04438]">*</span>
                                        </label>
                                        <select
                                            value={formData.tax}
                                            onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        >
                                            <option value="">Select tax type</option>
                                            <option value="VAT 7.5%">VAT (7.5%)</option>
                                            <option value="WHT 5.0%">WHT (5.0)</option>
                                            <option value="PAYE">PAYE</option>
                                            <option value="None">None</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProduct}
                                        className="px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                                    >
                                        Save Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal - Item Added */}
                {showSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(197, 199, 202, 0.90)' }}>
                        <div className="bg-white rounded-lg w-full max-w-md p-6 mx-4">
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setShowSuccessModal(false)} className="text-[#667085] hover:text-[#101828]">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-[#D1FADF] flex items-center justify-center mb-4">
                                    <Check size={32} className="text-[#12B76A]" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#101828] mb-2">Item added successfully!</h3>
                                <p className="text-sm text-[#667085] mb-6">
                                    You can now use this item when creating invoices.
                                </p>
                                <div className="w-full">
                                    <button
                                        onClick={() => setShowSuccessModal(false)}
                                        className="w-full px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(197, 199, 202, 0.90)' }}>
                        <div className="bg-white rounded-lg w-full max-w-md p-6 mx-4">
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setShowDeleteModal(false)} className="text-[#667085] hover:text-[#101828]">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-[#FEE4E2] flex items-center justify-center mb-4">
                                    <Trash2 size={32} className="text-[#F04438]" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#101828] mb-2">Delete this item?</h3>
                                <p className="text-sm text-[#667085] mb-6">
                                    This action can't be undone. The item will be permanently removed from your list.
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2 border border-[#D0D5DD] text-[#344054] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteProduct}
                                        className="flex-1 px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal - Item Deleted */}
                {showDeleteSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(197, 199, 202, 0.90)' }}>
                        <div className="bg-white rounded-lg w-full max-w-md p-6 mx-4">
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setShowDeleteSuccessModal(false)} className="text-[#667085] hover:text-[#101828]">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-[#D1FADF] flex items-center justify-center mb-4">
                                    <Check size={32} className="text-[#12B76A]" />
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-[#101828] mb-2">Item deleted successfully.</h3>
                                <p className="text-sm text-[#667085] mb-6">
                                    It has been removed from your product list.
                                </p>
                                <div className="w-full">
                                    <button
                                        onClick={() => setShowDeleteSuccessModal(false)}
                                        className="w-full px-4 py-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
