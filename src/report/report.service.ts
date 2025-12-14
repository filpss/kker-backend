import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import {
    CustomerReportData,
    FinancialSummary,
    SaleReportItem,
    PaymentReportItem
} from './dto/customer-report.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    async getCustomerReportData(customerId: number): Promise<CustomerReportData> {
        const customer = await this.fetchCustomerWithRelations(customerId);
        const salesHistory = this.mapSalesHistory(customer);
        const paymentsHistory = this.mapPaymentsHistory(customer);
        const financialSummary = this.calculateFinancialSummary(customer);

        return {
            customer: {
                id: customer.id,
                name: customer.name,
                contact: customer.contact,
                isActive: customer.isActive,
                deadLine: customer.deadLine,
                createdAt: customer.createdAt
            },
            financialSummary,
            salesHistory,
            paymentsHistory,
            generatedAt: new Date()
        };
    }

    private async fetchCustomerWithRelations(customerId: number): Promise<Customer> {
        const customer = await this.customerRepository.findOne({
            where: { id: customerId },
            relations: ['sales', 'sales.payments']
        });

        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${customerId} não encontrado`);
        }

        return customer;
    }

    private mapSalesHistory(customer: Customer): SaleReportItem[] {
        if (!customer.sales || customer.sales.length === 0) {
            return [];
        }

        return customer.sales
            .map(sale => ({
                id: sale.id,
                description: sale.description || '-',
                value: Number(sale.value),
                saleDate: sale.saleDate,
                paymentsCount: sale.payments?.length || 0,
                totalPaid: this.sumPayments(sale.payments)
            }))
            .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
    }

    private mapPaymentsHistory(customer: Customer): PaymentReportItem[] {
        if (!customer.sales || customer.sales.length === 0) {
            return [];
        }

        const allPayments: PaymentReportItem[] = [];

        for (const sale of customer.sales) {
            if (sale.payments && sale.payments.length > 0) {
                for (const payment of sale.payments) {
                    allPayments.push({
                        id: payment.id,
                        description: payment.description || '-',
                        value: Number(payment.value),
                        paymentDate: payment.paymentDate,
                        saleDescription: sale.description || `Venda #${sale.id}`
                    });
                }
            }
        }

        return allPayments.sort(
            (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
        );
    }

    private calculateFinancialSummary(customer: Customer): FinancialSummary {
        const sales = customer.sales || [];
        const totalSpent = sales.reduce((sum, sale) => sum + Number(sale.value), 0);
        const totalPaid = sales.reduce((sum, sale) => sum + this.sumPayments(sale.payments), 0);
        const paymentsCount = sales.reduce(
            (count, sale) => count + (sale.payments?.length || 0),
            0
        );

        return {
            totalSpent,
            totalPaid,
            outstandingBalance: Math.max(0, totalSpent - totalPaid),
            salesCount: sales.length,
            paymentsCount
        };
    }

    private sumPayments(payments: { value: number }[] | undefined): number {
        if (!payments || payments.length === 0) {
            return 0;
        }
        return payments.reduce((sum, payment) => sum + Number(payment.value), 0);
    }
}