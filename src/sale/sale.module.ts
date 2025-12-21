import { Module } from '@nestjs/common';
import { SaleController } from './sale.controller';
import { SaleService } from './sale.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { Customer } from '../customer/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Customer])],
  controllers: [SaleController],
  providers: [SaleService],
  exports: [TypeOrmModule]
})
export class SaleModule { }