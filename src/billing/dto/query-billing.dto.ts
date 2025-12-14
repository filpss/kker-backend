import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class QueryBillingDto {
    @ApiPropertyOptional({
        description: 'Deadline date to filter customers for billing (format YYYY-MM-DD). If not provided, returns today\'s deadlines.',
        example: '2025-12-13'
    })
    @IsOptional()
    @IsDateString()
    date?: string;
}