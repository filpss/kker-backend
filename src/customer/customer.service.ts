import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Customer } from './customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { EditCustomerDto } from './dto/edit-customer.dto';
import {CustomerDto} from "./dto/customer.dto";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    async findAll(): Promise<CustomerDto[]> {
        return this.customerRepository.query(`
    SELECT
      c.id,
      c.name,
      c.contact,
      c.is_active AS "isActive",
      c.deadline AS "deadLine",
      c.created_at AS "createdAt",
      COALESCE(s.total_sales, 0) - COALESCE(p.total_payments, 0) AS balance
    FROM customers c
    LEFT JOIN (
      SELECT
        customer_id,
        SUM(sale_value) AS total_sales
      FROM sales
      GROUP BY customer_id
    ) s ON s.customer_id = c.id
    LEFT JOIN (
      SELECT
        s.customer_id,
        SUM(p.value) AS total_payments
      FROM payments p
      INNER JOIN sales s ON s.id = p.sale_id
      GROUP BY s.customer_id
    ) p ON p.customer_id = c.id
    ORDER BY c.name
  `);
    }

    async findOne(id: number): Promise<Customer> {
        const customer = await this.customerRepository.findOneBy({ id });
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