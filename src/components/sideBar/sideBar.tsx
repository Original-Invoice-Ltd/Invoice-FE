"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideBar = ({ isOpen, onClose }: SideBarProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const getActiveTab = () => {
        if (pathname === "/") return "Home";
        if (pathname === "/pricing") return "Pricing";
        if (pathname === "/features") return "Features";
        if (pathname === "/aboutUs") return "About Us";
        if (pathname === "/contact") return "Contact Us";
        return "Home";
    };

    const activeTab = getActiveTab();

    const handleNavClick = (item: string) => {
        if (item === "Home") {
            router.push("/");
        } else if (item === "Pricing") {
            router.push("/pricing");
        } else if (item === "Features") {
            router.push("/features");
        } else if (item === "About Us") {
            router.push("/aboutUs");
        } else if (item === "Contact Us") {
            router.push("/contact");
        }
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-transparent z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-[320px] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col p-6">
                    {/* Header with Logo and Close Button */}
                    <div className="flex items-center justify-between mb-8">
                        <Image
                            src="/assets/header logo.svg"
                            alt="Logo"
                            width={84}
                            height={32}
                        />
                        <button onClick={onClose} className="text-gray-600">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18 6L6 18M6 6L18 18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <nav className="flex flex-col gap-4 mb-4">
                        <button
                            onClick={() => handleNavClick("Home")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                                activeTab === "Home"
                                    ? "bg-[#2F80ED] text-white"
                                    : "text-gray-700"
                            }`}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M3 10L10 3L17 10V17C17 17.5304 16.7893 18.0391 16.4142 18.4142C16.0391 18.7893 15.5304 19 15 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V10Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="font-medium">Home</span>
                        </button>

                        <button
                            onClick={() => handleNavClick("Features")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                                activeTab === "Features"
                                    ? "bg-[#2F80ED] text-white"
                                    : "text-gray-700"
                            }`}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                            <span className="font-medium">Features</span>
                        </button>

                        <button
                            onClick={() => handleNavClick("About Us")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                                activeTab === "About Us"
                                    ? "bg-[#2F80ED] text-white"
                                    : "text-gray-700"
                            }`}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M3 17C3 14.2386 5.68629 12 9 12H11C14.3137 12 17 14.2386 17 17"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                            </svg>
                            <span className="font-medium">About Us</span>
                        </button>

                        <button
                            onClick={() => handleNavClick("Pricing")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                                activeTab === "Pricing"
                                    ? "bg-[#2F80ED] text-white"
                                    : "text-gray-700"
                            }`}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M10 3V17M13 6H8.5C7.83696 6 7.20107 6.26339 6.73223 6.73223C6.26339 7.20107 6 7.83696 6 8.5C6 9.16304 6.26339 9.79893 6.73223 10.2678C7.20107 10.7366 7.83696 11 8.5 11H11.5C12.163 11 12.7989 11.2634 13.2678 11.7322C13.7366 12.2011 14 12.837 14 13.5C14 14.163 13.7366 14.7989 13.2678 15.2678C12.7989 15.7366 12.163 16 11.5 16H6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="font-medium">Pricing</span>
                        </button>

                        <button
                            onClick={() => handleNavClick("Contact Us")}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left ${
                                activeTab === "Contact Us"
                                    ? "bg-[#2F80ED] text-white"
                                    : "text-gray-700"
                            }`}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M17 14.5C17 14.8978 16.842 15.2794 16.5607 15.5607C16.2794 15.842 15.8978 16 15.5 16H5.5L2 19V4.5C2 4.10218 2.15804 3.72064 2.43934 3.43934C2.72064 3.15804 3.10218 3 3.5 3H15.5C15.8978 3 16.2794 3.15804 16.5607 3.43934C16.842 3.72064 17 4.10218 17 4.5V14.5Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="font-medium">Contact Us</span>
                        </button>
                    </nav>

                    {/* Get Started Button */}
                    <button className="w-full bg-[#2F80ED] text-white py-3 rounded-lg font-medium">
                        Get Started
                    </button>
                </div>
            </div>
        </>
    );
};

export default SideBar;
