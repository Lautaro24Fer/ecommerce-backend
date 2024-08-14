import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Type of product')
@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @ApiOperation({ summary: 'Create a new type of product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product type created succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error creating the product type'
  })
  @Post()
  create(@Body() createTypeDto: CreateTypeDto) {
    return this.typeService.create(createTypeDto);
  }

  @ApiOperation({ summary: 'Get all product types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product types loaded succefully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error loading the product types'
  })
  @Get()
  findAll() {
    return this.typeService.findAll();
  }

  @ApiOperation({ summary: 'Get a product type by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product type loaded succefully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product type not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error loading the product type'
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a product type by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product type updated succesfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product type not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error updating the product type'
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    return this.typeService.update(+id, updateTypeDto);
  }

  @ApiOperation({ summary: 'Delete a product type by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product type deleted succesfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product type not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error deleting the product type'
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeService.remove(+id);
  }
}
