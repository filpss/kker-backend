import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Sale } from './sale.entity';
import { Payment } from '../payment/payment.entity';

@Entity({ name: 'installments' })
export class Installment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sale, (sale) => sale.installments)
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @OneToOne(() => Payment, (payment) => payment.installment, { nullable: true })
    payment: Payment | null;

    @Column({ name: 'installment_number' })
    installmentNumber: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ name: 'due_date', type: 'date' })
    dueDate: Date;

    @Column({ name: 'is_paid', default: false })
    isPaid: boolean;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}