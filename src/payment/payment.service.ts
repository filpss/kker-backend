import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm'
import { Payment } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';
import { Sale } from 'src/sale/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Sale)
        private saleRepository: Repository<Sale>
    ) { }

    async getAll(): Promise<Payment[]> {
        return await this.paymentRepository.find({ relations: ['sale'] });
    }

    async create(paymentDto: PaymentDto): Promise<Payment> {
        const { idSale, ...paymentData } = paymentDto;
        const sale = await this.saleRepository.findOneBy({ id: idSale });

        if (!sale) {
            throw new NotFoundException(`Venda de ID ${idSale} não encontrada`);
        }

        const createdPayment = await this.paymentRepository.create({
            ...paymentData,
            sale
        });
        return await this.paymentRepository.save(createdPayment);
    }

    async edit(id: number, paymentDto: PaymentDto): Promise<Payment> {
        const { idSale, ...paymentData } = paymentDto;

        const payment = await this.paymentRepository.preload({
            id,
            ...paymentData
        });

        if (!payment) {
            throw new NotFoundException(`Pagamento de ID ${id} não encontrado`);
        }

        if (idSale) {
            const sale = await this.saleRepository.findOneBy({ id: idSale });
            if (!sale) {
                throw new NotFoundException(`Venda de ID ${idSale} não encontrada`);
            }
            payment.sale = sale;
        }
        return await this.paymentRepository.save(payment);
    }

    async getById(id: number): Promise<Payment | null> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['sale'],
        });
        if (!payment) {
            throw new NotFoundException(`Pagamento de ID ${id} não encontrado`);
        }
        return payment;
    }

    async remove(id: number): Promise<void> {
        const payment = await this.paymentRepository.findOneBy({ id: id });
        if (!payment) {
            throw new NotFoundException(`Pagamento de ID ${id} não encontrado`);
        }
        await this.paymentRepository.delete(id);
    }
}
