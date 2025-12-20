import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class EditInstallmentDto {
    @ApiPropertyOptional({
        description: 'O novo valor da parcela',
        example: 55
    })
    @IsNumber()
    @IsOptional()
    value?: number;

    @ApiPropertyOptional({
        description: 'Nova data de vencimento da parcela (No formato YYYY-MM-DD)',
        example: '2025-02-20'
    })
    @IsDateString()
    @IsOptional()
    dueDate?: Date;
}