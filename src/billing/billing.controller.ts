import { Controller, Get, Query } from '@nestjs/common';
import { BillingService } from './billing.service';
import { QueryBillingDto } from './dto/query-billing.dto';
import { Customer } from '../customer/customer.entity';

@Controller('billing')
export class BillingController {
    constructor(private billingService: BillingService) { }

    @Get()
    getBilling(@Query() query: QueryBillingDto): Promise<Customer[]> {
        return this.billingService.findByDeadline(query.date);
    }
}