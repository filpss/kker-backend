import { Customer } from '../../customer/customer.entity';
import { Sale } from '../../sale/sale.entity';
import { Payment } from '../../payment/payment.entity';

export interface SaleReportItem {
    id: number;
    description: string;
    value: number;
    saleDate: Date;
    paymentsCount: number;
    totalPaid: number;
}

export interface PaymentReportItem {
    id: number;
    description: string;
    value: number;
    paymentDate: Date;
    saleDescription: string;
}

export interface FinancialSummary {
    totalSpent: number;
    totalPaid: number;
    outstandingBalance: number;
    salesCount: number;
    paymentsCount: number;
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