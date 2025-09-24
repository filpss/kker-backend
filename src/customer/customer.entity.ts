import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer {
    @PrimaryGeneratedColumn({ name: 'id_customer' })
    idCustomer: number;

    @Column()
    name: string;

    @Column()
    contact: string;

    @Column({ name: 'is_active' })
    isActive: boolean;

    @Column({ name: 'dead_line' })
    deadLine: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt: Date;
}