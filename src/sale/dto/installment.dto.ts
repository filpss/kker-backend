import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class InstallmentDto {
    @ApiProperty({
        description: 'O valor da parcela',
        example: 50
    })
    @IsNumber()
    @IsNotEmpty()
    value: number;

    @ApiProperty({
        description: 'Data de vencimento da parcela (No formato YYYY-MM-DD)',
        example: '2025-01-15'
    })
    @IsDateString()
    @IsNotEmpty()
    dueDate: Date;
}