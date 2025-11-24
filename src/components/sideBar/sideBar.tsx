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
        if (pathname === "/about") return "About Us";
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
            router.push("/about");
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
                            <Image
                                src="/assets/icons/Home.svg"
                                alt="Home"
                                width={20}
                                height={20}
                                className={activeTab === "Home" ? "brightness-0 invert" : ""}
                            />
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
                            <Image
                                src="/assets/icons/Features.svg"
                                alt="Features"
                                width={20}
                                height={20}
                                className={activeTab === "Features" ? "brightness-0 invert" : ""}
                            />
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
                            <Image
                                src="/assets/icons/AboutUs.svg"
                                alt="About Us"
                                width={20}
                                height={20}
                                className={activeTab === "About Us" ? "brightness-0 invert" : ""}
                            />
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
                            <Image
                                src="/assets/icons/Pricing.svg"
                                alt="Pricing"
                                width={20}
                                height={20}
                                className={activeTab === "Pricing" ? "brightness-0 invert" : ""}
                            />
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
                            <Image
                                src="/assets/icons/ContactUs.svg"
                                alt="Contact Us"
                                width={20}
                                height={20}
                                className={activeTab === "Contact Us" ? "brightness-0 invert" : ""}
                            />
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
