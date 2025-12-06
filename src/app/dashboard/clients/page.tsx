"use client";

import { useState } from "react";
import { Search, Plus, ChevronDown } from "lucide-react";

const ClientsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="w-full max-w-[1108px]">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-[#101828] mb-2">Clients Management</h1>
                    <p className="text-[14px] text-[#667085]">
                        Manage your client database, track payments, and view<br/> billing history.
                    </p>
                </div>
                <button className="hidden lg:flex items-center gap-2 px-6 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors h-12">
                    <Plus size={20} />
                    Add Client
                </button>
            </div>

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
                </div>

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
