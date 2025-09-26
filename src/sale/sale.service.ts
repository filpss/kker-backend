import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { EditSaleDto } from './dto/edit-sale.dto';
import { Customer } from 'src/customer/customer.entity';

@Injectable()
export class SaleService {
    constructor(
        @InjectRepository(Sale)
        private salesRepository: Repository<Sale>,
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>
    ) { }

    async getAll(): Promise<Sale[]> {
        return await this.salesRepository.find({ relations: ['customer', 'payments'] });
    }

    async getById(id: number): Promise<Sale | null> {
        const sale = await this.salesRepository.findOne({
            where: { id },
            relations: ['customer', 'payments'],
        });
        if (!sale) {
            throw new NotFoundException(`Venda de ID ${id} não encontrada`);
        }
        return sale;
    }

    async create(createSaleDto: CreateSaleDto): Promise<Sale> {
        const { idCustomer, ...saleData } = createSaleDto;

        const customer = await this.customerRepository.findOneBy({ id: idCustomer })
        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${idCustomer} não encontrado`);
        }

        const createdSale = await this.salesRepository.create({
            ...saleData,
            customer
        });
        return await this.salesRepository.save(createdSale);
    }

    async edit(id: number, editSaleDto: EditSaleDto): Promise<Sale> {
        const { idCustomer, ...saleData } = editSaleDto;

        var sale = await this.salesRepository.preload({
            id,
            ...saleData,
        });

        if (!sale) {
            throw new NotFoundException(`Venda de ID ${id} não encontrada`);
        }

        if (idCustomer) {
            const customer = await this.customerRepository.findOneBy({ id: idCustomer })
            if (!customer) {
                throw new NotFoundException(`Cliente de ID ${idCustomer} não encontrada`);
            }
            sale.customer = customer;
        }

        return await this.salesRepository.save(sale);
    }

    async remove(id: number): Promise<void> {
        const sale = await this.salesRepository.findOneBy({ id });
        if (!sale) {
            throw new NotFoundException(`Venda de ID ${id} não encontrada`);
        }
        await this.salesRepository.delete(id);
    }
}
