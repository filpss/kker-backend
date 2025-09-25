import { Sale } from '../sale/sale.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'customers' })
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Sale, (sale) => sale.customer)
    sales: Sale[];

    @Column()
    name: string;

    @Column({ nullable: true })
    contact: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'deadline', type: 'date', nullable: true })
    deadLine: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}