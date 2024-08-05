import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryParamsDto } from './dto/query-params.dto';

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
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Name of the product',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Minimum price of the product',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Maximum price of the product',
  })
  @ApiQuery({
    name: 'price',
    required: false,
    type: Number,
    description: 'Exact price of the product',
  })
  @ApiQuery({
    name: 'brand',
    required: false,
    type: String,
    description: 'Brand of the product',
  })
  @Get()
  async findAll(@Query() queryParams: QueryParamsDto): Promise<Product[]> {
    return await this.productService.findAll(queryParams);
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
