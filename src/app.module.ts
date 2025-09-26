import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Customer } from './customer/customer.entity';
import { ConfigModule } from '@nestjs/config';
import { SaleModule } from './sale/sale.module';
import { PaymentModule } from './payment/payment.module';
import { Sale } from './sale/sale.entity';
import { Payment } from './payment/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5431,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [
        Customer,
        Sale,
        Payment
      ],
      synchronize: true,
      retryAttempts: 5,
      retryDelay: 3000
    }),
    CustomerModule,
    SaleModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private dataSource: DataSource) { };
}