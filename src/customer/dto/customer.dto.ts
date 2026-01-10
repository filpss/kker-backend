export class CustomerDto {
    id: number;
    name: string;
    contact: string | null;
    isActive: boolean;
    deadLine: Date | null;
    createdAt: Date;
    balance: number;
}
