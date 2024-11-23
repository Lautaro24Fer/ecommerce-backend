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
import { IRecourseCreated, IRecourseDeleted, IRecourseFound, IRecourseUpdated } from 'src/global/responseInterfaces';
import { Brand } from './entities/brand.entity';

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
  create(@Body() createBrandDto: CreateBrandDto): Promise<IRecourseCreated<Brand>> {
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
    description: 'Brands not found',
  })
  @Get()
  findAll(): Promise<IRecourseFound<Brand[]>> {
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
    description: 'Brand not found',
  })
  @Get(':id')
  findOne(@Param('id') id: number): Promise<IRecourseFound<Brand>> {
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
    description: 'Brand not found',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBrandDto: UpdateBrandDto): Promise<IRecourseUpdated<Brand>> {
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
    description: 'Brand not found',
  })
  @Delete(':id')
  remove(@Param('id') id: number): Promise<IRecourseDeleted<Brand>> {
    return this.brandService.remove(id);
  }
}
