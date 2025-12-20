import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './sale.entity';
import { Installment } from './installment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { EditSaleDto } from './dto/edit-sale.dto';
import { EditInstallmentDto } from './dto/edit-installment.dto';
import { Customer } from '../customer/customer.entity';

@Injectable()
export class SaleService {
    constructor(
        @InjectRepository(Sale)
        private salesRepository: Repository<Sale>,
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @InjectRepository(Installment)
        private installmentRepository: Repository<Installment>,
        private dataSource: DataSource
    ) { }

    async getAll(): Promise<Sale[]> {
        return await this.salesRepository.find({
            relations: ['customer', 'installments', 'installments.payment']
        });
    }

    async getById(id: number): Promise<Sale | null> {
        const sale = await this.salesRepository.findOne({
            where: { id },
            relations: ['customer', 'installments', 'installments.payment'],
        });
        if (!sale) {
            throw new NotFoundException(`Venda de ID ${id} não encontrada`);
        }
        return sale;
    }

    async create(createSaleDto: CreateSaleDto): Promise<Sale> {
        const { idCustomer, installments: installmentsData, ...saleData } = createSaleDto;

        const customer = await this.customerRepository.findOneBy({ id: idCustomer });
        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${idCustomer} não encontrado`);
        }

        const installmentsToCreate = installmentsData || [
            { value: saleData.value, dueDate: saleData.saleDate }
        ];

        const installmentsTotal = installmentsToCreate.reduce((sum, inst) => sum + Number(inst.value), 0);
        if (Math.abs(installmentsTotal - Number(saleData.value)) > 0.01) {
            throw new BadRequestException(
                `A soma das parcelas (R$ ${installmentsTotal.toFixed(2)}) deve ser igual ao valor total da venda (R$ ${Number(saleData.value).toFixed(2)})`
            );
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const sale = queryRunner.manager.create(Sale, {
                ...saleData,
                customer,
                installmentsCount: installmentsToCreate.length
            });

            const savedSale = await queryRunner.manager.save(sale);

            const installments = installmentsToCreate.map((inst, index) =>
                queryRunner.manager.create(Installment, {
                    sale: savedSale,
                    installmentNumber: index + 1,
                    value: inst.value,
                    dueDate: inst.dueDate,
                    isPaid: false
                })
            );

            await queryRunner.manager.save(installments);
            await queryRunner.commitTransaction();

            return await this.getById(savedSale.id) as Sale;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async edit(id: number, editSaleDto: EditSaleDto): Promise<Sale> {
        const { idCustomer, ...saleData } = editSaleDto;

        const sale = await this.salesRepository.preload({
            id,
            ...saleData,
        });

        if (!sale) {
            throw new NotFoundException(`Venda de ID ${id} não encontrada`);
        }

        if (idCustomer) {
            const customer = await this.customerRepository.findOneBy({ id: idCustomer });
            if (!customer) {
                throw new NotFoundException(`Cliente de ID ${idCustomer} não encontrado`);
            }
            sale.customer = customer;
        }

        await this.salesRepository.save(sale);
        return await this.getById(id) as Sale;
    }

    async remove(id: number): Promise<void> {
        const sale = await this.salesRepository.findOne({
            where: { id },
            relations: ['installments', 'installments.payment']
        });

        if (!sale) {
            throw new NotFoundException(`Venda de ID ${id} não encontrada`);
        }

        const hasPayments = sale.installments?.some(inst => inst.payment !== null);
        if (hasPayments) {
            throw new BadRequestException(
                'Não é possível excluir uma venda que possui pagamentos. Exclua os pagamentos primeiro.'
            );
        }

        await this.salesRepository.delete(id);
    }

    async getInstallmentsBySale(saleId: number): Promise<Installment[]> {
        const sale = await this.salesRepository.findOneBy({ id: saleId });
        if (!sale) {
            throw new NotFoundException(`Venda de ID ${saleId} não encontrada`);
        }

        return await this.installmentRepository.find({
            where: { sale: { id: saleId } },
            relations: ['payment'],
            order: { installmentNumber: 'ASC' }
        });
    }

    async editInstallment(installmentId: number, editInstallmentDto: EditInstallmentDto): Promise<Installment> {
        const installment = await this.installmentRepository.findOne({
            where: { id: installmentId },
            relations: ['payment', 'sale']
        });

        if (!installment) {
            throw new NotFoundException(`Parcela de ID ${installmentId} não encontrada`);
        }

        if (installment.isPaid) {
            throw new BadRequestException('Não é possível editar uma parcela que já foi paga');
        }

        if (editInstallmentDto.value !== undefined) {
            installment.value = editInstallmentDto.value;
        }

        if (editInstallmentDto.dueDate !== undefined) {
            installment.dueDate = editInstallmentDto.dueDate;
        }

        return await this.installmentRepository.save(installment);
    }
}