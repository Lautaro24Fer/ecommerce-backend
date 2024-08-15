import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  create(@Body() createImageDto: CreateImageDto) {
    return this.imagesService.create(createImageDto);
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
  findAll() {
    return this.imagesService.findAll();
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
  findOne(@Param('id') id: number) {
    return this.imagesService.findOne(id);
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
  update(@Param('id') id: number, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(id, updateImageDto);
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
  remove(@Param('id') id: number) {
    return this.imagesService.remove(id);
  }
}
