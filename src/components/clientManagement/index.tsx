"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import DashboardSideBar from "../dashboardSidebar";
import DashboardHeader from "../dashboardHeader";
import AddClientModal from "./AddClientModal";
import SuccessModal from "./SuccessModal";
import ClientsHeader from "./ClientsHeader";
import ClientTable from "./ClientTable";
import EmptyState from "./EmptyState";

interface Client {
    id: string;
    title: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    taxId: string;
    balance: string;
}

const ClientManagement = () => {
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [formData, setFormData] = useState({
        customerType: "",
        title: "",
        fullName: "",
        businessName: "",
        email: "",
        phone: "",
        country: "",
        businessRegNumber: "",
        taxId: "",
    });

    const handleAddClient = () => {
        setShowAddClientModal(true);
    };

    const handleSaveClient = () => {
        const newClient: Client = {
            id: `CLI-${Date.now()}`,
            title: formData.title,
            name: formData.fullName,
            company: formData.businessName,
            email: formData.email,
            phone: formData.phone,
            taxId: formData.taxId,
            balance: "₦0",
        };
        
        setClients([...clients, newClient]);
        setShowAddClientModal(false);
        setShowSuccessModal(true);
        
        // Reset form
        setFormData({
            customerType: "",
            title: "",
            fullName: "",
            businessName: "",
            email: "",
            phone: "",
            country: "",
            businessRegNumber: "",
            taxId: "",
        });
    };

    const handleCancel = () => {
        setShowAddClientModal(false);
        setFormData({
            customerType: "",
            title: "",
            fullName: "",
            businessName: "",
            email: "",
            phone: "",
            country: "",
            businessRegNumber: "",
            taxId: "",
        });
    };

    const handleCreateInvoice = () => {
        setShowSuccessModal(false);
        // Navigate to invoice creation
    };

    return (
        <div className="flex h-screen bg-[#F9FAFB]">
            <DashboardSideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
                
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Header Section */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#101828] mb-2">Clients Management</h1>
                            <p className="text-sm text-[#667085]">Manage your client database, track payments, and view billing history.</p>
                        </div>
                        <button 
                            onClick={handleAddClient}
                            className="flex items-center gap-2 px-4 py-3 bg-[#2F80ED] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB]"
                        >
                            <Plus size={18} />
                            Add Client
                        </button>
                    </div>

                    {/* All Clients Section */}
                    <div className="bg-white rounded-lg border border-[#E4E7EC] p-6">
                        <ClientsHeader 
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        {clients.length === 0 ? (
                            <EmptyState onAddClient={handleAddClient} />
                        ) : (
                            <ClientTable clients={clients} />
                        )}
                    </div>
                </div>
            </div>

            <AddClientModal 
                isOpen={showAddClientModal}
                formData={formData}
                onClose={handleCancel}
                onSave={handleSaveClient}
                onChange={setFormData}
            />

            <SuccessModal 
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onCreateInvoice={handleCreateInvoice}
            />
        </div>
    );
};

export default ClientManagement;
