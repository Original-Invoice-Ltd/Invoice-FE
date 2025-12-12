export interface Payment {
  id: string;
  date: string;
  clientName: string;
  invoiceId: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
  amount: number;
  balanceDue: number;
}

export type ModalType = 'markPaid' | 'paymentSuccess' | 'revertStatus' | 'revertSuccess' | null;
