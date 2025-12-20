import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installment } from '../sale/installment.entity';
import { Payment } from './payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Installment, Payment])],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }