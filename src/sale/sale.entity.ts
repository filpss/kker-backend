import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { Payment } from '../payment/payment.entity';

@Entity({ name: 'sales' })
export class Sale {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, (customer) => customer.sales)
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @OneToMany(() => Payment, (payment) => payment.sale)
    payments: Payment[]

    @Column({ name: 'sale_value', type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ name: 'sale_date', type: 'date' })
    saleDate: Date;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}