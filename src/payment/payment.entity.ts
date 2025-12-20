import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { Installment } from '../sale/installment.entity';

@Entity({ name: 'payments' })
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Installment, (installment) => installment.payment)
    @JoinColumn({ name: 'installment_id' })
    installment: Installment;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;

    @Column({ name: 'payment_date', type: 'date' })
    paymentDate: Date;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}