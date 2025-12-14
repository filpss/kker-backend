import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { Customer } from '../customer/customer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    controllers: [ReportController],
    providers: [ReportService, PdfGeneratorService]
})
export class ReportModule { }