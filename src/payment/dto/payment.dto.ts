import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class PaymentDto {
    @ApiProperty({
        description: 'O ID da venda para qual vai o pagamento',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    idSale: number;

    @ApiProperty({
        description: 'O valor do pagamento.',
        example: '50'
    })
    @IsNotEmpty()
    @IsNumber()
    value: number;

    @ApiProperty({
        description: 'Descrição resumida sobre o pagamento',
        example: 'IRMÃ DE FULANO QUE PAGOU'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Data em que o pagamento foi realizado (No formato YYYY-MM-DD).',
        example: '2025-10-31'
    })
    @IsDateString()
    @IsNotEmpty()
    paymentDate: Date;
}