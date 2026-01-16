"use client";

import { CustomerLayout } from "@/components/customerSection";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { mockInvoices } from "@/lib/mockData";

const CustomerDashboardPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    // Stats data
    const stats = {
        totalReceived: 42,
        paid: 30,
        pending: 7,
        overdue: 4
    };

    // Use shared mock data for recent invoices
    const recentInvoices = mockInvoices;

    const getStatusColor = (status: string) => {
        switch (status