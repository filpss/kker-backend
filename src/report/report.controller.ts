import { Controller, Get, Param, Res, ParseIntPipe } from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { PdfGeneratorService } from './pdf-generator.service';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
    constructor(
        private readonly reportService: ReportService,
        private readonly pdfGeneratorService: PdfGeneratorService
    ) { }

    @Get('customer/:id')
    @ApiOperation({ summary: 'Generate customer financial report PDF' })
    @ApiParam({ name: 'id', description: 'Customer ID', type: Number })
    @ApiResponse({ status: 200, description: 'PDF file generated successfully' })
    @ApiResponse({ status: 404, description: 'Customer not found' })
    async getCustomerReport(
        @Param('id', ParseIntPipe) customerId: number,
        @Res() response: Response
    ): Promise<void> {
        const reportData = await this.reportService.getCustomerReportData(customerId);
        const pdfBuffer = await this.pdfGeneratorService.generateCustomerReportPdf(reportData);

        const filename = this.generateFilename(reportData.customer.name);

        response.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': pdfBuffer.length
        });

        response.end(pdfBuffer);
    }

    private generateFilename(customerName: string): string {
        const sanitizedName = customerName
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .toLowerCase();

        const dateStr = new Date().toISOString().split('T')[0];
        return `relatorio_${sanitizedName}_${dateStr}.pdf`;
    }
}