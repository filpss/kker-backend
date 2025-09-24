import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsDateString, IsOptional, MinLength } from 'class-validator';

export class EditCustomerDto {
    @ApiProperty({
        description: 'O nome completo do cliente',
        example: 'João da Silva'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @IsOptional()
    name: string;

    @ApiProperty({
        description: 'O número de telefone do cliente.',
        example: '71988887777'
    })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    contact: string;

    @ApiProperty({
        description: 'Informa se o cliente está ou não ativo no sistema (true ou false).',
        example: true
    })
    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @ApiProperty({
        description: 'Data de cobrança escolhida pelo cliente para o próximo pagamento (No formato YYYY-MM-DD).',
        example: '2025-10-31'
    })
    @IsDateString()
    @IsOptional()
    deadLine: Date;
}