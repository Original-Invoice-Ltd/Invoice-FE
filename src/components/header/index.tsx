import Image from "next/image";
import logo from "./../../../public/assets/invoice logo.svg";
import BlueButton from "@/components/blueButton";

const Header = () => {
    return (
        <div className="w-full items-center flex justify-center mt-[30px]">
            <div className="w-[1224px] mx-[108px] h-[80px] border border-[#E4E7EC] justify-between rounded-full flex items-center px-8 bg-white">
                <div className="flex items-center gap-[3.05px]">
                    <Image src={logo} height={32} width={32} alt="headerLogo" className="w-[32px] h-[32px]" />
                    <p className="font-semibold text-[18px]">Original Invoice</p>
                </div>

                {/* Navigation */}
                <div className="flex gap-6 items-center text-[15px]">
                    <span className="relative cursor-pointer">
                        Home
                    <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#2F80ED]"></span>
                    </span>
                    <span className="cursor-pointer">Features</span>
                    <span className="cursor-pointer">About Us</span>
                    <span className="cursor-pointer">Pricing</span>
                    <span className="cursor-pointer">Contact Us</span>
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
