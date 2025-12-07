import { Plus } from "lucide-react";

interface ProductHeaderProps {
    onAddProduct: () => void;
}

export const ProductHeader = ({ onAddProduct }: ProductHeaderProps) => {
    return (
        <div className=" flex w-[1108px] h-[68px] justify-between opacity-100 absolute top-[98px] left-[304px]">
            <div className="w-[360px] h-[68px] opacity-100 gap-[4px] flex flex-col">
                <h1 className="w-[360px] h-[24px] opacity-100 bg-black text-[20px] leading-[120%] tracking-[0] font-semibold font-['Inter_Tight']" style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                    Products
                </h1>
                <p className="w-[360px] h-[40px] opacity-100 bg-[#333436] text-[14px] leading-[140%] tracking-[1%] font-normal font-['Inter_Tight']" style={{ fontFamily: 'Inter Tight, sans-serif', letterSpacing: '0.01em' }}>
                    Manage the items you sell and reuse them easily when <br />creating invoices.
                </p>
            </div>
            <button
                onClick={onAddProduct}
                className="flex items-center gap-2 w-[139px] h-12 px-4 py-3 bg-[#2F80ED] text-white rounded-lg hover:bg-[#2563EB] transition-colors"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 12V7M12 12V17M12 12H17M12 12H7" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                Add Product
            </button>
        </div>
    );
};
