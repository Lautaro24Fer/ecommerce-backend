import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductImageResponseDto } from './dto/image-response.dto';
import { ProductImage } from './entities/image.entity';

@ApiTags('Images of products')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: 'Add a new image to a product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New image added succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error adding a new image to a product'
  })
  @Post()
  async create(@Body() createImageDto: CreateImageDto) {
    const imageServiceResponse: ProductImage = await this.imagesService.create(createImageDto);
    const productImageResponse: ProductImageResponseDto = { 
      id: imageServiceResponse.id, 
      url: imageServiceResponse.url, 
      productId: imageServiceResponse.product.id };
      return productImageResponse
  }

  @ApiOperation({ summary: 'Get all images of all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All images loaded succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error loading the images'
  })
  @Get()
  async findAll() {
    return await this.imagesService.findAll();
  }

  @ApiOperation({ summary: 'Get one image by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image loaded succesfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Image not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error loading the image'
  })
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.imagesService.findOne(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image data updated succesfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Image not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error updating the image'
  })
  @ApiOperation({ summary: 'Update image data by id' })
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateImageDto: UpdateImageDto) {
    return await this.imagesService.update(id, updateImageDto);
  }

  @ApiOperation({ summary: 'Delete one image by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Image deleted succesfully'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Image not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error deleting the image'
  })
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.imagesService.remove(id);
  }
}
