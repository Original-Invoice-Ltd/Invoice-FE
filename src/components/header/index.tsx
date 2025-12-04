"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "./../../../public/assets/header logo.svg";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SideBar from "../sideBar/sideBar";

interface HeaderProps {
    currentPage?: string;
}

const Header = ({ currentPage }: HeaderProps) => {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const getActiveTab = () => {
        if (pathname === "/") return "Home";
        if (pathname === "/pricing") return "Pricing";
        if (pathname === "/features") return "Features";
        if (pathname === "/aboutUs") return "About Us";
        if (pathname === "/contact") return "Contact Us";
        return currentPage || "Home";
    };

    const activeTab = getActiveTab();

    const allNavItems = [
        { name: "Home", path: "/" },
        { name: "Features", path: "/features" },
        { name: "About Us", path: "/aboutUs" },
        { name: "Pricing", path: "/pricing" },
        { name: "Contact Us", path: "/contact" }
    ];

    // Filter nav items based on current page - only show Features on home page
    const navItems = pathname === "/" 
        ? allNavItems 
        : allNavItems.filter(item => item.name !== "Features");

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: { name: string; path: string }) => {
        if (item.name === "Features" && pathname === "/") {
            e.preventDefault();
            const featuresSection = document.getElementById("features-section");
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <>
            <div className="w-full items-center flex justify-center mt-[30px] px-4">
                {/* Desktop Header */}
                <div className="hidden lg:flex w-[1224px] mx-[108px] h-[80px] border border-[#E4E7EC] justify-between rounded-full items-center px-8 bg-white">
                    <Link href="/" className="flex items-center gap-[3.05px] cursor-pointer">
                        <Image src={logo} height={32} width={84} alt="headerLogo" className="w-[84px] h-[32px]" />
                    </Link>

                    <div className="flex gap-6 items-center text-[15px]">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={(e) => handleNavClick(e, item)}
                                className="relative cursor-pointer"
                            >
                                {item.name}
                                {activeTab === item.name && (
                                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#2F80ED]"></span>
                                )}
                            </Link>
                        ))}
                    </div>

                    <Link href="/signUp" className="text-white flex justify-center items-center bg-[#2F80ED] py-[12px] px-[16px] h-[46px] w-[150px] rounded-md font-medium">
                        Get Started
                    </Link>
                </div>

                {/* Mobile Header */}
                <div className="flex lg:hidden w-full max-w-[390px] h-[60px] justify-between items-center px-4 bg-white">
                    <Link href="/" className="flex items-center cursor-pointer">
                        <Image src={logo} height={28} width={74} alt="headerLogo" />
                    </Link>

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
