import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';
import { EditPaymentDto } from './dto/edit-payment.dto';
import { Sale } from '../sale/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Sale)
        private saleRepository: Repository<Sale>,
    ) { }

    async getAll(): Promise<Payment[]> {
        return await this.paymentRepository.find({
            relations: ['sale', 'sale.customer']
        });
    }

    async create(paymentDto: PaymentDto): Promise<Payment> {
        const { idSale, ...paymentData } = paymentDto;

        const sale = await this.saleRepository.findOne({
            where: { id: idSale },
            relations: ['customer']
        });

        if (!sale) {
            throw new NotFoundException(`Venda de ID ${idSale} não encontrada`);
        }

        const payment = this.paymentRepository.create({
            ...paymentData,
            sale
        });

        const savedPayment = await this.paymentRepository.save(payment);
        return await this.getById(savedPayment.id) as Payment;
    }

    async edit(id: number, editPaymentDto: EditPaymentDto): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['sale']
        });

        if (!payment) {
            throw new NotFoundException(`Pagamento de ID ${id} não encontrado`);
        }

        if (editPaymentDto.value !== undefined) {
            payment.value = editPaymentDto.value;
        }

        if (editPaymentDto.description !== undefined) {
            payment.description = editPaymentDto.description;
        }

        if (editPaymentDto.paymentDate !== undefined) {
            payment.paymentDate = editPaymentDto.paymentDate;
        }

        await this.paymentRepository.save(payment);
        return await this.getById(id) as Payment;
    }

    async getById(id: number): Promise<Payment | null> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['sale', 'sale.customer'],
        });
        if (!payment) {
            throw new NotFoundException(`Pagamento de ID ${id} não encontrado`);
        }
        return payment;
    }

    async remove(id: number): Promise<void> {
        const payment = await this.paymentRepository.findOneBy({ id });

        if (!payment) {
            throw new NotFoundException(`Pagamento de ID ${id} não encontrado`);
        }

        await this.paymentRepository.delete(id);
    }
}