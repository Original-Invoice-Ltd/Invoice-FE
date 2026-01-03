"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ApiClient } from '@/lib/api';

interface Notification {
  id: number;
  type: 'INVOICE' | 'ITEM' | 'CLIENT' | 'SYSTEM' | 'PAYMENT';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isNew?: boolean;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanelUpdated = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'invoices' | 'payment' | 'client' | 'system'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const notificationsPerPage = 4;

  // Fetch notifications from backend
  const fetchNotifications = async (tab: string, page: number) => {
    setLoading(true);
    try {
      let response;
      if (tab === 'all') {
        response = await ApiClient.getNotifications(page - 1, notificationsPerPage);
      } else {
        const typeMap = {
          'invoices': 'INVOICE',
          'payment': 'PAYMENT',
          'client': 'CLIENT',
          'system': 'SYSTEM'
        };
        response = await ApiClient.getNotificationsByType(typeMap[tab as keyof typeof typeMap], page - 1, notificationsPerPage);
      }

      if (response.status === 200 && response.data) {
        setNotifications(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load notifications when component opens or tab/page changes
  useEffect(() => {
    if (isOpen) {
      fetchNotifications(activeTab, currentPage);
    }
  }, [isOpen, activeTab, currentPage]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'INVOICE':
        return (
          <svg width="15" height="19" viewBox="0 0 15 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.41667 0.927501C7.18694 0.812047 6.93104 0.75 6.66822 0.75H3.25C1.86929 0.75 0.75 1.86929 0.75 3.25V14.9167C0.75 16.2974 1.86929 17.4167 3.25 17.4167H11.5833C12.964 17.4167 14.0833 16.2974 14.0833 14.9167V8.88367C14.0833 8.6645 14.0401 8.44942 13.9582 8.25M7.41667 0.927501C7.60306 1.02118 7.77223 1.15001 7.91391 1.30939L13.6623 7.77639C13.7879 7.91767 13.8875 8.07801 13.9582 8.25M7.41667 0.927501V5.75C7.41667 7.13071 8.53595 8.25 9.91667 8.25H13.9582" stroke="#2F80ED" strokeWidth="1.5"/>
          </svg>
        );
      case 'ITEM':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.64062 6.19995L9.99895 10.4583L17.3073 6.22492" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 18.0083V10.45" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.2755 2.06663L3.82551 4.54165C2.81717 5.09999 1.99219 6.49997 1.99219 7.64997V12.3583C1.99219 13.5083 2.81717 14.9083 3.82551 15.4666L8.2755 17.9417C9.2255 18.4667 10.7838 18.4667 11.7338 17.9417L16.1839 15.4666C17.1922 14.9083 18.0172 13.5083 18.0172 12.3583V7.64997C18.0172 6.49997 17.1922 5.09999 16.1839 4.54165L11.7338 2.06663C10.7755 1.53329 9.2255 1.53329 8.2755 2.06663Z" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.1661 11.0333V7.98333L6.25781 3.41663" stroke="#2F80ED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'SYSTEM':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.41489 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM10 16.875C8.64026 16.875 7.31105 16.4718 6.18046 15.7164C5.04987 14.9609 4.16868 13.8872 3.64833 12.6309C3.12798 11.3747 2.99183 9.99237 3.2571 8.65875C3.52238 7.32513 4.17716 6.10013 5.13864 5.13864C6.10013 4.17715 7.32514 3.52237 8.65876 3.2571C9.99238 2.99183 11.3747 3.12798 12.631 3.64833C13.8872 4.16868 14.9609 5.04987 15.7164 6.18045C16.4718 7.31104 16.875 8.64025 16.875 10C16.8729 11.8227 16.1479 13.5702 14.8591 14.8591C13.5702 16.1479 11.8227 16.8729 10 16.875ZM11.25 13.75C11.25 13.9158 11.1842 14.0747 11.0669 14.1919C10.9497 14.3092 10.7908 14.375 10.625 14.375C10.2935 14.375 9.97554 14.2433 9.74112 14.0089C9.5067 13.7745 9.375 13.4565 9.375 13.125V10C9.20924 10 9.05027 9.93415 8.93306 9.81694C8.81585 9.69973 8.75 9.54076 8.75 9.375C8.75 9.20924 8.81585 9.05027 8.93306 8.93306C9.05027 8.81585 9.20924 8.75 9.375 8.75C9.70652 8.75 10.0245 8.8817 10.2589 9.11612C10.4933 9.35054 10.625 9.66848 10.625 10V13.125C10.7908 13.125 10.9497 13.1908 11.0669 13.3081C11.1842 13.4253 11.25 13.5842 11.25 13.75ZM8.75 6.5625C8.75 6.37708 8.80499 6.19582 8.908 6.04165C9.01101 5.88748 9.15743 5.76732 9.32874 5.69636C9.50004 5.62541 9.68854 5.60684 9.8704 5.64301C10.0523 5.67919 10.2193 5.76848 10.3504 5.89959C10.4815 6.0307 10.5708 6.19775 10.607 6.3796C10.6432 6.56146 10.6246 6.74996 10.5536 6.92127C10.4827 7.09257 10.3625 7.23899 10.2084 7.342C10.0542 7.44502 9.87292 7.5 9.6875 7.5C9.43886 7.5 9.20041 7.40123 9.02459 7.22541C8.84878 7.0496 8.75 6.81114 8.75 6.5625Z" fill="#2F80ED"/>
          </svg>
        );
      case 'CLIENT':
        return (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.668 11.6667H8.33464C6.03345 11.6667 4.16797 13.5321 4.16797 15.8333V16.6667C4.16797 17.1269 4.54107 17.5 5.0013 17.5H15.0013C15.4615 17.5 15.8346 17.1269 15.8346 16.6667V15.8333C15.8346 13.5321 13.9692 11.6667 11.668 11.6667Z" stroke="#2F80ED" strokeWidth="1.5"/>
            <path d="M10.0013 9.16667C11.8423 9.16667 13.3346 7.67428 13.3346 5.83333C13.3346 3.99238 11.8423 2.5 10.0013 2.5C8.16035 2.5 6.66797 3.99238 6.66797 5.83333C6.66797 7.67428 8.16035 9.16667 10.0013 9.16667Z" stroke="#2F80ED" strokeWidth="1.5"/>
          </svg>
        );
      default:
        return null;
    }
  };

  // Reset to first page when tab changes
  const handleTabChange = (tab: 'all' | 'invoices' | 'payment' | 'client' | 'system') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const markAllAsRead = async () => {
    try {
      const response = await ApiClient.markAllAsRead();
      if (response.status === 200) {
        // Refresh notifications
        fetchNotifications(activeTab, currentPage);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-4">
        <svg width="80" height="80" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="108" height="108" rx="54" fill="#EFF8FF"/>
          <path d="M31.0248 24.4623C30.9527 24.7392 30.8269 24.9869 30.6373 25.2239C30.3545 25.5771 29.9153 25.9031 29.3346 26.1388C28.7559 26.3747 28.0431 26.5157 27.2641 26.5152C26.7011 26.5153 26.104 26.4425 25.4978 26.2861C24.2107 25.9562 23.1431 25.3084 22.4496 24.5746C21.9046 24.0004 20.9974 23.9767 20.4232 24.5216C19.849 25.0666 19.8253 25.9738 20.3703 26.548C21.4794 27.7134 23.0043 28.6018 24.7822 29.0621C25.62 29.278 26.4552 29.3818 27.2641 29.3819C28.7555 29.3802 30.1626 29.0336 31.3347 28.3383C31.9194 27.99 32.4448 27.551 32.8719 27.0197C33.2988 26.4895 33.6244 25.8644 33.8007 25.178C33.9983 24.4114 33.5371 23.6298 32.7705 23.4322C32.004 23.2346 31.2224 23.6958 31.0248 24.4623Z" fill="#99A0AE"/>
          <path d="M27.6145 37.6984C27.5425 37.9754 27.4166 38.223 27.227 38.46C26.9443 38.8132 26.5051 39.1393 25.9244 39.375C25.3457 39.6108 24.6329 39.7518 23.8539 39.7513C23.2909 39.7514 22.6938 39.6786 22.0877 39.5223C20.8005 39.1924 19.7329 38.5446 19.0394 37.8107C18.4945 37.2365 17.5872 37.2128 17.013 37.7578C16.4389 38.3028 16.4152 39.21 16.9601 39.7842C18.0692 40.9496 19.5941 41.838 21.3721 42.2983C22.2098 42.5142 23.045 42.618 23.854 42.6181C25.3453 42.6163 26.7525 42.2698 27.9245 41.5745C28.5092 41.2262 29.0346 40.7871 29.4617 40.2558C29.8887 39.7256 30.2142 39.1005 30.3905 38.4142C30.5882 37.6476 30.1269 36.866 29.3604 36.6684C28.5938 36.4707 27.8122 36.9319 27.6145 37.6984Z" fill="#99A0AE"/>
          <path d="M23.9935 51.7429C23.9215 52.0198 23.7956 52.2674 23.606 52.5045C23.3232 52.8577 22.8841 53.1837 22.3034 53.4194C21.7247 53.6553 21.0118 53.7963 20.2329 53.7958C19.6698 53.7958 19.0728 53.7231 18.4666 53.5667C17.1794 53.2368 16.1118 52.589 15.4183 51.8552C14.8734 51.281 13.9661 51.2573 13.392 51.8022C12.8178 52.3472 12.7941 53.2544 13.339 53.8286C14.4481 54.994 15.973 55.8824 17.751 56.3427C18.5887 56.5586 19.4239 56.6624 20.2329 56.6625C21.7242 56.6608 23.1314 56.3142 24.3034 55.6189C24.8881 55.2706 25.4135 54.8316 25.8406 54.3002C26.2676 53.7701 26.5931 53.145 26.7694 52.4586C26.9671 51.692 26.5059 50.9104 25.7393 50.7128C24.9727 50.5152 24.1911 50.9763 23.9935 51.7429Z" fill="#99A0AE"/>
          <path d="M87.6606 33.2557L39.7034 20.7818C36.5953 19.9733 33.4203 21.8376 32.6118 24.9457L20.1379 72.9029C19.3294 76.011 21.1937 79.186 24.3018 79.9945L72.259 92.4684C75.3672 93.2768 78.5422 91.4126 79.3506 88.3045L91.8245 40.3473C92.633 37.2391 90.7687 34.0641 87.6606 33.2557Z" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10" strokeLinejoin="round"/>
          <path d="M86.8357 33.8228L75.3967 77.8023C73.9206 82.517 69.2501 85.6589 64.1665 85.0455C63.8347 85.0055 63.5068 84.9503 63.186 84.8806L62.3857 84.6743C62.3643 84.6688 62.3429 84.6633 62.3223 84.6547C57.5769 83.1968 54.4099 78.5101 55.0219 73.4065C55.7128 67.6685 60.9251 63.575 66.6639 64.2628L22.2814 58.4308L22.2783 58.43C22.0285 58.3754 21.7725 58.3322 21.5134 58.3013C19.9118 58.1067 18.3647 58.4213 17.0352 59.1177L27.6214 18.4205C28.4292 15.3124 31.6044 13.4465 34.7119 14.2573L82.6694 26.7317C85.7776 27.5395 87.6435 30.7146 86.8357 33.8228Z" fill="white" stroke="#99A0AE" strokeMiterlimit="10" strokeLinejoin="round"/>
          <path d="M62.321 84.6547L19.9078 73.6227C19.8306 73.6191 19.7541 73.6124 19.6754 73.6019C15.4471 73.095 12.4361 69.2565 12.9422 65.0313C13.2568 62.4084 14.8549 60.2532 17.0339 59.1177C18.3635 58.4212 19.9106 58.1066 21.5121 58.3012C21.7713 58.3322 22.0273 58.3754 22.2771 58.43L22.2802 58.4308L66.6627 64.2627C60.9238 63.5749 55.7116 67.6684 55.0207 73.4064C54.4087 78.51 57.5756 83.1967 62.321 84.6547Z" fill="#CACFD8" stroke="#99A0AE" strokeMiterlimit="10" strokeLinejoin="round"/>
          <path d="M62.3867 84.6743L63.1871 84.8806C62.9151 84.8235 62.6493 84.755 62.3867 84.6743Z" stroke="#99A0AE" strokeMiterlimit="10" strokeLinejoin="round"/>
          <path d="M75.3945 77.8023L75.6614 76.7798C75.5877 77.1289 75.5003 77.468 75.3945 77.8023Z" stroke="#99A0AE" strokeMiterlimit="10" strokeLinejoin="round"/>
          <path d="M22.4494 24.5746C22.1167 24.2244 21.8699 23.8575 21.7113 23.5053C21.5523 23.152 21.4801 22.8173 21.48 22.5046C21.4801 22.3393 21.4999 22.1787 21.5414 22.0176C21.6134 21.7406 21.7393 21.493 21.9289 21.256C22.2116 20.9028 22.6508 20.5768 23.2315 20.341C23.8102 20.1052 24.523 19.9642 25.302 19.9647C25.865 19.9646 26.4621 20.0374 27.0682 20.1938C28.3276 20.5167 29.377 21.1434 30.071 21.8581C30.4189 22.2145 30.6776 22.59 30.8437 22.9508C31.0103 23.3127 31.0858 23.6556 31.0859 23.9753C31.0858 24.1407 31.066 24.3012 31.0245 24.4624C30.8269 25.2289 31.2881 26.0106 32.0547 26.2081C32.8213 26.4057 33.6029 25.9446 33.8005 25.178C33.9031 24.7801 33.9528 24.3754 33.9527 23.9753C33.9528 23.1975 33.7665 22.4422 33.4467 21.7498C32.9652 20.7096 32.1916 19.8016 31.2249 19.0628C30.2568 18.3248 29.0889 17.7546 27.7839 17.4178C26.9462 17.2019 26.111 17.098 25.302 17.098C23.8107 17.0997 22.4035 17.4463 21.2315 18.1416C20.6468 18.4899 20.1214 18.9289 19.6943 19.4602C19.2674 19.9904 18.9418 20.6155 18.7655 21.3019C18.6628 21.6997 18.6132 22.1044 18.6133 22.5045C18.6132 23.2651 18.7913 24.0044 19.0982 24.6841C19.4056 25.3647 19.8403 25.9895 20.3701 26.548C20.915 27.1222 21.8223 27.1459 22.3964 26.6009C22.9706 26.056 22.9943 25.1488 22.4494 24.5746Z" fill="#99A0AE"/>
          <path d="M19.0393 37.8107C18.7066 37.4605 18.4598 37.0936 18.3012 36.7414C18.1422 36.3881 18.07 36.0534 18.0698 35.7407C18.07 35.5754 18.0898 35.4148 18.1312 35.2537C18.2033 34.9768 18.3291 34.7291 18.5187 34.4921C18.8015 34.1388 19.2407 33.8129 19.8214 33.5772C20.4001 33.3413 21.1129 33.2003 21.8919 33.2008C22.4549 33.2007 23.052 33.2735 23.6581 33.4299C24.9175 33.7528 25.9668 34.3795 26.6609 35.0942C27.0088 35.4506 27.2674 35.8261 27.4335 36.1869C27.6002 36.5488 27.6757 36.8917 27.6758 37.2114C27.6757 37.3768 27.6558 37.5374 27.6144 37.6985C27.4168 38.465 27.878 39.2467 28.6445 39.4443C29.4111 39.6418 30.1927 39.1807 30.3903 38.4141C30.493 38.0163 30.5426 37.6116 30.5425 37.2114C30.5426 36.4336 30.3564 35.6783 30.0366 34.9859C29.555 33.9457 28.7814 33.0377 27.8148 32.299C26.8466 31.561 25.6787 30.9908 24.3738 30.6539C23.536 30.438 22.7009 30.3341 21.8919 30.3341C20.4006 30.3358 18.9934 30.6824 17.8214 31.3777C17.2366 31.726 16.7112 32.165 16.2841 32.6964C15.8572 33.2266 15.5316 33.8516 15.3553 34.538C15.2526 34.9358 15.2031 35.3405 15.2031 35.7407C15.203 36.5012 15.3812 37.2406 15.6881 37.9202C15.9955 38.6009 16.4302 39.2257 16.9599 39.7841C17.5049 40.3583 18.4121 40.382 18.9863 39.8371C19.5605 39.2921 19.5842 38.3849 19.0393 37.8107Z" fill="#99A0AE"/>
          <path d="M15.4181 51.8552C15.0855 51.505 14.8387 51.1381 14.6801 50.7859C14.521 50.4326 14.4489 50.0979 14.4487 49.7852C14.4488 49.6199 14.4687 49.4593 14.5101 49.2982C14.5822 49.0212 14.708 48.7736 14.8976 48.5366C15.1803 48.1833 15.6195 47.8573 16.2002 47.6216C16.7789 47.3857 17.4918 47.2447 18.2707 47.2453C18.8338 47.2452 19.4308 47.318 20.037 47.4743C21.2963 47.7972 22.3457 48.424 23.0398 49.1386C23.3876 49.495 23.6463 49.8705 23.8124 50.2313C23.979 50.5932 24.0545 50.9362 24.0547 51.2559C24.0546 51.4212 24.0347 51.5818 23.9933 51.7429C23.7956 52.5095 24.2569 53.2911 25.0235 53.4887C25.79 53.6863 26.5716 53.2251 26.7692 52.4585C26.8719 52.0607 26.9215 51.656 26.9214 51.2559C26.9215 50.4781 26.7353 49.7227 26.4155 49.0304C25.9339 47.9902 25.1603 47.0821 24.1937 46.3434C23.2255 45.6054 22.0576 45.0352 20.7527 44.6984C19.915 44.4824 19.0798 44.3786 18.2708 44.3785C16.7795 44.3803 15.3723 44.7268 14.2003 45.4221C13.6155 45.7704 13.0901 46.2095 12.663 46.7408C12.2361 47.271 11.9106 47.8961 11.7342 48.5824C11.6316 48.9803 11.582 49.385 11.582 49.7851C11.5819 50.5457 11.7601 51.285 12.067 51.9646C12.3744 52.6453 12.8091 53.2701 13.3389 53.8286C13.8838 54.4028 14.791 54.4265 15.3652 53.8815C15.9394 53.3365 15.9631 52.4293 15.4181 51.8552Z" fill="#99A0AE"/>
          <path d="M42.2116 25.0682L45.7295 31.03L39.5898 34.6529" fill="white"/>
          <path d="M41.2527 25.6328L44.2059 30.6377L39.0232 33.696C38.4947 34.0078 38.3191 34.6891 38.6309 35.2176C38.9428 35.7461 39.624 35.9217 40.1525 35.6098L46.2922 31.9869C46.8207 31.6751 46.9963 30.9938 46.6845 30.4653L43.1665 24.5035C42.8547 23.975 42.1734 23.7993 41.6449 24.1112C41.1164 24.4231 40.9408 25.1044 41.2527 25.6328Z" fill="#99A0AE"/>
          <path d="M71.7041 32.6716L65.7422 36.1896L69.3651 42.3293" fill="white"/>
          <path d="M71.1407 31.7147L65.1788 35.2326C64.9268 35.3813 64.7406 35.6288 64.6675 35.9122C64.5945 36.1955 64.6378 36.5022 64.7865 36.7542L68.4094 42.8939C68.7213 43.4224 69.4026 43.598 69.931 43.2862C70.4595 42.9743 70.6352 42.2931 70.3233 41.7646L67.2651 36.5818L72.27 33.6286C72.7985 33.3167 72.9741 32.6355 72.6623 32.107C72.3504 31.5785 71.6692 31.4028 71.1407 31.7147Z" fill="#99A0AE"/>
          <path d="M43.9004 47.7732L59.2485 51.73C59.8428 51.8832 60.4487 51.5257 60.6018 50.9315C60.755 50.3373 60.3975 49.7314 59.8033 49.5782L44.4552 45.6214C43.8609 45.4682 43.255 45.8257 43.1019 46.4199C42.9487 47.0142 43.3062 47.6201 43.9004 47.7732Z" fill="#99A0AE"/>
          <path d="M94.5 17.25C94.5 17.25 89.25 17.2679 89.25 22.5C89.25 17.2679 84 17.25 84 17.25C84 17.25 89.25 17.2321 89.25 12C89.25 17.2321 94.5 17.25 94.5 17.25Z" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15 87C15 87 10.5 87.0153 10.5 91.5C10.5 87.0153 6 87 6 87C6 87 10.5 86.9847 10.5 82.5C10.5 86.9847 15 87 15 87Z" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M71.2137 79.5931L70.6364 79.9874C67.3997 82.2051 62.9832 81.3755 60.7687 78.142C58.551 74.9084 59.3743 70.4919 62.611 68.2742L63.1883 67.8799L71.2137 79.5931Z" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10" strokeLinejoin="round"/>
          <path d="M100.593 52.1413L99.514 59.6021C99.451 60.0311 99.2112 60.416 98.8515 60.662L73.0434 78.3407L71.2168 79.5931L63.1914 67.8799L65.0179 66.6275L90.8261 48.9489C91.1857 48.7028 91.6306 48.6176 92.0533 48.7154L99.4004 50.4032C100.189 50.583 100.71 51.34 100.593 52.1413Z" fill="white" stroke="#99A0AE" strokeMiterlimit="10" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="text-base font-semibold text-[#101828] mb-2">No notifications yet</h3>
      <p className="text-xs text-[#667085] text-center px-4">
        You'll get updates here when clients view invoices, pay you, or when something needs your attention.
      </p>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
      <div className="w-[600px] bg-white rounded shadow-lg border border-[#E4E7EC] mt-4 mr-6 mb-6 max-h-[calc(100vh-2rem)] flex flex-col">
        {/* Header with Tabs */}
        <div className="p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-[#101828]">Notifications</h1>
              <p className="text-sm text-[#667085] mt-1">
                Stay updated on invoice activity, payments, reminders, and account alerts.
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} className="text-[#667085]" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-4">
              {[
                { key: 'all', label: 'All' },
                { key: 'invoices', label: 'Invoices' },
                { key: 'payment', label: 'Payment' },
                { key: 'client', label: 'Client' },
                { key: 'system', label: 'System' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key as any)}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'text-[#2F80ED] border-[#2F80ED]'
                      : 'text-[#667085] border-transparent hover:text-[#344054]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={markAllAsRead}
              className="text-sm font-medium text-[#2F80ED] hover:text-[#1B69D3] ml-8"
            >
              Mark all as Read
            </button>
          </div>
        </div>

        {/* Notifications Content - Scrollable */}
        <div className="flex-1 overflow-hidden px-6">
          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F80ED]"></div>
            </div>
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3 max-h-full overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded hover:bg-[#F9FAFB] transition-colors ${
                    !notification.isRead ? 'bg-[#F8FAFC]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-[#EFF8FF] rounded-full flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-[#101828] mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-[#667085] mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#98A2B3]">
                            {notification.timestamp}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {notification.isNew && (
                            <div className="w-2 h-2 bg-[#2F80ED] rounded-full"></div>
                          )}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-[#F04438] rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination - Fixed at bottom */}
        {totalPages > 1 && (
          <div className="flex-shrink-0 px-6 pb-6">
            <div className="flex items-center justify-between pt-4 border-t border-[#E4E7EC]">
              <div className="text-sm text-[#667085]">
                Showing {((currentPage - 1) * notificationsPerPage) + 1}-{Math.min(currentPage * notificationsPerPage, totalElements)} of {totalElements}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[#E4E7EC] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} className="text-[#667085]" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-[#2F80ED] text-white'
                          : 'text-[#667085] hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-[#E4E7EC] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} className="text-[#667085]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanelUpdated;