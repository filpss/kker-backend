import { Injectable } from '@nestjs/common';
import { CustomerReportData, SaleReportItem, PaymentReportItem } from './dto/customer-report.dto';

const PDFDocument = require('pdfkit');

@Injectable()
export class PdfGeneratorService {
    private readonly colors = {
        primary: '#2c3e50',
        secondary: '#7f8c8d',
        accent: '#3498db',
        success: '#27ae60',
        danger: '#e74c3c',
        light: '#f8f9fa',
        border: '#dee2e6',
        white: '#ffffff',
        tableHeader: '#2c3e50',
        tableRowEven: '#f8f9fa'
    };

    async generateCustomerReportPdf(data: CustomerReportData): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    margin: 40,
                    size: 'A4',
                    bufferPages: true
                });

                const chunks: Buffer[] = [];
                doc.on('data', (chunk: Buffer) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);

                this.buildDocument(doc, data);
                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    private buildDocument(doc: any, data: CustomerReportData): void {
        this.drawHeader(doc);
        this.drawCustomerInfo(doc, data);
        this.drawFinancialSummary(doc, data);
        this.drawSalesTable(doc, data.salesHistory);
        this.drawPaymentsTable(doc, data.paymentsHistory);
        this.drawFooter(doc, data.generatedAt);
    }

    private drawHeader(doc: any): void {
        doc.fontSize(24)
            .fillColor(this.colors.primary)
            .font('Helvetica-Bold')
            .text('KKER Modas', { align: 'center' });

        doc.fontSize(12)
            .fillColor(this.colors.secondary)
            .font('Helvetica')
            .text('Relatório Financeiro do Cliente', { align: 'center' });

        doc.moveDown(0.5);
        doc.moveTo(40, doc.y)
            .lineTo(555, doc.y)
            .strokeColor(this.colors.primary)
            .lineWidth(2)
            .stroke();

        doc.moveDown(1);
    }

    private drawCustomerInfo(doc: any, data: CustomerReportData): void {
        const startY = doc.y;
        const boxHeight = 100;

        doc.roundedRect(40, startY, 515, boxHeight, 5)
            .fillColor(this.colors.light)
            .fill();

        doc.fillColor(this.colors.primary)
            .fontSize(16)
            .font('Helvetica-Bold')
            .text(data.customer.name, 55, startY + 15);

        doc.moveTo(55, startY + 38)
            .lineTo(540, startY + 38)
            .strokeColor(this.colors.border)
            .lineWidth(1)
            .stroke();

        const col1X = 55;
        const col2X = 300;
        let infoY = startY + 48;

        this.drawInfoItem(doc, 'Código', `#${data.customer.id}`, col1X, infoY);
        this.drawInfoItem(doc, 'Contato', data.customer.contact || '-', col2X, infoY);

        infoY += 25;
        const statusColor = data.customer.isActive ? this.colors.success : this.colors.danger;
        const statusText = data.customer.isActive ? 'Ativo' : 'Inativo';
        this.drawInfoItem(doc, 'Status', statusText, col1X, infoY, statusColor);
        this.drawInfoItem(doc, 'Data de Cobrança', this.formatDate(data.customer.deadLine), col2X, infoY);

        doc.y = startY + boxHeight + 20;
    }

    private drawInfoItem(
        doc: any,
        label: string,
        value: string,
        x: number,
        y: number,
        valueColor?: string
    ): void {
        doc.fontSize(8)
            .fillColor(this.colors.secondary)
            .font('Helvetica')
            .text(label.toUpperCase(), x, y);

        doc.fontSize(11)
            .fillColor(valueColor || this.colors.primary)
            .font('Helvetica-Bold')
            .text(value, x, y + 10);
    }

    private drawFinancialSummary(doc: any, data: CustomerReportData): void {
        doc.fontSize(14)
            .fillColor(this.colors.primary)
            .font('Helvetica-Bold')
            .text('Resumo Financeiro', 40);

        doc.moveDown(0.3);
        doc.moveTo(40, doc.y)
            .lineTo(200, doc.y)
            .strokeColor(this.colors.accent)
            .lineWidth(2)
            .stroke();

        doc.moveDown(0.8);

        const cardWidth = 160;
        const cardHeight = 70;
        const cardY = doc.y;
        const spacing = 17;

        this.drawSummaryCard(
            doc,
            40,
            cardY,
            cardWidth,
            cardHeight,
            'Total em Compras',
            this.formatCurrency(data.financialSummary.totalSpent),
            `${data.financialSummary.salesCount} compra(s)`,
            ['#667eea', '#764ba2']
        );

        this.drawSummaryCard(
            doc,
            40 + cardWidth + spacing,
            cardY,
            cardWidth,
            cardHeight,
            'Total Pago',
            this.formatCurrency(data.financialSummary.totalPaid),
            `${data.financialSummary.paymentsCount} pagamento(s)`,
            ['#11998e', '#38ef7d']
        );

        const balanceColors = data.financialSummary.outstandingBalance === 0
            ? ['#11998e', '#38ef7d']
            : ['#eb3349', '#f45c43'];

        this.drawSummaryCard(
            doc,
            40 + (cardWidth + spacing) * 2,
            cardY,
            cardWidth,
            cardHeight,
            'Saldo Devedor',
            this.formatCurrency(data.financialSummary.outstandingBalance),
            '',
            balanceColors
        );

        doc.y = cardY + cardHeight + 25;
    }

    private drawSummaryCard(
        doc: any,
        x: number,
        y: number,
        width: number,
        height: number,
        label: string,
        value: string,
        subtitle: string,
        gradientColors: string[]
    ): void {
        doc.roundedRect(x, y, width, height, 8)
            .fillColor(gradientColors[0])
            .fill();

        doc.fillColor(this.colors.white)
            .fontSize(16)
            .font('Helvetica-Bold')
            .text(value, x, y + 15, { width, align: 'center' });

        doc.fontSize(8)
            .font('Helvetica')
            .text(label.toUpperCase(), x, y + 38, { width, align: 'center' });

        if (subtitle) {
            doc.fontSize(7)
                .text(subtitle, x, y + 52, { width, align: 'center' });
        }
    }

    private drawSalesTable(doc: any, sales: SaleReportItem[]): void {
        this.checkPageBreak(doc, 80);

        doc.fontSize(14)
            .fillColor(this.colors.primary)
            .font('Helvetica-Bold')
            .text('Histórico de Compras', 40);

        doc.moveDown(0.3);
        doc.moveTo(40, doc.y)
            .lineTo(200, doc.y)
            .strokeColor(this.colors.accent)
            .lineWidth(2)
            .stroke();

        doc.moveDown(0.8);

        if (sales.length === 0) {
            this.drawEmptyMessage(doc, 'Nenhuma compra registrada');
            return;
        }

        const columns = [
            { header: 'Data', width: 70, align: 'left' as const },
            { header: 'Descrição', width: 180, align: 'left' as const },
            { header: 'Valor', width: 85, align: 'right' as const },
            { header: 'Pgtos', width: 45, align: 'center' as const },
            { header: 'Total Pago', width: 85, align: 'right' as const }
        ];

        this.drawTableHeader(doc, columns);

        sales.forEach((sale, index) => {
            this.checkPageBreak(doc, 25);
            const rowData = [
                this.formatDate(sale.saleDate),
                this.truncateText(sale.description, 35),
                this.formatCurrency(sale.value),
                sale.paymentsCount.toString(),
                this.formatCurrency(sale.totalPaid)
            ];
            this.drawTableRow(doc, columns, rowData, index % 2 === 0);
        });

        doc.moveDown(1);
    }

    private drawPaymentsTable(doc: any, payments: PaymentReportItem[]): void {
        this.checkPageBreak(doc, 80);

        doc.fontSize(14)
            .fillColor(this.colors.primary)
            .font('Helvetica-Bold')
            .text('Histórico de Pagamentos', 40);

        doc.moveDown(0.3);
        doc.moveTo(40, doc.y)
            .lineTo(200, doc.y)
            .strokeColor(this.colors.accent)
            .lineWidth(2)
            .stroke();

        doc.moveDown(0.8);

        if (payments.length === 0) {
            this.drawEmptyMessage(doc, 'Nenhum pagamento registrado');
            return;
        }

        const columns = [
            { header: 'Data', width: 70, align: 'left' as const },
            { header: 'Referente a', width: 150, align: 'left' as const },
            { header: 'Descrição', width: 150, align: 'left' as const },
            { header: 'Valor', width: 95, align: 'right' as const }
        ];

        this.drawTableHeader(doc, columns);

        payments.forEach((payment, index) => {
            this.checkPageBreak(doc, 25);
            const rowData = [
                this.formatDate(payment.paymentDate),
                this.truncateText(payment.saleDescription, 28),
                this.truncateText(payment.description, 28),
                this.formatCurrency(payment.value)
            ];
            this.drawTableRow(doc, columns, rowData, index % 2 === 0);
        });
    }

    private drawTableHeader(
        doc: any,
        columns: { header: string; width: number; align: 'left' | 'center' | 'right' }[]
    ): void {
        const headerHeight = 25;
        const startY = doc.y;

        doc.rect(40, startY, 515, headerHeight)
            .fillColor(this.colors.tableHeader)
            .fill();

        doc.fillColor(this.colors.white)
            .fontSize(8)
            .font('Helvetica-Bold');

        let xPos = 45;
        columns.forEach(col => {
            doc.text(col.header.toUpperCase(), xPos, startY + 8, {
                width: col.width - 10,
                align: col.align
            });
            xPos += col.width;
        });

        doc.y = startY + headerHeight;
    }

    private drawTableRow(
        doc: any,
        columns: { header: string; width: number; align: 'left' | 'center' | 'right' }[],
        data: string[],
        isEven: boolean
    ): void {
        const rowHeight = 22;
        const startY = doc.y;

        if (isEven) {
            doc.rect(40, startY, 515, rowHeight)
                .fillColor(this.colors.tableRowEven)
                .fill();
        }

        doc.fillColor(this.colors.primary)
            .fontSize(9)
            .font('Helvetica');

        let xPos = 45;
        data.forEach((text, i) => {
            doc.text(text, xPos, startY + 6, {
                width: columns[i].width - 10,
                align: columns[i].align
            });
            xPos += columns[i].width;
        });

        doc.moveTo(40, startY + rowHeight)
            .lineTo(555, startY + rowHeight)
            .strokeColor(this.colors.border)
            .lineWidth(0.5)
            .stroke();

        doc.y = startY + rowHeight;
    }

    private drawEmptyMessage(doc: any, message: string): void {
        const boxHeight = 40;
        const startY = doc.y;

        doc.roundedRect(40, startY, 515, boxHeight, 5)
            .fillColor(this.colors.light)
            .fill();

        doc.fillColor(this.colors.secondary)
            .fontSize(11)
            .font('Helvetica-Oblique')
            .text(message, 40, startY + 14, { width: 515, align: 'center' });

        doc.y = startY + boxHeight + 15;
    }

    private drawFooter(doc: any, generatedAt: Date): void {
        doc.moveDown(2);

        doc.moveTo(40, doc.y)
            .lineTo(555, doc.y)
            .strokeColor(this.colors.border)
            .lineWidth(1)
            .stroke();

        doc.moveDown(0.5);

        doc.fillColor(this.colors.secondary)
            .fontSize(8)
            .font('Helvetica')
            .text('KKER Modas - Sistema de Gestão de Clientes', 40, doc.y, {
                width: 515,
                align: 'center'
            });

        doc.moveDown(0.3);

        doc.text(
            `Gerado em: ${this.formatDateTime(generatedAt)} | Este documento foi gerado automaticamente.`,
            40,
            doc.y,
            { width: 515, align: 'center' }
        );
    }

    private checkPageBreak(doc: any, requiredSpace: number): void {
        if (doc.y + requiredSpace > doc.page.height - 50) {
            doc.addPage();
            doc.y = 40;
        }
    }

    private formatCurrency(value: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    }

    private formatDate(date: Date | string | null): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('pt-BR');
    }

    private formatDateTime(date: Date | string): string {
        return new Date(date).toLocaleString('pt-BR');
    }

    private truncateText(text: string, maxLength: number): string {
        if (!text) return '-';
        return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    }
}