import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRecourseCreated, IRecourseDeleted, IRecourseFound, IRecourseUpdated } from 'src/global/responseInterfaces';
import { Supplier } from './entities/supplier.entity';

@ApiTags('Suppliers')
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The supplier was created succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The supplier was not created',
  })
  @Post()
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<IRecourseCreated<Supplier>> {
    return this.supplierService.create(createSupplierDto);
  }

  @ApiOperation({ summary: 'Find all suppliers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All the suppliers are loaded succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The suppliers was not loaded',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Suppliers not found',
  })
  @Get()
  findAll(): Promise<IRecourseFound<Supplier[]>> {
    return this.supplierService.findAll();
  }

  @ApiOperation({ summary: 'Find one supplier by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The supplier are loaded succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The supplier was not loaded',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<IRecourseFound<Supplier>> {
    return this.supplierService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a supplier by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The supplier was updated succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The supplier was not updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  @Put(':id')
  update( @Param('id') id: number, @Body() updateSupplierDto: UpdateSupplierDto ): Promise<IRecourseUpdated<Supplier>> {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @ApiOperation({ summary: 'Delete a supplier by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The supplier was deleted succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The supplier was not deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Supplier not found',
  })
  @Delete(':id')
  remove(@Param('id') id: number): Promise<IRecourseDeleted<Supplier>> {
    return this.supplierService.remove(id);
  }
}
