import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sale/sale.entity';
import { Payment } from './payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Payment])],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }