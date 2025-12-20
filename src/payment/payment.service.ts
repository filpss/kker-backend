import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Payment } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';
import { EditPaymentDto } from './dto/edit-payment.dto';
import { Installment } from '../sale/installment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Installment)
        private installmentRepository: Repository<Installment>,
        private dataSource: DataSource
    ) { }

    async getAll(): Promise<Payment[]> {
        return await this.paymentRepository.find({
            relations: ['installment', 'installment.sale', 'installment.sale.customer']
        });
    }

    async create(paymentDto: PaymentDto): Promise<Payment> {
        const { idInstallment, ...paymentData } = paymentDto;

        const installment = await this.installmentRepository.findOne({
            where: { id: idInstallment },
            relations: ['payment', 'sale']
        });

        if (!installment) {
            throw new NotFoundException(`Parcela de ID ${idInstallment} não encontrada`);
        }

        if (installment.isPaid) {
            throw new BadRequestException(`A parcela ${installment.installmentNumber} já foi paga`);
        }

        if (installment.payment) {
            throw new BadRequestException(`A parcela ${installment.installmentNumber} já possui um pagamento registrado`);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const payment = queryRunner.manager.create(Payment, {
                ...paymentData,
                installment
            });

            const savedPayment = await queryRunner.manager.save(payment);

            installment.isPaid = true;
            await queryRunner.manager.save(installment);

            await queryRunner.commitTransaction();

            return await this.getById(savedPayment.id) as Payment;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async edit(id: number, editPaymentDto: EditPaymentDto): Promise<Payment> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['installment']
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
            relations: ['installment', 'installment.sale', 'installment.sale.customer'],
        });
        if (!payment) {
            throw new NotFoundException(`Pagamento de ID ${id} não encontrado`);
        }
        return payment;
    }

    async remove(id: number): Promise<void> {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['installment']
        });

        if (!payment) {
            throw new NotFoundException(`Pagamento de ID ${id} não encontrado`);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const installment = payment.installment;
            installment.isPaid = false;

            await queryRunner.manager.delete(Payment, id);
            await queryRunner.manager.save(installment);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}