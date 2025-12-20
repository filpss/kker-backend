import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { Installment } from './installment.entity';

@Entity({ name: 'sales' })
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, (customer) => customer.sales)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @OneToMany(() => Installment, (installment) => installment.sale)
    installments: Installment[];

    @Column({ name: 'sale_value', type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ name: 'installments_count', default: 1 })
    installmentsCount: number;

    @Column({ name: 'sale_date', type: 'date' })
    saleDate: Date;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}