import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import {
    CustomerReportData,
    FinancialSummary,
    SaleReportItem,
    PaymentReportItem,
    InstallmentReportItem
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
            relations: ['sales', 'sales.installments', 'sales.installments.payment']
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
            .map(sale => {
                const installments = sale.installments || [];
                const paidInstallments = installments.filter(i => i.isPaid).length;
                const totalPaid = installments
                    .filter(i => i.payment)
                    .reduce((sum, i) => sum + Number(i.payment?.value || 0), 0);

                return {
                    id: sale.id,
                    description: sale.description || '-',
                    value: Number(sale.value),
                    saleDate: sale.saleDate,
                    installmentsCount: sale.installmentsCount,
                    paidInstallments,
                    totalPaid,
                    installments: this.mapInstallments(installments)
                };
            })
            .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
    }

    private mapInstallments(installments: any[]): InstallmentReportItem[] {
        return installments
            .map(inst => ({
                id: inst.id,
                installmentNumber: inst.installmentNumber,
                value: Number(inst.value),
                dueDate: inst.dueDate,
                isPaid: inst.isPaid,
                paymentDate: inst.payment?.paymentDate || null,
                paymentValue: inst.payment ? Number(inst.payment.value) : null
            }))
            .sort((a, b) => a.installmentNumber - b.installmentNumber);
    }

    private mapPaymentsHistory(customer: Customer): PaymentReportItem[] {
        if (!customer.sales || customer.sales.length === 0) {
            return [];
        }

        const allPayments: PaymentReportItem[] = [];

        for (const sale of customer.sales) {
            if (sale.installments && sale.installments.length > 0) {
                for (const installment of sale.installments) {
                    if (installment.payment) {
                        allPayments.push({
                            id: installment.payment.id,
                            description: installment.payment.description || '-',
                            value: Number(installment.payment.value),
                            paymentDate: installment.payment.paymentDate,
                            saleDescription: sale.description || `Venda #${sale.id}`,
                            installmentNumber: installment.installmentNumber,
                            installmentsTotal: sale.installmentsCount
                        });
                    }
                }
            }
        }

        return allPayments.sort(
            (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
        );
    }

    private calculateFinancialSummary(customer: Customer): FinancialSummary {
        const sales = customer.sales || [];

        let totalInstallments = 0;
        let paidInstallments = 0;
        let totalPaid = 0;

        for (const sale of sales) {
            const installments = sale.installments || [];
            totalInstallments += installments.length;
            paidInstallments += installments.filter(i => i.isPaid).length;
            totalPaid += installments
                .filter(i => i.payment)
                .reduce((sum, i) => sum + Number(i.payment?.value || 0), 0);
        }

        const totalSpent = sales.reduce((sum, sale) => sum + Number(sale.value), 0);
        const paymentsCount = paidInstallments;

        return {
            totalSpent,
            totalPaid,
            outstandingBalance: Math.max(0, totalSpent - totalPaid),
            salesCount: sales.length,
            paymentsCount,
            totalInstallments,
            paidInstallments,
            pendingInstallments: totalInstallments - paidInstallments
        };
    }
}