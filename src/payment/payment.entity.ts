import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Sale } from '../sale/sale.entity';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Sale, (sale) => sale.payments)
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ name: 'payment_date', type: 'date' })
    paymentDate: Date;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}