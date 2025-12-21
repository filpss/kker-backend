import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class EditSaleDto {
    @ApiPropertyOptional({
        description: 'O ID do cliente',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    idCustomer?: number;

    @ApiPropertyOptional({
        description: 'O valor total da venda',
        example: 250
    })
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    value?: number;

    @ApiPropertyOptional({
        description: 'Descrição resumida sobre a venda',
        example: 'CALÇA JEANS CLARA T38'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({
        description: 'Data em que a venda foi realizada (No formato YYYY-MM-DD)',
        example: '2025-10-31'
    })
    @IsDateString()
    @IsOptional()
    saleDate?: Date;

    @ApiPropertyOptional({
        description: 'Quantidade de parcelas combinadas com o cliente (apenas informativo)',
        example: 4
    })
    @IsNumber()
    @Min(1)
    @IsOptional()
    installmentsCount?: number;
}