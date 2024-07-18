import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request, the product was not created',
  })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @ApiOperation({ summary: 'Find all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All products loaded succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error loading the products',
  })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Find one product by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product by id was loaded succesfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The product by id was not founded',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error loading the product by id',
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Update the data of one product by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product was updated succesfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The product was by id was not founded',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error updating the product',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete a product by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The product was deleted succesfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The product by id was not founded',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error deliting the product',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
