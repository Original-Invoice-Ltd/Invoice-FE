import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice - Original Invoice",
  description: "View your invoice details",
};

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {children}
    </div>
  );
}