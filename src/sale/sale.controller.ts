import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SaleService } from './sale.service';
import { Sale } from './sale.entity';
import { Installment } from './installment.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { EditSaleDto } from './dto/edit-sale.dto';
import { EditInstallmentDto } from './dto/edit-installment.dto';

@ApiTags('Sales')
@Controller('sale')
export class SaleController {
    constructor(private salesService: SaleService) { }

    @Get()
    @ApiOperation({ summary: 'Lista todas as vendas' })
    get(): Promise<Sale[]> {
        return this.salesService.getAll();
    }

    @Post()
    @ApiOperation({ summary: 'Cria uma nova venda com parcelas' })
    @ApiResponse({ status: 201, description: 'Venda criada com sucesso' })
    @ApiResponse({ status: 400, description: 'Soma das parcelas diferente do valor total' })
    @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
    create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
        return this.salesService.create(createSaleDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca uma venda por ID' })
    @ApiParam({ name: 'id', description: 'ID da venda' })
    getById(@Param('id', ParseIntPipe) idSale: number): Promise<Sale | null> {
        return this.salesService.getById(idSale);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Edita uma venda' })
    @ApiParam({ name: 'id', description: 'ID da venda' })
    edit(@Param('id', ParseIntPipe) id: number, @Body() editSaleDto: EditSaleDto): Promise<Sale> {
        return this.salesService.edit(id, editSaleDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove uma venda' })
    @ApiParam({ name: 'id', description: 'ID da venda' })
    @ApiResponse({ status: 204, description: 'Venda removida com sucesso' })
    @ApiResponse({ status: 400, description: 'Venda possui pagamentos' })
    delete(@Param('id', ParseIntPipe) idSale: number): Promise<void> {
        return this.salesService.remove(idSale);
    }

    @Get(':id/installments')
    @ApiOperation({ summary: 'Lista todas as parcelas de uma venda' })
    @ApiParam({ name: 'id', description: 'ID da venda' })
    getInstallments(@Param('id', ParseIntPipe) saleId: number): Promise<Installment[]> {
        return this.salesService.getInstallmentsBySale(saleId);
    }

    @Patch('installment/:id')
    @ApiOperation({ summary: 'Edita uma parcela específica' })
    @ApiParam({ name: 'id', description: 'ID da parcela' })
    @ApiResponse({ status: 200, description: 'Parcela editada com sucesso' })
    @ApiResponse({ status: 400, description: 'Parcela já foi paga' })
    editInstallment(
        @Param('id', ParseIntPipe) installmentId: number,
        @Body() editInstallmentDto: EditInstallmentDto
    ): Promise<Installment> {
        return this.salesService.editInstallment(installmentId, editInstallmentDto);
    }
}