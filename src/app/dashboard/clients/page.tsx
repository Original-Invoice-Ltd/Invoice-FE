"use client";

import { useState } from "react";
import { Search, Plus, X, Check, MoreVertical, ChevronDown, Mail, Phone } from "lucide-react";

interface Client {
    id: string;
    title: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    taxId: string;
    balance: string;
}


const ClientsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [clients, setClients] = useState<Client[]>([]);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        customerType: "",
        title: "Mr",
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        country: "",
        businessRegNumber: "",
        taxId: "",
    });

    const handleSaveClient = () => {
        const newClient: Client = {
            id: `${clients.length + 1}`,
            title: formData.title,
            name: formData.fullName,
            company: formData.businessName,
            email: formData.email,
            phone: formData.phone,
            taxId: formData.taxId || "#000000000",
            balance: "₦0",
        };

        setClients([...clients, newClient]);
        setShowAddModal(false);
        setShowSuccessModal(true);

        setFormData({
            customerType: "",
            title: "Mr",
            fullName: "",
            businessName: "",
            email: "",
            phone: "",
            country: "",
            businessRegNumber: "",
            taxId: "",
        });
    };

    const totalPages = 99;

    return (
        <div className="p-6">
            <div className="max-w-[1108px] mx-auto">
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
                        onClick={() => setShowAddModal(true)}
                        className="hidden lg:flex items-center gap-2 w-[139px] h-12 px-4 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        <Plus size={20} />
                        Add Client
                    </button>

                </div>
                <button className="hidden lg:flex items-center gap-2 px-6 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors h-12">
                    <Plus size={20} />
                    Add Client
                </button>
            </div>


                {/* Mobile Add Client Button */}
                <div className="lg:hidden mb-6">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
                    >
                        <Plus size={20} />
                        Add Client
                    </button>
                </div>

                {/* Conditional Rendering: Empty State or Table */}
                {clients.length === 0 ? (
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
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-[#EFF8FF] transition-colors"
                        >
                            <Plus size={20} />
                            Add Client

            {/* Mobile Add Client Button */}
            <div className="lg:hidden mb-6">
                <button className="w-full flex items-center justify-center gap-2 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors h-12">
                    <Plus size={20} />
                    Add Client
                </button>
            </div>

            {/* White Container with All Clients Section and Empty State */}
            <div className="bg-white rounded-lg border border-[#E4E7EC]">
                {/* All Clients Section - Inside Container */}
                <div className="flex items-center justify-between p-6 ">
                    <h2 className="text-lg font-semibold text-[#101828]">All Clients</h2>
                    
                    <div className="flex items-center gap-3">
                        {/* Search Bar */}
                        <div className="relative w-48 lg:w-64">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.8807 13.8807C16.4842 11.2772 16.4842 7.05612 13.8807 4.45262C11.2772 1.84913 7.05612 1.84913 4.45262 4.45262C1.84913 7.05612 1.84913 11.2772 4.45262 13.8807C7.05612 16.4842 11.2772 16.4842 13.8807 13.8807ZM13.8807 13.8807L17.5 17.5M6.2204 6.22039C7.84758 4.5932 10.4858 4.5932 12.113 6.22039" stroke="#7D7F81" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search clients"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED] bg-white"
                            />
                        </div>

                        {/* Sort Dropdown - Desktop Only */}
                        <button className="hidden lg:flex items-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] hover:bg-gray-50 h-10">
                            Sort by
                            <ChevronDown size={16} />
                        </button>
                    </div>
                ) : (
                    /* Table View */
                    <div className="bg-white rounded-lg border border-[#E4E7EC] pt-4 pr-[14px] pl-[14px] pb-4 h-[792px] flex flex-col gap-[18px]">
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
                                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm text-[#344054] hover:bg-[#F9FAFB]">
                                    Sort by
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>


                        {/* Table */}
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full">
                                <thead className="bg-[#F9FAFB] border-y border-[#E4E7EC]">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Title</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Client Name</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Company Name</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Email Address</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Phone Number</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Tax ID</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Balance Due</th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-[#667085]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((client, index) => (
                                        <tr key={index} className="border-b border-[#E4E7EC] hover:bg-[#F9FAFB]">
                                            <td className="px-6 py-4 text-sm text-[#101828]">{client.title}</td>
                                            <td className="px-6 py-4 text-sm text-[#101828]">{client.name}</td>
                                            <td className="px-6 py-4 text-sm text-[#101828]">{client.company}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085]">{client.email}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085]">{client.phone}</td>
                                            <td className="px-6 py-4 text-sm text-[#667085]">{client.taxId}</td>
                                            <td className="px-6 py-4 text-sm text-[#101828] font-medium">{client.balance}</td>
                                            <td className="px-6 py-4">
                                                <button className="text-[#667085] hover:text-[#101828]">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2">
                            <button className="p-2 hover:bg-[#F9FAFB] rounded-lg">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M12.5 15L7.5 10L12.5 5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            {[1, 2, 3, 4, 5].map((page) => (
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
                            ))}
                            <span className="px-2 text-[#667085]">...</span>
                            <button className="px-3 py-1 rounded-lg text-sm text-[#667085] hover:bg-[#F9FAFB]">
                                99
                            </button>
                            <button className="p-2 hover:bg-[#F9FAFB] rounded-lg">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                {/* Add Client Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(197, 199, 202, 0.90)' }}>
                        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h2 className="text-xl font-semibold text-[#000000]">Add New Client</h2>
                                    <button onClick={() => setShowAddModal(false)} className="text-[#667085] hover:text-[#101828]">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M19.281 18.2194C19.3507 18.289 19.406 18.3718 19.4437 18.4628C19.4814 18.5539 19.5008 18.6514 19.5008 18.75C19.5008 18.8485 19.4814 18.9461 19.4437 19.0372C19.406 19.1282 19.3507 19.2109 19.281 19.2806C19.2114 19.3503 19.1286 19.4056 19.0376 19.4433C18.9465 19.481 18.849 19.5004 18.7504 19.5004C18.6519 19.5004 18.5543 19.481 18.4632 19.4433C18.3722 19.4056 18.2895 19.3503 18.2198 19.2806L12.0004 13.0603L5.78104 19.2806C5.64031 19.4213 5.44944 19.5004 5.25042 19.5004C5.05139 19.5004 4.86052 19.4213 4.71979 19.2806C4.57906 19.1399 4.5 18.949 4.5 18.75C4.5 18.551 4.57906 18.3601 4.71979 18.2194L10.9401 12L4.71979 5.78061C4.57906 5.63988 4.5 5.44901 4.5 5.24999C4.5 5.05097 4.57906 4.8601 4.71979 4.71936C4.86052 4.57863 5.05139 4.49957 5.25042 4.49957C5.44944 4.49957 5.64031 4.57863 5.78104 4.71936L12.0004 10.9397L18.2198 4.71936C18.3605 4.57863 18.5514 4.49957 18.7504 4.49957C18.9494 4.49957 19.1403 4.57863 19.281 4.71936C19.4218 4.8601 19.5008 5.05097 19.5008 5.24999C19.5008 5.44901 19.4218 5.63988 19.281 5.78061L13.0607 12L19.281 18.2194Z" fill="black" />
                                        </svg>

                                    </button>
                                </div>
                                <p className="text-sm text-[#333436] mb-6">
                                    Save your client's business details to send invoices and track payments easily
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <span className="text-[#000000]">Customer Type</span>
                                            <span className="text-[#F04438]">*</span>
                                        </label>

                                        <select
                                            value={formData.customerType}
                                            onChange={(e) => setFormData({ ...formData, customerType: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                        >
                                            <option value="">Select customer type</option>
                                            <option value="individual">Individual</option>
                                            <option value="business">Business</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <span className="text-[#000000]">Title</span>
                                                <span className="text-[#F04438]">*</span>
                                            </label>

                                            <select
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-0"
                                            >
                                                <option value="Mr">Mr</option>
                                                <option value="Mrs">Mrs</option>
                                                <option value="Ms">Ms</option>
                                                <option value="Miss">Miss</option>
                                                <option value="Dr">Dr</option>
                                                <option value="Engr">Engr</option>
                                                <option value="Hon">Hon</option>
                                                <option value="Capt">Capt</option>
                                                <option value="Gen">Gen</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <span className="text-[#000000]">Client Full Name</span>
                                                <span className="text-[#F04438]">*</span>
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter client full name"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80ED]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            <span className="text-[#000000]">Business Name</span>
                                            <span className="text-[#F04438]">*</span>
                                        </label>

                                        <input
                                            type="text"
                                            placeholder="Enter business name"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-0"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <span className="text-[#000000]">Email Address</span>
                                                <span className="text-[#F04438]">*</span>
                                            </label>

                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    placeholder="Enter client email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-0"
                                                />
                                                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                <span className="text-[#000000]">Phone Number</span>
                                                <span className="text-[#F04438]">*</span>
                                            </label>

                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    placeholder="Enter client phone number"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full pl-4 pr-10 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-0"
                                                />
                                                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#667085]" size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#000000] mb-2">Country</label>
                                        <select
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-0"
                                        >
                                            <option value="">Select customer country</option>
                                            <option value="nigeria">Nigeria</option>
                                            <option value="ghana">Ghana</option>
                                            <option value="kenya">Kenya</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#000000] mb-2">Business Registration Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter client business Reg Number"
                                                value={formData.businessRegNumber}
                                                onChange={(e) => setFormData({ ...formData, businessRegNumber: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#000000] mb-2">Tax Identification Number</label>
                                            <input
                                                type="text"
                                                placeholder="Enter client Tax ID"
                                                value={formData.taxId}
                                                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                                className="w-full px-4 py-2 border border-[#D0D5DD] rounded-lg text-sm focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 mt-6">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-3 border border-[#2F80ED] text-[#2F80ED] rounded-lg text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveClient}
                                        className="flex-1 px-6 py-3 bg-[#2F80ED] text-[#FFFFFF] rounded-lg text-sm font-medium"
                                    >
                                        Save Client
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(197, 199, 202, 0.95)' }}>
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
                                        onClick={() => setShowSuccessModal(false)}
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

                {/* Empty State */}
                <div className="p-12 lg:p-16 flex flex-col items-center justify-center min-h-[400px]">
                <div className="mb-6">
                    <svg width="108" height="108" viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="108" height="108" rx="54" fill="#EFF8FF"/>
                        <rect x="25.7227" y="29.2847" width="48.1432" height="60.7297" rx="3.05155" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <path d="M31.0137 26.5504V77.0432C31.0137 81.469 34.5989 85.0541 39.0246 85.0541H73.657C76.6966 85.0541 79.1572 82.5935 79.1572 79.5539V26.5504C79.1572 25.3201 78.1607 24.3236 76.9304 24.3236H33.2405C32.0102 24.3236 31.0137 25.3201 31.0137 26.5504Z" fill="white" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <rect x="45.2949" y="21.173" width="19.5791" height="6.30367" rx="1.52577" fill="#CACFD8" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <path d="M51.082 18.6081C51.082 16.3915 52.8789 14.5946 55.0955 14.5946C57.3121 14.5946 59.1091 16.3915 59.1091 18.6081V21.1622H51.082V18.6081Z" fill="#CACFD8" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <circle cx="55.0855" cy="18.2368" r="1.8179" fill="white"/>
                        <path d="M79.4395 29.2847H81.3899C83.0752 29.2847 84.4414 30.6509 84.4414 32.3362V41.3502C84.4414 43.0356 83.0752 44.4018 81.3899 44.4018H79.4395V29.2847Z" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <path d="M79.4395 64.1874H81.3899C83.0752 64.1874 84.4414 65.5536 84.4414 67.2389V76.253C84.4414 77.9383 83.0752 79.3045 81.3899 79.3045H79.4395V64.1874Z" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <path d="M43.8109 43.3237H40.2402" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M39.9672 43.1488C38.9103 42.4019 38.2765 41.098 38.4997 39.6626C38.7413 38.1111 40.0345 36.8727 41.5943 36.69C43.7593 36.4358 45.5965 38.1212 45.5965 40.2351C45.5965 41.4402 44.9978 42.5037 44.0831 43.15C43.9188 43.266 43.8111 43.4458 43.8111 43.6469V45.2936C43.8111 46.1155 43.1452 46.7814 42.3233 46.7814H41.7282C40.9063 46.7814 40.2404 46.1155 40.2404 45.2936V43.6493C40.2404 43.4463 40.1321 43.2654 39.9672 43.1488Z" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M46.7871 37.2596L47.4953 36.5514" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M37.2648 43.2106L36.5566 43.9188" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M37.8605 36.6645L37.1523 35.9563" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M46.7871 43.2106L47.4953 43.9188" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M47.3828 40.2351H48.3886" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M35.6641 40.2351H36.6698" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M40.2402 44.9962H43.7336" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="51.9824" y="37.441" width="21.2561" height="2.70099" rx="0.762887" fill="#E1E4EA"/>
                        <rect x="51.9824" y="42.7086" width="12.2657" height="2.70099" rx="0.762887" fill="#E1E4EA"/>
                        <path d="M39.0234 85.0541L76.9515 85.0375C79.568 85.0375 81.689 82.922 81.689 80.3055C81.689 77.984 80.0078 76.0467 77.7977 75.6515L77.6474 75.6236L40.6379 69.1881C44.2953 69.9341 47.0399 73.163 47.0399 77.0432C47.0399 81.469 43.4547 85.0541 39.0234 85.0541Z" fill="#CACFD8" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <circle cx="79.4381" cy="25.338" r="8.94596" fill="#E1E4EA" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M73.6934 32.1954C73.9442 29.4699 76.0906 27.2933 78.8023 26.9957C77.3575 26.701 76.2705 25.4231 76.2705 23.8914C76.2705 22.1416 77.689 20.7231 79.4388 20.7231C81.1885 20.7231 82.607 22.1416 82.607 23.8914C82.607 25.4231 81.52 26.701 80.0753 26.9957C82.787 27.2932 84.9334 29.4698 85.1843 32.1952C83.63 33.4989 81.6261 34.2839 79.4388 34.2839C77.2515 34.2839 75.2476 33.4989 73.6934 32.1954Z" fill="#99A0AE"/>
                        <path d="M78.8023 26.9957L78.8568 27.4927C79.1016 27.4658 79.2904 27.2647 79.3017 27.0186C79.3131 26.7726 79.1435 26.555 78.9022 26.5058L78.8023 26.9957ZM73.6934 32.1954L73.1955 32.1495C73.1804 32.3128 73.2464 32.4731 73.3721 32.5785L73.6934 32.1954ZM80.0753 26.9957L79.9754 26.5058C79.734 26.555 79.5645 26.7726 79.5758 27.0186C79.5871 27.2647 79.7759 27.4658 80.0208 27.4927L80.0753 26.9957ZM85.1843 32.1952L85.5056 32.5783C85.6313 32.4729 85.6972 32.3127 85.6822 32.1494L85.1843 32.1952ZM78.8023 26.9957L78.7477 26.4987C75.8002 26.8221 73.4682 29.187 73.1955 32.1495L73.6934 32.1954L74.1913 32.2412C74.4203 29.7528 76.3809 27.7644 78.8568 27.4927L78.8023 26.9957ZM76.2705 23.8914H75.7705C75.7705 25.6655 77.0294 27.1444 78.7024 27.4856L78.8023 26.9957L78.9022 26.5058C77.6856 26.2577 76.7705 25.1808 76.7705 23.8914H76.2705ZM79.4388 20.7231V20.2231C77.4128 20.2231 75.7705 21.8654 75.7705 23.8914H76.2705H76.7705C76.7705 22.4177 77.9651 21.2231 79.4388 21.2231V20.7231ZM82.607 23.8914H83.107C83.107 21.8654 81.4647 20.2231 79.4388 20.2231V20.7231V21.2231C80.9124 21.2231 82.107 22.4177 82.107 23.8914H82.607ZM80.0753 26.9957L80.1752 27.4856C81.8481 27.1444 83.107 25.6654 83.107 23.8914H82.607H82.107C82.107 25.1808 81.1919 26.2576 79.9754 26.5058L80.0753 26.9957ZM85.1843 32.1952L85.6822 32.1494C85.4094 29.1869 83.0773 26.8221 80.1298 26.4986L80.0753 26.9957L80.0208 27.4927C82.4967 27.7644 84.4573 29.7527 84.6864 32.2411L85.1843 32.1952ZM85.1843 32.1952L84.863 31.8121C83.3954 33.0431 81.5042 33.7839 79.4388 33.7839V34.2839V34.7839C81.7479 34.7839 83.8647 33.9547 85.5056 32.5783L85.1843 32.1952ZM79.4388 34.2839V33.7839C77.3733 33.7839 75.4822 33.0431 74.0147 31.8123L73.6934 32.1954L73.3721 32.5785C75.013 33.9547 77.1297 34.7839 79.4388 34.7839V34.2839Z" fill="#99A0AE"/>
                        <circle cx="28.5612" cy="68.0229" r="8.94596" fill="white" stroke="#99A0AE" strokeMiterlimit="10"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M22.8145 74.8801C23.0654 72.155 25.2113 69.9786 27.9226 69.6807C26.4782 69.3858 25.3916 68.1081 25.3916 66.5765C25.3916 64.8267 26.81 63.4083 28.5598 63.4083C30.3096 63.4083 31.7281 64.8267 31.7281 66.5765C31.7281 68.108 30.6415 69.3857 29.1971 69.6807C31.9085 69.9786 34.0545 72.155 34.3054 74.8803C32.7512 76.1838 30.7473 76.9688 28.56 76.9688C26.3727 76.9688 24.3687 76.1838 22.8145 74.8801Z" fill="#99A0AE"/>
                        <path d="M27.9226 69.6807L27.9772 70.1777C28.222 70.1508 28.4107 69.9497 28.4221 69.7037C28.4334 69.4577 28.2639 69.2401 28.0226 69.1908L27.9226 69.6807ZM22.8145 74.8801L22.3166 74.8343C22.3015 74.9976 22.3675 75.1578 22.4931 75.2632L22.8145 74.8801ZM29.1971 69.6807L29.0971 69.1908C28.8558 69.2401 28.6863 69.4577 28.6977 69.7037C28.709 69.9497 28.8977 70.1508 29.1425 70.1777L29.1971 69.6807ZM34.3054 74.8803L34.6267 75.2634C34.7523 75.158 34.8183 74.9977 34.8033 74.8344L34.3054 74.8803ZM27.9226 69.6807L27.868 69.1837C24.9209 69.5075 22.5893 71.8721 22.3166 74.8343L22.8145 74.8801L23.3123 74.926C23.5414 72.4379 25.5017 70.4497 27.9772 70.1777L27.9226 69.6807ZM25.3916 66.5765H24.8916C24.8916 68.3503 26.15 69.8291 27.8226 70.1706L27.9226 69.6807L28.0226 69.1908C26.8064 68.9425 25.8916 67.8658 25.8916 66.5765H25.3916ZM28.5598 63.4083V62.9083C26.5339 62.9083 24.8916 64.5506 24.8916 66.5765H25.3916H25.8916C25.8916 65.1029 27.0862 63.9083 28.5598 63.9083V63.4083ZM31.7281 66.5765H32.2281C32.2281 64.5506 30.5858 62.9083 28.5598 62.9083V63.4083V63.9083C30.0335 63.9083 31.2281 65.1029 31.2281 66.5765H31.7281ZM29.1971 69.6807L29.2972 70.1706C30.9696 69.829 32.2281 68.3503 32.2281 66.5765H31.7281H31.2281C31.2281 67.8658 30.3133 68.9424 29.0971 69.1908L29.1971 69.6807ZM34.3054 74.8803L34.8033 74.8344C34.5306 71.8721 32.1989 69.5075 29.2517 69.1837L29.1971 69.6807L29.1425 70.1777C31.6181 70.4497 33.5785 72.4379 33.8075 74.9261L34.3054 74.8803ZM34.3054 74.8803L33.9841 74.4972C32.5165 75.7281 30.6254 76.4688 28.56 76.4688V76.9688V77.4688C30.8691 77.4688 32.9858 76.6396 34.6267 75.2634L34.3054 74.8803ZM28.56 76.9688V76.4688C26.4945 76.4688 24.6034 75.728 23.1358 74.497L22.8145 74.8801L22.4931 75.2632C24.1341 76.6396 26.2509 77.4688 28.56 77.4688V76.9688Z" fill="#99A0AE"/>
                        <path d="M16.6864 34.1082C16.6864 34.1082 12.3081 34.1231 12.3081 38.4866C12.3081 34.1231 7.92969 34.1082 7.92969 34.1082C7.92969 34.1082 12.3081 34.0933 12.3081 29.7298C12.3081 34.0933 16.6864 34.1082 16.6864 34.1082Z" fill="white" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M102.993 69.5925C102.993 69.5925 98.6147 69.6073 98.6147 73.9708C98.6147 69.6073 94.2363 69.5925 94.2363 69.5925C94.2363 69.5925 98.6147 69.5775 98.6147 65.2141C98.6147 69.5775 102.993 69.5925 102.993 69.5925Z" fill="white" stroke="#99A0AE" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="42.8688" cy="58.4382" r="2.48986" fill="#E1E4EA"/>
                        <circle cx="55.0856" cy="58.4382" r="2.48986" fill="#E1E4EA"/>
                        <circle cx="67.3024" cy="58.4382" r="2.48986" fill="#E1E4EA"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-[#101828] mb-2">No clients yet</h3>
                <p className="text-sm text-[#667085] mb-6 text-center max-w-md">
                    Add your first client to start sending invoices and tracking payments.
                </p>
                <button className="flex items-center gap-2 px-6 border border-[#2F80ED] text-[#2F80ED] rounded-lg hover:bg-[#EFF8FF] transition-colors h-12">
                    <Plus size={20} />
                    Add Client
                </button>
                </div>

            </div>
        </div>
    );
};

export default ClientsPage;