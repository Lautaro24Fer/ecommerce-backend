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
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Brands')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new brand was created succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The new brand was not created',
  })
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @ApiOperation({ summary: 'Find all brands' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All brands are loaded succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The brands are not loaded',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brands not founded',
  })
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @ApiOperation({ summary: 'Find a brand by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The brand was loaded succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The brand are not loaded',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not founded',
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.brandService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a brand by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The brand was updated succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The brand was not updated',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not founded',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(id, updateBrandDto);
  }

  @ApiOperation({ summary: 'Delete a brand by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The brand was deleted succesfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad request. The brand was not deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Brand not founded',
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.brandService.remove(id);
  }
}
