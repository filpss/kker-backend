import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { Customer } from '../customer/customer.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customer])],
    controllers: [BillingController],
    providers: [BillingService]
})
export class BillingModule { }