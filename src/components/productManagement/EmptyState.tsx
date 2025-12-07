import { Plus } from "lucide-react";
import { SearchAndSort } from "./SearchAndSort";

interface EmptyStateProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onAddItem: () => void;
}

export const EmptyState = ({ searchQuery, onSearchChange, onAddItem }: EmptyStateProps) => {
    return (
        <div className="bg-white rounded-lg border border-[#E4E7EC]">
            <SearchAndSort searchQuery={searchQuery} onSearchChange={onSearchChange} />
            
            <div className="p-12 flex flex-col items-center justify-center">
                <div className="mb-6">
                    
                </div>
                <h3 className="text-lg font-semibold text-[#101828] mb-2">No products or services added</h3>
                <p className="text-[#667085] mb-6 text-center max-w-md">
                    Add your first item with a name, description, and price to make invoicing faster.
                </p>
                <button
                    onClick={onAddItem}
                    className="flex items-center gap-2 px-4 py-2 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-[#EFF8FF] transition-colors"
                >
                
                    Add Item
                </button>
            </div>
        </div>
    );
};
