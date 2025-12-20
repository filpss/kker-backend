export interface InstallmentReportItem {
    id: number;
    installmentNumber: number;
    value: number;
    dueDate: Date;
    isPaid: boolean;
    paymentDate: Date | null;
    paymentValue: number | null;
}

export interface SaleReportItem {
    id: number;
    description: string;
    value: number;
    saleDate: Date;
    installmentsCount: number;
    paidInstallments: number;
    totalPaid: number;
    installments: InstallmentReportItem[];
}

export interface PaymentReportItem {
    id: number;
    description: string;
    value: number;
    paymentDate: Date;
    saleDescription: string;
    installmentNumber: number;
    installmentsTotal: number;
}

export interface FinancialSummary {
    totalSpent: number;
    totalPaid: number;
    outstandingBalance: number;
    salesCount: number;
    paymentsCount: number;
    totalInstallments: number;
    paidInstallments: number;
    pendingInstallments: number;
}

export interface CustomerReportData {
    customer: {
        id: number;
        name: string;
        contact: string;
        isActive: boolean;
        deadLine: Date | null;
        createdAt: Date;
    };
    financialSummary: FinancialSummary;
    salesHistory: SaleReportItem[];
    paymentsHistory: PaymentReportItem[];
    generatedAt: Date;
}