import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Customer } from './customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    findAll(): Promise<Customer[]> {
        return this.customerRepository.find();
    }

    async findOne(idCustomer: number): Promise<Customer> {
        const customer = await this.customerRepository.findOneBy({ idCustomer });
        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${idCustomer} não encontrado`);
        }
        return customer;
    }

    async findAllActive(): Promise<Customer[]> {
        return await this.customerRepository.findBy({ isActive: true });
    }

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const existingCustomer = await this.customerRepository.findOneBy({ name: createCustomerDto.name });

        if (existingCustomer) {
            throw new ConflictException(`Já existe um cliente com o nome '${createCustomerDto.name}'`);
        }

        const newCustomer = this.customerRepository.create(createCustomerDto);

        return this.customerRepository.save(newCustomer);
    }

    async edit(idCustomer: number, editCustomerDto: EditCustomerDto): Promise<Customer> {
        const customer = await this.customerRepository.preload({
            idCustomer,
            ...editCustomerDto
        })

        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${idCustomer} não encontrado`);
        }

        await this.customerRepository.save(customer);
        return customer;
    }

    async remove(idCustomer: number): Promise<void> {
        const customer = await this.customerRepository.findOneBy({ idCustomer });
        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${idCustomer} não encontrado`);
        }
        await this.customerRepository.delete(idCustomer);
    }
}