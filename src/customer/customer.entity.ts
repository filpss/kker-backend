import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'tb_customers' })
export class Customer {
    @PrimaryGeneratedColumn()
    idCustomer: number;

    @Column()
    name: string;

    @Column()
    contact: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    debt: number;

    @Column()
    isActive: boolean;

    @Column()
    deadLine: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}