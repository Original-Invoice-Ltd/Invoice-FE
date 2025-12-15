import { ReportsData } from "./types";

export const emptyReportsData: ReportsData = {
  kpis: {
    totalInvoiced: 0,
    paymentsReceived: 0,
    outstandingAmount: 0,
    vatCollected: 0,
  },
  revenueData: [],
  statusDistribution: [],
  recentInvoices: [],
};

export const filledReportsData: ReportsData = {
  kpis: {
    totalInvoiced: 1200000,
    paymentsReceived: 800000,
    outstandingAmount: 12000,
    vatCollected: 330000,
  },
  revenueData: [
    { month: "Jan", revenue: 100000 },
    { month: "Feb", revenue: 80000 },
    { month: "Mar", revenue: 120000 },
    { month: "Apr", revenue: 180000 },
    { month: "May", revenue: 90000 },
    { month: "Jun", revenue: 150000 },
    { month: "Jul", revenue: 200000 },
    { month: "Aug", revenue: 250000 },
    { month: "Sep", revenue: 300000 },
    { month: "Oct", revenue: 350000 },
    { month: "Nov", revenue: 400000 },
    { month: "Dec", revenue: 450000 },
  ],
  statusDistribution: [
    { name: "Paid", value: 890000, color: "#2F80ED", percentage: "65%", change: "-5%" },
    { name: "Pending", value: 320000, color: "#93C5FD", percentage: "23%", change: "+7%" },
    { name: "Overdue", value: 635000, color: "#EF4444", percentage: "12%", change: "+10%" },
  ],
  recentInvoices: [
    {
      id: "1",
      date: "Oct 25, 2025",
      clientName: "Tech Solutions Ltd",
      invoiceId: "INV-00123",
      status: "Paid",
      dueDate: "Nov 25, 2025",
      amount: 450000,
      balanceDue: 450000,
    },
    {
      id: "2",
      date: "Oct 23, 2025",
      clientName: "Creative Hub",
      invoiceId: "INV-00122",
      status: "Pending",
      dueDate: "Nov 25, 2025",
      amount: 85000,
      balanceDue: 85000,
    },
    {
      id: "3",
      date: "Oct 15, 2025",
      clientName: "Global Services",
      invoiceId: "INV-00121",
      status: "Paid",
      dueDate: "Nov 25, 2025",
      amount: 112000,
      balanceDue: 112000,
    },
    {
      id: "4",
      date: "Oct 15, 2025",
      clientName: "Global Services",
      invoiceId: "INV-00121",
      status: "Overdue",
      dueDate: "Nov 25, 2025",
      amount: 112000,
      balanceDue: 112000,
    },
  ],
};
