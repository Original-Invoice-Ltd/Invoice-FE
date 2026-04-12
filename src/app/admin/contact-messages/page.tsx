'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, MoreVertical, Trash2, Loader2, Search, X, Calendar } from 'lucide-react';

interface ContactMessage {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  agreeToComms: boolean;
}

export default function ContactMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, statusFilter, searchQuery, startDate, endDate]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/contact?page=${currentPage}&size=10`;
      if (statusFilter) url += `&status=${statusFilter}`;
      if (searchQuery) {
        // Send search query to both name and email params
        url += `&name=${encodeURIComponent(searchQuery)}`;
        url += `&email=${encodeURIComponent(searchQuery)}`;
      }
      if (startDate) url += `&startDate=${startDate}T00:00:00`;
      if (endDate) url += `&endDate=${endDate}T23:59:59`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMessages(result.data.content);
        setTotalPages(result.data.totalPages);
        setTotalItems(result.data.totalItems);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
  };

  const hasActiveFilters = statusFilter || searchQuery || startDate || endDate;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      NEW: 'bg-blue-100 text-blue-800',
      READ: 'bg-yellow-100 text-yellow-800',
      RESPONDED: 'bg-green-100 text-green-800',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteClick = (message: ContactMessage) => {
    setMessageToDelete(message);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/contact/${messageToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageToDelete.id));
        setDeleteModalOpen(false);
        setMessageToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="p-[24px]">
      <div className="mb-[24px]">
        <h1 className="text-[24px] font-semibold text-[#101828] mb-[8px]">Contact Messages</h1>
        <p className="text-[14px] text-[#667085]">Manage and respond to customer inquiries</p>
      </div>

      <div className="mb-[16px]">
        <div className="flex justify-between items-center gap-[12px]">
          <div className="relative w-[280px]">
            <Search className="absolute left-[12px] top-[10px] text-[#667085]" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(0);
              }}
              placeholder="Search by name or email"
              className="w-full pl-[36px] pr-[12px] py-[8px] border border-[#D0D5DD] rounded-[8px] text-[14px]"
            />
          </div>

          <div className="flex gap-[12px]">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="px-[12px] py-[8px] border border-[#D0D5DD] rounded-[8px] text-[14px] w-[120px]"
            >
              <option value="">Status</option>
              <option value="NEW">New</option>
              <option value="READ">Read</option>
              <option value="RESPONDED">Responded</option>
            </select>

            <div className="relative">
              <button
                onClick={() => startDateRef.current?.showPicker()}
                className="flex items-center gap-[8px] px-[12px] py-[8px] border border-[#D0D5DD] rounded-[8px] hover:bg-[#F9FAFB] transition-colors"
                title={startDate ? `Start: ${startDate}` : "Select start date"}
              >
                <Calendar size={16} className="text-[#667085]" />
                <span className="text-[14px] text-[#344054]">Start Date</span>
              </button>
              <input
                ref={startDateRef}
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCurrentPage(0);
                }}
                className="absolute opacity-0 pointer-events-none"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => endDateRef.current?.showPicker()}
                className="flex items-center gap-[8px] px-[12px] py-[8px] border border-[#D0D5DD] rounded-[8px] hover:bg-[#F9FAFB] transition-colors"
                title={endDate ? `End: ${endDate}` : "Select end date"}
              >
                <Calendar size={16} className="text-[#667085]" />
                <span className="text-[14px] text-[#344054]">End Date</span>
              </button>
              <input
                ref={endDateRef}
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCurrentPage(0);
                }}
                className="absolute opacity-0 pointer-events-none"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="animate-spin text-[#2F80ED]" size={40} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-[12px] border border-[#E4E7EC]">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-[#E4E7EC]">
                <tr>
                  <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] uppercase">Name</th>
                  <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] uppercase">Email</th>
                  <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] uppercase">Subject</th>
                  <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] uppercase">Status</th>
                  <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] uppercase">Date</th>
                  <th className="px-[24px] py-[12px] text-left text-[12px] font-medium text-[#667085] uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-[24px] py-[32px] text-center text-[#667085]">
                      No messages found
                    </td>
                  </tr>
                ) : (
                  messages.map((message) => (
                    <tr key={message.id} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                      <td className="px-[24px] py-[16px] text-[14px] text-[#101828]">{message.fullName}</td>
                      <td className="px-[24px] py-[16px] text-[14px] text-[#667085]">{message.email}</td>
                      <td className="px-[24px] py-[16px] text-[14px] text-[#667085]">{message.subject || 'N/A'}</td>
                      <td className="px-[24px] py-[16px]">
                        <span className={`px-[8px] py-[2px] rounded-[12px] text-[12px] font-medium ${getStatusBadge(message.status)}`}>
                          {message.status}
                        </span>
                      </td>
                      <td className="px-[24px] py-[16px] text-[14px] text-[#667085]">{formatDate(message.createdAt)}</td>
                      <td className="px-[24px] py-[16px]">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === message.id ? null : message.id)}
                            className="p-[4px] hover:bg-gray-100 rounded-[4px]"
                          >
                            <MoreVertical size={20} className="text-[#667085]" />
                          </button>
                          
                          {openMenuId === message.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="fixed z-20 bg-white border border-[#E4E7EC] rounded-[8px] shadow-lg py-[4px] w-[160px]"
                                style={{
                                  top: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().bottom + 4}px`,
                                  left: `${(document.activeElement as HTMLElement)?.getBoundingClientRect().left - 140}px`
                                }}
                              >
                                <button
                                  onClick={() => {
                                    router.push(`/admin/contact-messages/${message.id}`);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[14px] text-[#344054] hover:bg-[#F9FAFB]"
                                >
                                  <Eye size={16} />
                                  View Details
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(message)}
                                  className="w-full flex items-center gap-[8px] px-[12px] py-[8px] text-[14px] text-[#D92D20] hover:bg-[#FEF3F2]"
                                >
                                  <Trash2 size={16} />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-[16px] flex items-center justify-between">
              <div className="text-[14px] text-[#667085]">
                Showing {messages.length === 0 ? 0 : currentPage * 10 + 1} to {Math.min((currentPage + 1) * 10, totalItems)} of {totalItems} messages
              </div>
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                  className="px-[12px] py-[8px] border border-[#D0D5DD] rounded-[8px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB]"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-[12px] py-[8px] border border-[#D0D5DD] rounded-[8px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB]"
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-[4px]">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (currentPage < 3) {
                      pageNum = i;
                    } else if (currentPage > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-[12px] py-[8px] rounded-[8px] text-[14px] ${
                          currentPage === pageNum
                            ? 'bg-[#2F80ED] text-white'
                            : 'border border-[#D0D5DD] hover:bg-[#F9FAFB]'
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-[12px] py-[8px] border border-[#D0D5DD] rounded-[8px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB]"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages - 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="px-[12px] py-[8px] border border-[#D0D5DD] rounded-[8px] text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F9FAFB]"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-[12px] p-[24px] max-w-[400px] w-full mx-[16px]">
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="w-[48px] h-[48px] rounded-full bg-[#FEF3F2] flex items-center justify-center">
                <Trash2 size={24} className="text-[#D92D20]" />
              </div>
              <div>
                <h3 className="text-[18px] font-semibold text-[#101828]">Delete Message</h3>
              </div>
            </div>
            
            <p className="text-[14px] text-[#667085] mb-[24px]">
              Are you sure you want to delete the message from <span className="font-medium text-[#101828]">{messageToDelete.fullName}</span>? This action cannot be undone.
            </p>
            
            <div className="flex gap-[12px]">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMessageToDelete(null);
                }}
                className="flex-1 px-[16px] py-[10px] border border-[#D0D5DD] text-[#344054] rounded-[8px] text-[14px] font-medium hover:bg-[#F9FAFB]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-[16px] py-[10px] bg-[#D92D20] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#B42318]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

