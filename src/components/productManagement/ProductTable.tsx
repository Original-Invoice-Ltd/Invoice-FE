import { MoreVertical } from "lucide-react";
import { Product } from "./types";
import { SearchAndSort } from "./SearchAndSort";

interface ProductTableProps {
    products: Product[];
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onDeleteClick: (productId: string) => void;
}

export const ProductTable = ({ products, searchQuery, onSearchChange, onDeleteClick }: ProductTableProps) => {
    return (
        <div className="bg-white rounded-lg border border-[#E4E7EC]">
            <SearchAndSort searchQuery={searchQuery} onSearchChange={onSearchChange} />

            <div className="overflow-x-auto">
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
                                        onClick={() => onDeleteClick(product.id)}
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
        </div>
    );
};
