export interface Payment {
  id: string;
  date: string;
  clientName: string;
  invoiceId: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Pending';
  dueDate: string;
  amount: number;
  balanceDue: number;
}

export type ModalType = 'markPaid' | 'revertStatus' | 'paymentSuccess' | 'revertSuccess' | null;
