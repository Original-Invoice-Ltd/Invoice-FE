import SideBar from "@/components/customer/sideBar";
import Header from "@/components/customer/header";

export default function CustomerFlowPage() {
  return (
    <div className="min-h-screen">
        <Header/>
      <SideBar 
        invoiceStatus="UNPAID"
        totalDue={0}
        currency="NGN"
      />
    </div>
  );
}
