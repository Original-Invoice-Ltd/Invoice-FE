'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Mail } from 'lucide-react';

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

export default function ContactMessageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, [id]);

  const fetchMessage = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contact/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(result.data);
        
        if (result.data.status === 'NEW') {
          updateStatus('READ');
        }
      }
    } catch (error) {
      console.error('Error fetching message:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/contact/${id}/status?status=${newStatus}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMessage(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-[24px] flex justify-center items-center h-[400px]">
        <div className="text-[#667085]">Loading...</div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="p-[24px]">
        <div className="text-[#667085]">Message not found</div>
      </div>
    );
  }

  return (
    <div className="p-[16px] sm:p-[24px]">
      <button
        onClick={() => router.push('/admin/contact-messages')}
        className="flex items-center gap-[8px] text-[#667085] hover:text-[#101828] mb-[16px] sm:mb-[24px]"
      >
        <ArrowLeft size={20} />
        <span className="text-[14px]">Back to Messages</span>
      </button>

      <div className="bg-white rounded-[12px] border border-[#E4E7EC] p-[16px] sm:p-[24px] lg:p-[32px]">
        <div className="mb-[16px] sm:mb-[24px]">
          <h1 className="text-[20px] sm:text-[24px] font-semibold text-[#101828] mb-[8px]">Message Details</h1>
        </div>

        <div className="space-y-[16px] sm:space-y-[24px]">
          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-[8px]">Subject:</label>
            <div className="text-[14px] sm:text-[16px] text-[#101828] break-words">{message.subject || 'N/A'}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] sm:gap-[24px]">
            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-[8px]">Name:</label>
              <div className="text-[14px] sm:text-[16px] text-[#101828] break-words">{message.fullName}</div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-[8px]">Email:</label>
              <div className="text-[14px] sm:text-[16px] text-[#101828] break-all">{message.email}</div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-[8px]">Phone:</label>
              <div className="text-[14px] sm:text-[16px] text-[#101828]">{message.phone}</div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#344054] mb-[8px]">Date:</label>
              <div className="text-[14px] sm:text-[16px] text-[#101828]">{formatDate(message.createdAt)}</div>
            </div>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#344054] mb-[8px]">Message:</label>
            <div className="bg-[#F9FAFB] border border-[#E4E7EC] rounded-[8px] p-[12px] sm:p-[16px]">
              <p className="text-[14px] text-[#101828] whitespace-pre-wrap leading-relaxed break-words">
                {message.message}
              </p>
            </div>
          </div>

          <div className="border-t border-[#E4E7EC] pt-[16px] sm:pt-[24px]">
            <h3 className="text-[16px] font-semibold text-[#101828] mb-[12px] sm:mb-[16px]">Actions</h3>
            <div className="flex flex-col sm:flex-row gap-[12px]">
              <button
                onClick={() => updateStatus('RESPONDED')}
                disabled={updating || message.status === 'RESPONDED'}
                className="w-full sm:w-auto px-[16px] py-[10px] bg-[#2F80ED] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#1E5FBF] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {message.status === 'RESPONDED' ? 'Marked as Resolved' : 'Mark as Resolved'}
              </button>

              <a
                href={`mailto:${message.email}`}
                className="w-full sm:w-auto flex items-center justify-center gap-[8px] px-[16px] py-[10px] bg-white border border-[#D0D5DD] text-[#344054] rounded-[8px] text-[14px] font-medium hover:bg-[#F9FAFB]"
              >
                <Mail size={16} />
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
