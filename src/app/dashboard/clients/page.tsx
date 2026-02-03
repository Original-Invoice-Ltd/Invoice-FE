"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Plus, MoreVertical, ChevronDown, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApiClient } from "@/lib/api";
import { ClientCache } from "@/lib/clientCache";
import ClientModal from "@/components/clientManagement/ClientModal";
import DeleteConfirmationModal from "@/components/common/DeleteConfirmationModal";
import { useInvoiceLimit } from "@/contexts/InvoiceLimitContext";
import { useInvoiceLimitNotification } from "@/hooks/useInvoiceLimitNotification";


interface Client {
    id: string;
    customerType: string;
    title: string;
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    country: string;
}

interface FormData {
    customerType: string;
    title: string;
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    country: string;
}


const ClientsPage = () => {
    const router = useRouter();
    const { canCreateInvoice } = useInvoiceLimit();
    const { showBlockedNotification } = useInvoiceLimitNotification();
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [clients, setClients] = useState<Client[]>([]);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingClients, setIsLoadingClients] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingClientId, setEditingClientId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("name");
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        client: Client | null;
        isLoading: boolean;
    }>({
        isOpen: false,
        client: null,
        isLoading: false
    });
    const [clientFormError, setClientFormError] = useState<string | null>(null);
    
    const sortDropdownRef = useRef<HTMLDivElement>(null);
    const actionMenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const [formData, setFormData] = useState<FormData>({
        customerType: "",
        title: "Mr",
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        country: "",
    });

    // Load clients on component mount
    useEffect(() => {
        loadClients();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
            
            // Close action menus
            Object.entries(actionMenuRefs.current).forEach(([clientId, ref]) => {
                if (ref && !ref.contains(event.target as Node)) {
                    if (showActionMenu === clientId) {
                        setShowActionMenu(null);
                    }
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showActionMenu]);

    const loadClients = async (forceRefresh = false) => {
        try {
            setIsLoadingClients(true);
            
            // Try to load from cache first if not forcing refresh
            if (!forceRefresh) {
                const cachedClients = ClientCache.get();
                if (cachedClients) {
                    setClients(cachedClients);
                    setIsLoadingClients(false);
                    return;
                }
            }
            
            const response = await ApiClient.getAllUserClients();
            
            if (response.status === 200) {
                // Handle both cases: data exists (array) or data is null/undefined (empty list)
                const clientsData = Array.isArray(response.data) ? response.data : [];
                setClients(clientsData);
                // Cache the clients (even if empty array)
                ClientCache.set(clientsData);
            } else {
                // Only handle actual API errors, not empty lists
                const cachedClients = ClientCache.get();
                if (cachedClients) {
                    setClients(cachedClients);
                    // Silently use cached data, no toast needed
                } else {
                    // Set empty array if no cached data and API failed
                    setClients([]);
                }
            }
        } catch (error) {
            console.error('Error loading clients:', error);
            
            // Try to load from cache as fallback
            const cachedClients = ClientCache.get();
            if (cachedClients) {
                setClients(cachedClients);
                // Silently use cached data, no toast needed
            }
            // If no cached data available, the empty state will be shown
        } finally {
            setIsLoadingClients(false);
        }
    };

    const handleSaveClient = async () => {
        setClientFormError(null);
        if (!formData.customerType) { 
             setClientFormError('Client Type is required.');
            return;
        }
        if (!formData.title) { 
             setClientFormError('Client Title is required.');
            return;
        }
         if (!formData.fullName) { 
             setClientFormError('Client full name is required.');
            return;
        }
        if (!formData.businessName) {
            setClientFormError('Client business name is required');
            return;
        }
        if (!ApiClient.isValidEmail(formData.email)) { 
            setClientFormError('Invalid Client email provided. eg. name@gmail.com');
            return;
        }
        if (!ApiClient.isValidPhone(formData.phone)) {
            setClientFormError('Phone number must be in international format. Example: +234***********');
            return;
        }
         if (!formData.country) {
            setClientFormError('Client country is required');
            return;
        }

        try {
            setIsLoading(true);
            let response;

            if (isEditMode && editingClientId) {
                response = await ApiClient.updateClient(editingClientId, formData);
            } else {
                response = await ApiClient.addClient(formData);
            }

            const expectedStatus = isEditMode ? 200 : 201;
            if (response.status === expectedStatus) {
                setShowAddModal(false);
                setShowSuccessModal(true);
                resetForm();
                await loadClients(true); 
            } else {
                setClientFormError(response.error || `Failed to ${isEditMode ? 'update' : 'add'} client`);
            }
        } catch (error) {
            console.error('Error saving client:', error);
            setClientFormError('An error occurred while saving the client');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateInvoice = () => {
        if (!canCreateInvoice) {
            showBlockedNotification();
            return;
        }
        
        setShowSuccessModal(false);
        router.push('/dashboard/invoices/create');
    };


    const handleEditClient = (client: Client) => {
        setFormData({
            customerType: client.customerType,
            title: client.title,
            fullName: client.fullName,
            businessName: client.businessName,
            email: client.email,
            phone: client.phone,
            country: client.country || "",
        });
        setIsEditMode(true);
        setEditingClientId(client.id);
        setShowAddModal(true);
        setShowActionMenu(null);
    };

    const handleDeleteClient = async (client: Client) => {
        setDeleteModal({
            isOpen: true,
            client: client,
            isLoading: false
        });
        setShowActionMenu(null);
    };

    const confirmDeleteClient = async () => {
        if (!deleteModal.client) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));

        try {
            const response = await ApiClient.deleteClient(deleteModal.client.id);
            
            if (response.status === 200) {
                await loadClients(true); // Force refresh to get latest data
                setDeleteModal({ isOpen: false, client: null, isLoading: false });
            } else {
                console.error('Failed to delete client:', response.error);
                setDeleteModal(prev => ({ ...prev, isLoading: false }));
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const closeDeleteModal = () => {
        if (!deleteModal.isLoading) {
            setDeleteModal({ isOpen: false, client: null, isLoading: false });
        }
    };

    const resetForm = () => {
        setFormData({
            customerType: "",
            title: "Mr",
            fullName: "",
            businessName: "",
            email: "",
            phone: "",
            country: "",
        });
        setIsEditMode(false);
        setEditingClientId(null);
    };

    const handleAddNewClient = () => {
        resetForm();
        setShowAddModal(true);
    };

    const filteredClients = clients.filter(client =>
        client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedClients = [...filteredClients].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.fullName.localeCompare(b.fullName);
            case 'company':
                return a.businessName.localeCompare(b.businessName);
            case 'email':
                return a.email.localeCompare(b.email);
            default:
                return 0;
        }
    });

    const totalPages = Math.ceil(sortedClients.length / 10);
    const startIndex = (currentPage - 1) * 10;
    const paginatedClients = sortedClients.slice(startIndex, startIndex + 10);

    return (
        <div className="max-w-7xl mx-auto mb-[200px] p-6">
            <div className="max-w-[1108px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-6 h-[68px]">
                    <div className="w-[360px] h-[68px] flex flex-col gap-1">
                        <h1 className="w-[360px] h-6 font-semibold text-[20px] leading-[120%] text-[#000000]" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                            Clients Management
                        </h1>
                        <p className="w-[360px] h-10 text-[14px] leading-[140%] text-[#333436]" style={{ fontFamily: 'Inter Tight, sans-serif', letterSpacing: '0.01em' }}>
                            Manage your client database, track payments, and view billing history.
                        </p>
                    </div>
                    <button
                        onClick={handleAddNewClient}
                        className="hidden lg:flex items-center gap-2 w-[139px] h-12 px-4 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        <Plus size={20} />
                        Add Client
                    </button>
                </div>


                {/* Mobile Add Client Button */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={handleAddNewClient}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        <Plus size={20} />
                        Add Client
                    </button>
                </div>

                {/* Conditional Rendering: Loading, Empty State or Table */}
                {isLoadingClients ? (
                    /* Loading State */
                    <div className="bg-white rounded-lg border border-[#E4E7EC] p-12 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F80ED] mb-4"></div>
                        <p className="text-[#667085]">Loading clients...</p>
                    </div>
                ) : clients.length === 0 ? (
                    /* Empty State */
                    <div className="bg-white rounded-lg border border-[#E4E7EC] p-12 flex flex-col items-center justify-center">
                        <div className="mb-6">
                            <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="108" height="108" rx="54" fill="#EFF8FF" />
                                <rect x="25.7227" y="29.2847" width="48.1432" height="60.7297" rx="3.05155" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10" />
                                <path d="M31.0137 26.5504V77.0432C31.0137 81.469 34.5989 85.0541 39.0246 85.0541H73.657C76.6966 85.0541 79.1572 82.5935 79.1572 79.5539V26.5504C79.1572 25.3201 78.1607 24.3236 76.9304 24.3236H33.2405C32.0102 24.3236 31.0137 25.3201 31.0137 26.5504Z" fill="white" stroke="#99A0AE" strokeMiterlimit="10" />
                                <rect x="45.2949" y="21.173" width="19.5791" height="6.30367" rx="1.52577" fill="#CACFD8" stroke="#99A0AE" strokeMiterlimit="10" />
                                <path d="M51.082 18.6081C51.082 16.3915 52.8789 14.5946 55.0955 14.5946C57.3121 14.5946 59.1091 16.3915 59.1091 18.6081V21.1622H51.082V18.6081Z" fill="#CACFD8" stroke="#99A0AE" strokeMiterlimit="10" />
                                <circle cx="55.0855" cy="18.2368" r="1.8179" fill="white" />
                                <path d="M79.4395 29.2847H81.3899C83.0752 29.2847 84.4414 30.6509 84.4414 32.3362V41.3502C84.4414 43.0356 83.0752 44.4018 81.3899 44.4018H79.4395V29.2847Z" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10" />
                                <path d="M79.4395 64.1874H81.3899C83.0752 64.1874 84.4414 65.5536 84.4414 67.2389V76.253C84.4414 77.9383 83.0752 79.3045 81.3899 79.3045H79.4395V64.1874Z" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10" />
                                <path d="M43.8109 43.3237H40.2402" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M39.9672 43.1488C38.9103 42.4019 38.2765 41.098 38.4997 39.6626C38.7413 38.1111 40.0345 36.8727 41.5943 36.69C43.7593 36.4358 45.5965 38.1212 45.5965 40.2351C45.5965 41.4402 44.9978 42.5037 44.0831 43.15C43.9188 43.266 43.8111 43.4458 43.8111 43.6469V45.2936C43.8111 46.1155 43.1452 46.7814 42.3233 46.7814H41.7282C40.9063 46.7814 40.2404 46.1155 40.2404 45.2936V43.6493C40.2404 43.4463 40.1321 43.2654 39.9672 43.1488Z" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M46.7871 37.2596L47.4953 36.5514" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M37.2648 43.2106L36.5566 43.9188" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M37.8605 36.6645L37.1523 35.9563" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M46.7871 43.2106L47.4953 43.9188" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M47.3828 40.2351H48.3886" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M35.6641 40.2351H36.6698" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M40.2402 44.9962H43.7336" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="51.9824" y="37.441" width="21.2561" height="2.70099" rx="0.762887" fill="#E1E4EA" />
                                <rect x="51.9824" y="42.7086" width="12.2657" height="2.70099" rx="0.762887" fill="#E1E4EA" />
                                <path d="M39.0234 85.0541L76.9515 85.0375C79.568 85.0375 81.689 82.922 81.689 80.3055C81.689 77.984 80.0078 76.0467 77.7977 75.6515L77.6474 75.6236L40.6379 69.1881C44.2953 69.9341 47.0399 73.163 47.0399 77.0432C47.0399 81.469 43.4547 85.0541 39.0234 85.0541Z" fill="#CACFD8" stroke="#99A0AE" strokeMiterlimit="10" />
                                <circle cx="79.4381" cy="25.338" r="8.94596" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M73.6934 32.1954C73.9442 29.4699 76.0906 27.2933 78.8023 26.9957C77.3575 26.701 76.2705 25.4231 76.2705 23.8914C76.2705 22.1416 77.689 20.7231 79.4388 20.7231C81.1885 20.7231 82.607 22.1416 82.607 23.8914C82.607 25.4231 81.52 26.701 80.0753 26.9957C82.787 27.2932 84.9334 29.4698 85.1843 32.1952C83.63 33.4989 81.6261 34.2839 79.4388 34.2839C77.2515 34.2839 75.2476 33.4989 73.6934 32.1954Z" fill="#99A0AE" />
                                <circle cx="28.5612" cy="68.0229" r="8.94596" fill="white" stroke="#99A0AE" strokeMiterlimit="10" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M22.8145 74.8801C23.0654 72.155 25.2113 69.9786 27.9226 69.6807C26.4782 69.3858 25.3916 68.1081 25.3916 66.5765C25.3916 64.8267 26.81 63.4083 28.5598 63.4083C30.3096 63.4083 31.7281 64.8267 31.7281 66.5765C31.7281 68.108 30.6415 69.3857 29.1971 69.6807C31.9085 69.9786 34.0545 72.155 34.3054 74.8803C32.7512 76.1838 30.7473 76.9688 28.56 76.9688C26.3727 76.9688 24.3687 76.1838 22.8145 74.8801Z" fill="#99A0AE" />
                                <path d="M16.6864 34.1082C16.6864 34.1082 12.3081 34.1231 12.3081 38.4866C12.3081 34.1231 7.92969 34.1082 7.92969 34.1082C7.92969 34.1082 12.3081 34.0933 12.3081 29.7298C12.3081 34.0933 16.6864 34.1082 16.6864 34.1082Z" fill="white" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M102.993 69.5925C102.993 69.5925 98.6147 69.6073 98.6147 73.9708C98.6147 69.6073 94.2363 69.5925 94.2363 69.5925C94.2363 69.5925 98.6147 69.5775 98.6147 65.2141C98.6147 69.5775 102.993 69.5925 102.993 69.5925Z" fill="white" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="42.8688" cy="58.4382" r="2.48986" fill="#E1E4EA" />
                                <circle cx="55.0856" cy="58.4382" r="2.48986" fill="#E1E4EA" />
                                <circle cx="67.3024" cy="58.4382" r="2.48986" fill="#E1E4EA" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-[#101828] mb-2">No clients yet</h3>
                        <p className="text-[#667085] mb-6 text-center max-w-md">
                            Add your first client to start sending invoices and tracking payments.
                        </p>
                        <button
                            onClick={handleAddNewClient}
                            className="flex items-center gap-2 px-4 py-2 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-[#EFF8FF] transition-colors"
                        >
                            <Plus size={20} />
                            Add Client
                        </button>
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white rounded-lg border border-[#E4E7EC] pt-4 pr-[14px] pl-[14px] pb-4 flex flex-col gap-[18px]">
                        {/* All Clients header with search and sort */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-[#101828]">All Clients</h2>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:flex-initial sm:w-64">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
                                    <input
                                        type="text"
                                        placeholder="search clients"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                    />
                                </div>
                                <div className="relative" ref={sortDropdownRef}>
                                    <button 
                                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] hover:bg-[#F9FAFB]"
                                        style={{ width: '111px', height: '40px' }}
                                    >
                                        Sort by
                                        <ChevronDown size={16} />
                                    </button>
                                    {showSortDropdown && (
                                        <div className="absolute right-0 mt-1 w-48 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-10">
                                            <button
                                                onClick={() => {
                                                    setSortBy('name');
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-[#344054] hover:bg-[#F9FAFB] first:rounded-t-lg"
                                            >
                                                Name
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSortBy('company');
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-[#344054] hover:bg-[#F9FAFB]"
                                            >
                                                Company
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSortBy('email');
                                                    setShowSortDropdown(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-[#344054] hover:bg-[#F9FAFB] last:rounded-b-lg"
                                            >
                                                Email
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#F9FAFB] border-y border-[#E4E7EC]">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Title</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Client Name</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Company Name</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Email Address</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Phone Number</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedClients.map((client, index) => (
                                        <tr key={client.id} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                                            <td className="px-6 py-4 text-sm text-[#101828]">{client.title}</td>
                                            <td className="px-6 py-4 text-sm text-[#101828]">{client.fullName}</td>
                                            <td className="px-6 py-4 text-sm text-[#101828]">{client.businessName}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085]">{client.email}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085]">{client.phone}</td>
                                            <td className="px-6 py-4 relative">
                                                <div 
                                                    ref={(el) => {
                                                        if (el) actionMenuRefs.current[client.id] = el;
                                                    }}
                                                    className="relative"
                                                >
                                                    <button 
                                                        onClick={() => setShowActionMenu(showActionMenu === client.id ? null : client.id)}
                                                        className="text-[#667085] hover:text-[#101828] p-1"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>
                                                    {showActionMenu === client.id && (
                                                        <div 
                                                            className="absolute right-0 mt-1 bg-white border border-[#E4E7EC] rounded-lg shadow-lg z-10"
                                                            style={{ width: '120px' }}
                                                        >
                                                            <button
                                                                onClick={() => handleEditClient(client)}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#344054] hover:bg-[#F9FAFB] first:rounded-t-lg"
                                                            >
                                                                <Edit size={14} />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteClient(client)}
                                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#F04438] hover:bg-[#FEF3F2] last:rounded-b-lg"
                                                            >
                                                                <Trash2 size={14} />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <button 
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 hover:bg-[#F9FAFB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.5 15L7.5 10L12.5 5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-1 rounded-lg text-sm ${currentPage === page
                                                    ? 'bg-[#2F80ED] text-white'
                                                    : 'text-[#667085] hover:bg-[#F9FAFB]'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                
                                {totalPages > 5 && (
                                    <>
                                        <span className="px-2 text-[#667085]">...</span>
                                        <button 
                                            onClick={() => setCurrentPage(totalPages)}
                                            className={`px-3 py-1 rounded-lg text-sm ${currentPage === totalPages
                                                    ? 'bg-[#2F80ED] text-white'
                                                    : 'text-[#667085] hover:bg-[#F9FAFB]'
                                                }`}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                                
                                <button 
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 hover:bg-[#F9FAFB] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M7.5 15L12.5 10L7.5 5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Client Modal */}
                <ClientModal
                    isOpen={showAddModal}
                    formData={formData}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleSaveClient}
                    onChange={setFormData}
                    isLoading={isLoading}
                    isEdit={isEditMode}
                    error={clientFormError}
                />

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg w-full max-w-md p-6">
                            <div className="flex justify-end mb-4">
                                <button onClick={() => setShowSuccessModal(false)} className="text-[#667085]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.281 18.2194C19.3507 18.289 19.406 18.3718 19.4437 18.4628C19.4814 18.5539 19.5008 18.6514 19.5008 18.75C19.5008 18.8485 19.4814 18.9461 19.4437 19.0372C19.406 19.1282 19.3507 19.2109 19.281 19.2806C19.2114 19.3503 19.1286 19.4056 19.0376 19.4433C18.9465 19.481 18.849 19.5004 18.7504 19.5004C18.6519 19.5004 18.5543 19.481 18.4632 19.4433C18.3722 19.4056 18.2895 19.3503 18.2198 19.2806L12.0004 13.0603L5.78104 19.2806C5.64031 19.4213 5.44944 19.5004 5.25042 19.5004C5.05139 19.5004 4.86052 19.4213 4.71979 19.2806C4.57906 19.1399 4.5 18.949 4.5 18.75C4.5 18.551 4.57906 18.3601 4.71979 18.2194L10.9401 12L4.71979 5.78061C4.57906 5.63988 4.5 5.44901 4.5 5.24999C4.5 5.05097 4.57906 4.8601 4.71979 4.71936C4.86052 4.57863 5.05139 4.49957 5.25042 4.49957C5.44944 4.49957 5.64031 4.57863 5.78104 4.71936L12.0004 10.9397L18.2198 4.71936C18.3605 4.57863 18.5514 4.49957 18.7504 4.49957C18.9494 4.49957 19.1403 4.57863 19.281 4.71936C19.4218 4.8601 19.5008 5.05097 19.5008 5.24999C19.5008 5.44901 19.4218 5.63988 19.281 5.78061L13.0607 12L19.281 18.2194Z" fill="black" />
                                    </svg>

                                </button>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M34.364 6.85053C38.6205 -2.28351 51.3795 -2.28351 55.636 6.85053C58.0129 11.951 63.5594 14.6722 68.9556 13.3853C78.6192 11.0807 86.5743 21.2433 82.2185 30.3287C79.7862 35.402 81.1561 41.5165 85.5082 45.0122C93.3019 51.2725 90.4628 63.9451 80.7747 66.1403C75.3648 67.3661 71.5265 72.2695 71.5572 77.9156C71.6123 88.0265 60.1169 93.6664 52.3918 87.3184C48.0781 83.7737 41.9219 83.7737 37.6082 87.3184C29.8831 93.6664 18.3877 88.0266 18.4428 77.9156C18.4735 72.2695 14.6352 67.3661 9.22531 66.1403C-0.462787 63.9451 -3.30193 51.2725 4.49185 45.0122C8.84391 41.5165 10.2138 35.402 7.78151 30.3287C3.42572 21.2433 11.3808 11.0807 21.0444 13.3853C26.4406 14.6722 31.9871 11.951 34.364 6.85053Z" fill="#E7FEF8" />
                                    <path d="M51.7777 40.5973C51.8881 40.7076 51.9757 40.8386 52.0354 40.9828C52.0952 41.1269 52.1259 41.2814 52.1259 41.4375C52.1259 41.5936 52.0952 41.7481 52.0354 41.8922C51.9757 42.0364 51.8881 42.1674 51.7777 42.2777L43.4652 50.5902C43.3549 50.7006 43.2239 50.7882 43.0797 50.8479C42.9356 50.9077 42.7811 50.9384 42.625 50.9384C42.469 50.9384 42.3144 50.9077 42.1703 50.8479C42.0261 50.7882 41.8951 50.7006 41.7849 50.5902L38.2224 47.0277C37.9995 46.8048 37.8743 46.5026 37.8743 46.1875C37.8743 45.8724 37.9995 45.5702 38.2224 45.3473C38.4452 45.1245 38.7474 44.9993 39.0625 44.9993C39.3776 44.9993 39.6798 45.1245 39.9027 45.3473L42.625 48.0712L50.0973 40.5973C50.2076 40.4869 50.3386 40.3993 50.4828 40.3396C50.6269 40.2798 50.7815 40.2491 50.9375 40.2491C51.0936 40.2491 51.2481 40.2798 51.3922 40.3396C51.5364 40.3993 51.6674 40.4869 51.7777 40.5973ZM60.4375 45C60.4375 48.0532 59.5321 51.0379 57.8358 53.5766C56.1395 56.1153 53.7285 58.094 50.9077 59.2624C48.0868 60.4308 44.9829 60.7365 41.9883 60.1409C38.9937 59.5452 36.243 58.0749 34.084 55.916C31.9251 53.757 30.4548 51.0063 29.8591 48.0117C29.2635 45.0171 29.5692 41.9132 30.7376 39.0923C31.906 36.2715 33.8847 33.8605 36.4234 32.1642C38.9621 30.4679 41.9468 29.5625 45 29.5625C49.093 29.5668 53.017 31.1947 55.9112 34.0888C58.8053 36.983 60.4332 40.907 60.4375 45ZM58.0625 45C58.0625 42.4165 57.2964 39.891 55.8611 37.7429C54.4258 35.5947 52.3857 33.9205 49.9988 32.9318C47.6119 31.9432 44.9855 31.6845 42.4516 32.1885C39.9178 32.6925 37.5902 33.9366 35.7634 35.7634C33.9366 37.5902 32.6925 39.9178 32.1885 42.4516C31.6845 44.9855 31.9432 47.6119 32.9318 49.9988C33.9205 52.3857 35.5948 54.4257 37.7429 55.8611C39.891 57.2964 42.4165 58.0625 45 58.0625C48.4632 58.0586 51.7834 56.6811 54.2323 54.2322C56.6811 51.7834 58.0586 48.4632 58.0625 45Z" fill="#40C4AA" />
                                </svg>

                                <h2 className="text-xl font-semibold text-[#000000] mb-2">Client added successfully</h2>
                                <p className="text-sm text-[#333436] mb-6">
                                    You can now create an invoice for this client.
                                </p>
                                <div className="flex items-center gap-3 w-full">
                                    <button
                                        onClick={() => setShowSuccessModal(false)}
                                        className="flex-1 px-6 py-3 border border-[#2F80ED] 
                                        text-[#2F80ED] rounded-lg text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateInvoice}
                                        className="flex-1 px-6 py-3 bg-[#2F80ED] text-[#FFFFFF] 
                                        rounded-lg text-sm font-medium"
                                    >
                                        Create Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDeleteClient}
                title="Delete Client"
                message={`Are you sure you want to delete ${deleteModal.client?.fullName}? This action cannot be undone and will remove all associated data.`}
                type="client"
                isLoading={deleteModal.isLoading}
            />
        </div>
    );
};

export default ClientsPage;