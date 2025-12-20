import { Get, Post, Patch, Delete, Body, Param, Controller, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';
import { EditPaymentDto } from './dto/edit-payment.dto';

@ApiTags('Payments')
@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Get()
    @ApiOperation({ summary: 'Lista todos os pagamentos' })
    getAll(): Promise<Payment[]> {
        return this.paymentService.getAll();
    }

    @Post()
    @ApiOperation({ summary: 'Registra um pagamento para uma parcela' })
    @ApiResponse({ status: 201, description: 'Pagamento registrado com sucesso' })
    @ApiResponse({ status: 400, description: 'Parcela já foi paga' })
    @ApiResponse({ status: 404, description: 'Parcela não encontrada' })
    create(@Body() paymentDto: PaymentDto): Promise<Payment> {
        return this.paymentService.create(paymentDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Busca um pagamento por ID' })
    @ApiParam({ name: 'id', description: 'ID do pagamento' })
    getById(@Param('id', ParseIntPipe) id: number): Promise<Payment | null> {
        return this.paymentService.getById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Edita um pagamento' })
    @ApiParam({ name: 'id', description: 'ID do pagamento' })
    edit(@Param('id', ParseIntPipe) id: number, @Body() editPaymentDto: EditPaymentDto): Promise<Payment> {
        return this.paymentService.edit(id, editPaymentDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove um pagamento (volta a parcela para não paga)' })
    @ApiParam({ name: 'id', description: 'ID do pagamento' })
    @ApiResponse({ status: 204, description: 'Pagamento removido com sucesso' })
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.paymentService.remove(id);
    }
}