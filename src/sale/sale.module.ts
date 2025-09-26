import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { Customer } from 'src/customer/customer.entity';
import { Payment } from 'src/payment/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Customer, Payment]),],
  controllers: [SaleController],
  providers: [SaleService]
})
export class SaleModule { }
