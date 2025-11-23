import FAQItem from "@/components/FAQ/FAQItem";

const FAQ = ()=>{
    return (
        <>
            {/* FAQ Section */}
            <div className="w-full bg-[#eff8ff] py-[40px] lg:py-[60px]">
                <div className="max-w-[1280px] mx-auto px-4 lg:px-[80px]">
                    <div className="text-center mb-[40px] lg:mb-[60px]">
                        <span className=" inline-block px-[16px] py-[6px] bg-[#e0f1ff] text-[#2F80ED] text-[14px] font-medium rounded-[16px] mb-[12px]">
                            FAQ
                        </span>
                        <h2 className="text-[24px] lg:text-[38px] font-medium text-[#000] mb-[16px] leading-tight">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-[14px] lg:text-[18px] text-[#333436] max-w-[358px] lg:max-w-[600px] mx-auto leading-tight">
                            Everything you need to know about using Original Invoice for billing, payments, and tax-compliant invoicing in Nigeria.
                        </p>
                    </div>

                    <div className="max-w-[800px] mx-auto">
                        <FAQItem
                            question="Can I customize my invoices?"
                            answer="Yes. You can upload your logo, edit your business details, choose a template layout, and even send invoices in multiple languages (English, Hausa, Igbo, Yoruba)."
                        />

                        <FAQItem
                            question="Can I track all my payments and outstanding invoices?"
                            answer="Absolutely! Our payment tracking system gives you real-time visibility into all your invoices. You can see which invoices are paid, pending, overdue, or in draft status. The dashboard provides clear indicators and allows you to quickly mark payments as received, send reminders, and generate reports on your cash flow."
                        />

                        <FAQItem
                            question="Is it mobile-friendly?"
                            answer="Yes, Original Invoice is fully responsive and works seamlessly on all devices including smartphones and tablets. You can create, send, and manage invoices on the go. The mobile interface is optimized for touch interactions while maintaining all the functionality of the desktop version."
                        />

                        <FAQItem
                            question="Do you support multiple languages?"
                            answer="Yes! We support multiple Nigerian languages including English, Hausa, Igbo, and Yoruba. You can create and send invoices in your client's preferred language, making communication clearer and more professional. This feature is especially useful for businesses serving diverse communities across Nigeria."
                        />

                        <FAQItem
                            question="Do I need accounting knowledge to use the platform?"
                            answer="Not at all! Original Invoice is designed to be user-friendly for everyone, regardless of accounting background. The platform automatically handles tax calculations (VAT, WHT), provides guided workflows, and includes helpful tooltips. However, we do recommend consulting with an accountant for complex business scenarios."
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
export default FAQ;