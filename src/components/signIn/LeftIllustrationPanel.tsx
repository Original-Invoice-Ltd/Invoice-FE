import bgImage from './../../../public/assets/Logo Area.svg';
import Image from "next/image";

export default function LeftIllustrationPanel() {
    return (
        <div
            className="hidden lg:flex lg:w-1/2 relative p-10"
            style={{
                backgroundImage: `url(${bgImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="relative z-10 flex flex-col justify-center text-white max-w-md">

                <h1 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
                    Automate your invoicing, stay tax-compliant,
                </h1>

                <p className="text-lg text-blue-100 mb-8">
                    Generate invoices, manage clients, and handle VAT/WHT effortlessly.
                </p>

                <Image
                    width={705}
                    height={984}
                    src="/assets/automated_invoice.svg"
                    alt="Automated Invoice Illustration"
                    className="w-full max-w-md"
                />
            </div>
        </div>
    );
}
