import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../customer/customer.entity';

@Injectable()
export class BillingService {
    constructor(
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
    ) { }

    async findByDeadline(date?: string): Promise<Customer[]> {
        const targetDate = date || new Date().toISOString().split('T')[0];

        return await this.customerRepository
            .createQueryBuilder('customer')
            .where('customer.deadline = :targetDate', { targetDate })
            .andWhere('customer.is_active = :isActive', { isActive: true })
            .getMany();
    }
}