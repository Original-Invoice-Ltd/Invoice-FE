export interface KPICardData {
  title: string;
  value: string;
  badge?: {
    text: string;
    color: 'red' | 'green' | 'yellow';
  };
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
  color: string;
  percentage: string;
  change: string;
}

export interface Invoice {
  id: string;
  date: string;
  clientName: string;
  invoiceId: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  amount: number;
  balanceDue: number;
}

export interface ReportsData {
  kpis: {
    totalInvoiced: number;
    paymentsReceived: number;
    outstandingAmount: number;
    vatCollected: number;
  };
  revenueData: RevenueDataPoint[];
  statusDistribution: StatusDistribution[];
  recentInvoices: Invoice[];
}
