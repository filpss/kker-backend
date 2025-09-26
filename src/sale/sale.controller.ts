import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { SaleService } from './sale.service';
import { Sale } from './sale.entity';
import { CreateSaleDto } from './dto/create-sale.dto';
import { EditSaleDto } from './dto/edit-sale.dto';

@Controller('sale')
export class SaleController {
    constructor(private salesService: SaleService) { }

    @Get()
    get(): Promise<Sale[]> {
        return this.salesService.getAll();
    }

    @Post()
    create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
        return this.salesService.create(createSaleDto);
    }

    @Get(':id')
    getById(@Param('id') idSale: number): Promise<Sale | null> {
        return this.salesService.getById(idSale);
    }

    @Patch(':id')
    edit(@Param('id') id: number, @Body() editSaleDto: EditSaleDto): Promise<Sale> {
        return this.salesService.edit(id, editSaleDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') idSale: number): Promise<void> {
        return this.salesService.remove(idSale);
    }
}