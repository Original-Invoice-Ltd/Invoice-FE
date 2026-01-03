import { ReactNode } from "react"

interface BlueButtonProps {
    width?: number;
    height?: number;
    text: ReactNode;
}

const BlueButton = ({ width, height, text }: BlueButtonProps) => {
    return (
        <button
            style={{ width: width, height: height }}
            className="text-white flex justify-center items-center bg-[#2F80ED] py-[12px] px-[16px] rounded-md font-medium"
        >
            {text}
        </button>
    )
}

export default BlueButton