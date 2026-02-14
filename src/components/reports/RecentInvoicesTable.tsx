import { Search } from "lucide-react";
import { Invoice } from "./types";
import { useTranslation } from "react-i18next";

interface RecentInvoicesTableProps {
  invoices: Invoice[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const RecentInvoicesTable = ({ 
  invoices, 
  searchQuery, 
  onSearchChange 
}: RecentInvoicesTableProps) => {
  const { t } = useTranslation();
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#E7FEF8] text-[#40C4AA] border-[#40C4AA]';
      case 'Pending':
        return 'bg-[#FFF6E0] text-[#FFBD4C] border-[#FFBD4C]';
      case 'Overdue':
        return 'bg-[#FEF3F2] text-[#F04438] border-[#F04438]';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E4E7EC] p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-base lg:text-lg font-semibold text-[#101828]">
          {t('recent_invoice')}
        </h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#98A2B3]" size={18} />
          <input
            type="text"
            placeholder={t('search_invoice')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#D0D5DD] rounded-lg text-sm 
                     focus:outline-none focus:ring-2 focus:ring-[#2F80ED] placeholder:text-[#98A2B3]"
          />
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center text-[#667085]">
          {t('no_recent_invoices_available')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-[#E4E7EC]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider border-r-2 border-gray-200">
                  {t('date')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider border-r-2 border-gray-200">
                  {t('client_name')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider border-r-2 border-gray-200">
                  {t('invoice_id')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider border-r-2 border-gray-200">
                  {t('status')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider border-r-2 border-gray-200">
                  {t('due_date')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider border-r-2 border-gray-200">
                  {t('amount')}
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#667085] uppercase tracking-wider">
                  {t('balance_due')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-4 text-sm text-[#101828] border-r-2 border-gray-200">{invoice.date}</td>
                  <td className="px-4 py-4 text-sm text-[#101828] border-r-2 border-gray-200">{invoice.clientName}</td>
                  <td className="px-4 py-4 text-sm text-[#101828] font-mono border-r-2 border-gray-200">{invoice.invoiceId}</td>
                  <td className="px-4 py-4 border-r-2 border-gray-200">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#101828] border-r-2 border-gray-200">{invoice.dueDate}</td>
                  <td className="px-4 py-4 text-sm text-[#101828] font-medium border-r-2 border-gray-200">₦{invoice.amount.toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-[#101828] font-medium">₦{invoice.balanceDue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentInvoicesTable;
