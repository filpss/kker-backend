import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class EditPaymentDto {
    @ApiPropertyOptional({
        description: 'O valor do pagamento',
        example: 55
    })
    @IsNumber()
    @IsOptional()
    value?: number;

    @ApiPropertyOptional({
        description: 'Descrição/observação sobre o pagamento',
        example: 'IRMÃ DE FULANO QUE PAGOU'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Data em que o pagamento foi realizado (No formato YYYY-MM-DD)',
        example: '2025-10-31'
    })
    @IsDateString()
    @IsOptional()
    paymentDate?: Date;
}