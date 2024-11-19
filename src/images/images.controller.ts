import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductImageResponseDto } from './dto/image-response.dto';
import { ProductImage } from './entities/image.entity';
import { IRecourseCreated, IRecourseDeleted, IRecourseFound, IRecourseUpdated } from 'src/global/responseInterfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from './dto/multer-file';
import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
  // Define la carpeta donde se guardarán los archivos
  storage: diskStorage({
    destination: (req, file, cb) => {
      // Carpeta 'uploads' dentro del directorio base
      cb(null, path.join(__dirname, '..', '..', 'temp'));
    },
    filename: (req, file, cb) => {
      // Genera un nombre único para cada archivo
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  }),
};

export const multerOptions = {
  storage: multerConfig.storage,
};


@ApiTags('Images of products')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

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
  async findAll(): Promise<IRecourseFound<ProductImage[]>> {
    return await this.imagesService.findAll();
  }

  @ApiOperation({ summary: 'Add a new image to a product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New image added succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error adding a new image to a product'
  })
  @Post(':id')
  @UseInterceptors(FileInterceptor('image')) // 'image' en este caso sería el nombre del campo del formulario
  async create(@Param('id') id: number, @UploadedFile() file: MulterFile)/*: Promise<IRecourseCreated<ProductImage>>*/ {
    const imageServiceResponse = await this.imagesService.create(id, file);
    return imageServiceResponse;
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
  async findOne(@Param('id') id: number): Promise<IRecourseFound<ProductImage>> {
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
  async update(@Param('id') id: number, @Body() updateImageDto: UpdateImageDto): Promise<IRecourseUpdated<ProductImage>> {
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
  async remove(@Param('id') id: number): Promise<IRecourseDeleted<ProductImage>> {
    return await this.imagesService.remove(id);
  }
}
