import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

const BlueButton = (width: number, height: number, text: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined)=>{
    return(
        <>
            <button
                style={{width:width,height:height}}
                className="text-white flex justify-center items-center bg-[#2F80ED] py-[12px] px-[16px] rounded-md font-medium">
                {text}
            </button>
        </>
    )
}

export default BlueButton