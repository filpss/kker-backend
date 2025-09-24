import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsDateString, MinLength } from 'class-validator';

export class CreateCustomerDto {
    @ApiProperty({
        description: 'O nome completo do cliente',
        example: 'João da Silva'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'O número de telefone do cliente.',
        example: '71988887777'
    })
    @IsString()
    @IsNotEmpty()
    contact: string;

    @ApiProperty({
        description: 'Valor que o cliente ainda precisa pagar (inteiro ou float).',
        example: 593.29,
    })
    @IsNumber()
    debt: number;

    @ApiProperty({
        description: 'Informa se o cliente está ou não ativo no sistema (true ou false).',
        example: true
    })
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({
        description: 'Data de cobrança escolhida pelo cliente para o próximo pagamento (No formato YYYY-MM-DD).',
        example: '2025-10-31'
    })
    @IsDateString()
    deadLine: Date;
}