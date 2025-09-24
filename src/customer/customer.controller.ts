import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './customer.entity';
import { EditCustomerDto } from './dto/edit-customer.dto';

@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) { };

    @Get()
    get(): Promise<Customer[]> {
        return this.customerService.findAll();
    }

    @Get('active')
    getActive(): Promise<Customer[]> {
        return this.customerService.findAllActive();
    }

    @Post()
    async create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
        return this.customerService.create(createCustomerDto);
    }

    @Get(':id')
    getOne(@Param('id') idCustomer: number): Promise<Customer | null> {
        return this.customerService.findOne(idCustomer);
    }

    @Patch(':id')
    async edit(@Param('id') idCustomer: number, @Body() editCustomerDto: EditCustomerDto): Promise<Customer> {
        return this.customerService.edit(idCustomer, editCustomerDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') customerId: number): Promise<void> {
        return await this.customerService.remove(customerId);
    }
}