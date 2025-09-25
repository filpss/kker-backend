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

    async findAll(): Promise<Customer[]> {
        return await this.customerRepository.find();
    }

    async findOne(id: number): Promise<Customer> {
        const customer = await this.customerRepository.findOneBy({ id });
        console.log(typeof (customer));
        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${id} não encontrado`);
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

        return await this.customerRepository.save(newCustomer);
    }

    async edit(id: number, editCustomerDto: EditCustomerDto): Promise<Customer> {
        const customer = await this.customerRepository.preload({
            id,
            ...editCustomerDto
        })

        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${id} não encontrado`);
        }

        return await this.customerRepository.save(customer);
    }

    async remove(id: number): Promise<void> {
        const customer = await this.customerRepository.findOneBy({ id });
        if (!customer) {
            throw new NotFoundException(`Cliente de ID ${id} não encontrado`);
        }
        await this.customerRepository.delete(id);
    }
}