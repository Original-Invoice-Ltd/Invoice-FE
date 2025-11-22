"use client";

import Image from "next/image";
import logo from "./../../../public/assets/invoice logo.svg";
import BlueButton from "@/components/blueButton";
import { useState } from "react";

const Header = () => {
    const [activeTab, setActiveTab] = useState("Home");

    const navItems = ["Home", "Features", "About Us", "Pricing", "Contact Us"];

    return (
        <div className="w-full items-center flex justify-center mt-[30px]">
            <div className="w-[1224px] mx-[108px] h-[80px] border border-[#E4E7EC] justify-between rounded-full flex items-center px-8 bg-white">
                <div className="flex items-center gap-[3.05px]">
                    <Image src={logo} height={32} width={32} alt="headerLogo" className="w-[32px] h-[32px]" />
                    <p className="font-semibold text-[18px]">Original Invoice</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-6 items-center text-[15px]">
                    {navItems.map((item) => (
                        <span
                            key={item}
                            className="relative cursor-pointer"
                            onClick={() => setActiveTab(item)}
                        >
                            {item}
                            {activeTab === item && (
                                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#2F80ED]"></span>
                            )}
                        </span>
                    ))}
                </div>

                {/* Button */}
                <button className="text-white flex justify-center items-center bg-[#2F80ED] py-[12px] px-[16px] h-[46px] w-[150px] rounded-md font-medium">
                    Get Started
                </button>
                {/*<BlueButton height={46} width={150} text={"Get Started"} />*/}
            </div>
        </div>
    );
};

export default Header;
