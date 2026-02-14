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
        return {
          width: '40px',
          height: '24px',
          background: '#E7FEF8',
          border: '0.5px solid #40C4AA',
          borderRadius: '6px',
          padding: '8px',
          gap: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        };
      case 'Pending':
        return {
          width: '60px',
          height: '24px',
          background: '#FFF6E0',
          border: '0.5px solid #FFBD4C',
          borderRadius: '6px',
          padding: '8px',
          gap: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        };
      case 'Overdue':
        return {
          width: '63px',
          height: '24px',
          background: '#FEF3F2',
          border: '0.5px solid #F04438',
          borderRadius: '6px',
          padding: '8px',
          gap: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        };
      default:
        return {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        };
    }
  };

  return (
    <div className="bg-white rounded-[8px] pt-4 pr-[14px] pl-[14px] pb-4 min-h-[250px]" style={{ gap: '18px' }}>
      <div className="flex items-center justify-between h-[38px] mb-[18px]">
        <h3 className="text-[18px] font-semibold text-[#000000] leading-[140%] tracking-[0.01em]" 
            style={{ fontFamily: 'Lato', height: '38px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {t('recent_invoice')}
        </h3>
        <div className="relative w-[344px] h-[38px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B3B5]" size={18} />
          <input
            type="text"
            placeholder={t('search_invoice')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-full pl-10 pr-4 border border-[#D0D5DD] rounded-lg text-[16px] 
                     focus:outline-none focus:ring-1 focus:ring-[#2F80ED] leading-[140%] tracking-[0.01em]
                     placeholder:text-[#B0B3B5]"
            style={{ fontFamily: 'Lato' }}
          />
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center text-[#667085]">
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr>
                <th className="text-left h-[40px] px-4 text-[12px] font-medium text-[#667085] bg-[#F8F8FA] 
                              border-r border-b border-[#E5E5E5]" 
                    style={{ width: '163.33px', gap: '12px' }}>
                  {t('date')}
                </th>
                <th className="text-left h-[40px] px-4 text-[12px] font-medium text-[#667085] bg-[#F8F8FA] 
                              border-r border-b border-[#E5E5E5]" 
                    style={{ width: '163.33px', gap: '12px' }}>
                  {t('client_name')}
                </th>
                <th className="text-left h-[40px] px-4 text-[12px] font-medium text-[#667085] bg-[#F8F8FA] 
                              border-r border-b border-[#E5E5E5]" 
                    style={{ width: '163.33px', gap: '12px' }}>
                  {t('invoice_id')}
                </th>
                <th className="text-left h-[40px] px-4 text-[12px] font-medium text-[#667085] bg-[#F8F8FA] 
                              border-r border-b border-[#E5E5E5]" 
                    style={{ width: '163.33px', gap: '12px' }}>
                  {t('status')}
                </th>
                <th className="text-left h-[40px] px-4 text-[12px] font-medium text-[#667085] bg-[#F8F8FA] 
                              border-r border-b border-[#E5E5E5]" 
                    style={{ width: '163.33px', gap: '12px' }}>
                  {t('due_date')}
                </th>
                <th className="text-left h-[40px] px-4 text-[12px] font-medium text-[#667085] bg-[#F8F8FA] 
                              border-r border-b border-[#E5E5E5]" 
                    style={{ width: '163.33px', gap: '12px' }}>
                  {t('amount')}
                </th>
                <th className="text-left h-[40px] px-4 text-[12px] font-medium text-[#667085] bg-[#F8F8FA] 
                              border-r border-b border-[#E5E5E5] whitespace-nowrap" 
                    style={{ width: '100px', gap: '12px' }}>
                  {t('balance_due')}
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-[#E5E5E5] hover:bg-[#F9FAFB]">
                  <td className="py-4 px-4 text-[14px] text-[#344054] border-r border-[#E5E5E5]">{invoice.date}</td>
                  <td className="py-4 px-4 text-[14px] text-[#344054] border-r border-[#E5E5E5]">{invoice.clientName}</td>
                  <td className="py-4 px-4 text-[14px] text-[#344054] border-r border-[#E5E5E5]">{invoice.invoiceId}</td>
                  <td className="py-4 px-4 border-r border-[#E5E5E5]">
                    <span className="text-[12px] font-medium text-[#344054]" style={getStatusStyles(invoice.status)}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[14px] text-[#344054] border-r border-[#E5E5E5]">{invoice.dueDate}</td>
                  <td className="py-4 px-4 text-[14px] text-[#344054] border-r border-[#E5E5E5]">₦{invoice.amount.toLocaleString()}</td>
                  <td className="py-4 px-4 text-[14px] text-[#344054] border-r border-[#E5E5E5]">₦{invoice.balanceDue.toLocaleString()}</td>
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
