import React, { useState, useMemo } from 'react';
import { InvoiceResponse } from '@/types/invoice';
import InvoiceCard from './InvoiceCard';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface InvoiceListProps {
  invoices: InvoiceResponse[];
  loading: boolean;
  error: string | null;
  onDeleteInvoice: (id: string) => void;
}

type SortField = 'creationDate' | 'dueDate' | 'totalDue' | 'invoiceNumber' | 'status';
type SortOrder = 'asc' | 'desc';

const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  loading,
  error,
  onDeleteInvoice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('creationDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter and sort invoices
  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.billTo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.billTo?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.billTo?.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || 
        invoice.status?.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    // Sort invoices
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'creationDate':
          aValue = new Date(a.creationDate);
          bValue = new Date(b.creationDate);
          break;
        case 'dueDate':
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
          break;
        case 'totalDue':
          aValue = a.totalDue;
          bValue = b.totalDue;
          break;
        case 'invoiceNumber':
          aValue = a.invoiceNumber;
          bValue = b.invoiceNumber;
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [invoices, searchQuery, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />;
  };

  // Get unique statuses for filter dropdown
  const availableStatuses = useMemo(() => {
    const statuses = new Set(invoices.map(invoice => invoice.status?.toLowerCase()).filter(Boolean));
    return Array.from(statuses);
  }, [invoices]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading invoices...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-8">
        <div className="text-center">
          <div className="text-red-600 mb-2">Error loading invoices</div>
          <div className="text-gray-600 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            All Invoices ({invoices.length})
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {availableStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <button
              onClick={() => handleSort('creationDate')}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                sortField === 'creationDate' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Date {getSortIcon('creationDate')}
            </button>
            <button
              onClick={() => handleSort('totalDue')}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                sortField === 'totalDue' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Amount {getSortIcon('totalDue')}
            </button>
            <button
              onClick={() => handleSort('status')}
              className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                sortField === 'status' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Status {getSortIcon('status')}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Grid */}
      <div className="p-6">
        {filteredAndSortedInvoices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">
              {searchQuery || statusFilter !== 'all' 
                ? 'No invoices match your search criteria' 
                : 'No invoices found'}
            </div>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedInvoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoice={invoice}
                onDelete={onDeleteInvoice}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;