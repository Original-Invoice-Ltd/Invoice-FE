import { Search } from "lucide-react";
import { Invoice } from "./types";

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#ECFDF3] text-[#027A48]';
      case 'Pending':
        return 'bg-[#FFFAEB] text-[#B54708]';
      case 'Overdue':
        return 'bg-[#FEF3F2] text-[#B42318]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-semibold text-[#000000]">Recent Invoice</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
          <input
            type="text"
            placeholder="Search invoice"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#D0D5DD] rounded-lg text-sm 
                     focus:outline-none focus:ring-1 focus:ring-[#2F80ED]"
          />
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center text-[#667085]">
          No invoices found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E4E7EC]">
                <th className="text-left py-3 px-4 text-[12px] font-medium text-[#667085]">Date</th>
                <th className="text-left py-3 px-4 text-[12px] font-medium text-[#667085]">Client Name</th>
                <th className="text-left py-3 px-4 text-[12px] font-medium text-[#667085]">Invoice ID</th>
                <th className="text-left py-3 px-4 text-[12px] font-medium text-[#667085]">Status</th>
                <th className="text-left py-3 px-4 text-[12px] font-medium text-[#667085]">Due Date</th>
                <th className="text-left py-3 px-4 text-[12px] font-medium text-[#667085]">Amount</th>
                <th className="text-left py-3 px-4 text-[12px] font-medium text-[#667085]">Balance Due</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                  <td className="py-4 px-4 text-[14px] text-[#344054]">{invoice.date}</td>
                  <td className="py-4 px-4 text-[14px] text-[#344054]">{invoice.clientName}</td>
                  <td className="py-4 px-4 text-[14px] text-[#344054]">{invoice.invoiceId}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[14px] text-[#344054]">{invoice.dueDate}</td>
                  <td className="py-4 px-4 text-[14px] text-[#344054]">₦{invoice.amount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-[14px] text-[#344054]">₦{invoice.balanceDue.toLocaleString()}</td>
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
