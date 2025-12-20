import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class PaymentDto {
    @ApiProperty({
        description: 'O ID da parcela que está sendo paga',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    idInstallment: number;

    @ApiProperty({
        description: 'O valor do pagamento',
        example: 50
    })
    @IsNotEmpty()
    @IsNumber()
    value: number;

    @ApiPropertyOptional({
        description: 'Descrição/observação sobre o pagamento',
        example: 'IRMÃ DE FULANO QUE PAGOU'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Data em que o pagamento foi realizado (No formato YYYY-MM-DD)',
        example: '2025-10-31'
    })
    @IsDateString()
    @IsNotEmpty()
    paymentDate: Date;
}