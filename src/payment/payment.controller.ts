import { Get, Post, Patch, Delete, Body, Param, Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Payment } from './payment.entity';
import { PaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) { }

    @Get()
    getAll(): Promise<Payment[]> {
        return this.paymentService.getAll();
    }

    @Post()
    create(@Body() paymentDto: PaymentDto): Promise<Payment> {
        return this.paymentService.create(paymentDto);
    }

    @Get(':id')
    getById(@Param('id') id: number): Promise<Payment | null> {
        return this.paymentService.getById(id);
    }

    @Patch(':id')
    edit(@Param('id') id: number, @Body() paymentDto: PaymentDto): Promise<Payment> {
        return this.paymentService.edit(id, paymentDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: number): Promise<void> {
        return this.paymentService.remove(id);
    }
}
