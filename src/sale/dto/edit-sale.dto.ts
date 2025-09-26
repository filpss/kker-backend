import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class EditSaleDto {
    @ApiProperty({
        description: 'O ID do cliente',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    idCustomer: number;

    @ApiProperty({
        description: 'O valor total da venda.',
        example: '250'
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
        description: 'Data em que a venda foi realizada (No formato YYYY-MM-DD).',
        example: '2025-10-31'
    })
    @IsDateString()
    @IsNotEmpty()
    saleDate: Date;
}