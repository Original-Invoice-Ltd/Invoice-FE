"use client";

import Image from "next/image";
import logo from "./../../../public/assets/header logo.svg";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import SideBar from "../sideBar/sideBar";

interface HeaderProps {
    currentPage?: string;
}

const Header = ({ currentPage }: HeaderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const getActiveTab = () => {
        if (pathname === "/") return "Home";
        if (pathname === "/pricing") return "Pricing";
        if (pathname === "/features") return "Features";
        if (pathname === "/about") return "About Us";
        if (pathname === "/contact") return "Contact Us";
        return currentPage || "Home";
    };

    const activeTab = getActiveTab();

    const navItems = ["Home", "Features", "About Us", "Pricing", "Contact Us"];

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
    };

    return (
        <>
            <div className="w-full items-center flex justify-center mt-[30px] px-4">
                {/* Desktop Header */}
                <div className="hidden lg:flex w-[1224px] mx-[108px] h-[80px] border border-[#E4E7EC] justify-between rounded-full items-center px-8 bg-white">
                    <div className="flex items-center gap-[3.05px] cursor-pointer" onClick={() => router.push("/")}>
                        <Image src={logo} height={32} width={84} alt="headerLogo" className="w-[84px] h-[32px]" />
                    </div>

                    <div className="flex gap-6 items-center text-[15px]">
                        {navItems.map((item) => (
                            <span
                                key={item}
                                className="relative cursor-pointer"
                                onClick={() => handleNavClick(item)}
                            >
                                {item}
                                {activeTab === item && (
                                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#2F80ED]"></span>
                                )}
                            </span>
                        ))}
                    </div>

                    <button className="text-white flex justify-center items-center bg-[#2F80ED] py-[12px] px-[16px] h-[46px] w-[150px] rounded-md font-medium">
                        Get Started
                    </button>
                </div>

                {/* Mobile Header */}
                <div className="flex lg:hidden w-full max-w-[390px] h-[60px] justify-between items-center px-4 bg-white">
                    <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
                        <Image src={logo} height={28} width={74} alt="headerLogo" />
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M3 12H21M3 6H21M3 18H21"
                                stroke="#000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};

export default Header;
