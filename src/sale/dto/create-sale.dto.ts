import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsNumber, IsArray, ValidateNested, IsOptional, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { InstallmentDto } from './installment.dto';

export class CreateSaleDto {
    @ApiProperty({
        description: 'O ID do cliente',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    idCustomer: number;

    @ApiProperty({
        description: 'O valor total da venda',
        example: 250
    })
    @IsNotEmpty()
    @IsNumber()
    value: number;

    @ApiProperty({
        description: 'Descrição resumida sobre a venda',
        example: 'CALÇA JEANS CLARA T38'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Data em que a venda foi realizada (No formato YYYY-MM-DD)',
        example: '2025-10-31'
    })
    @IsDateString()
    @IsNotEmpty()
    saleDate: Date;

    @ApiPropertyOptional({
        description: 'Lista de parcelas. Se não informado, será criada 1 parcela à vista com o valor total e vencimento na data da venda',
        type: [InstallmentDto],
        example: [
            { value: 80, dueDate: '2025-01-15' },
            { value: 60, dueDate: '2025-02-15' },
            { value: 60, dueDate: '2025-03-15' },
            { value: 50, dueDate: '2025-04-15' }
        ]
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => InstallmentDto)
    installments?: InstallmentDto[];
}