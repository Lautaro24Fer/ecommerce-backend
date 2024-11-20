import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/image.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { IBadRequestex, INotFoundEx, IRecourseCreated, IRecourseDeleted, IRecourseFound, IRecourseUpdated } from 'src/global/responseInterfaces';
import { FtpService } from 'src/ftp/ftp.service';
import * as fs from "fs";
import { MulterFile } from './dto/multer-file';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImagesService {

  private readonly FTP_SERVER: string;

  constructor(
    @InjectRepository(ProductImage) private readonly imageRepository: Repository<ProductImage>,
    @Inject(forwardRef(() => ProductService)) private readonly productService: ProductService,
    private readonly ftpService: FtpService,
    private readonly configService: ConfigService) {
      this.FTP_SERVER = this.configService.get<string>('FTP_SERVER');
    }
  
  async create(id: number, file: MulterFile) {

    const product: Product = (await this.productService.findOne(id)).recourse;

    const imagePath = await this.ftpService.saveImageOnFTPServer(file);

    const imageCreated: ProductImage = this.imageRepository.create({ product, url: imagePath });

    const imageSaved: ProductImage = await this.imageRepository.save(imageCreated).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error in the creation of the product image"
      };
      throw new BadRequestException(badRequestError);
    });

    const response: IRecourseCreated<ProductImage> = {
      status: true,
      message: "The product image was created succesfully",
      recourse: imageSaved
    }
    return response;
  }

  async findAll(): Promise<IRecourseFound<ProductImage[]>> {
    try{
      const allImages: ProductImage[] = await this.imageRepository.createQueryBuilder('product_image')
      .leftJoin('product_image.product', 'product')
      .addSelect('product.id')
      .orderBy('product_image.id', 'ASC') 
      .getMany()
      const recourse: IRecourseFound<ProductImage[]> = {
        status: true,
        message: "The product images was found succesfully",
        recourse: allImages
      }
      return recourse;
    }
    catch(error){
      throw new BadRequestException({ error: 'Error exception loading all images' })
    }
  }

  async findOne(id: number): Promise<IRecourseFound<ProductImage>> {
    const productImage: ProductImage = await this.imageRepository.findOne({ where: { id }, relations: ['product'] }).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: `Error loading the product with id '${id}'`
      };
      throw new BadRequestException(badRequestError);
    });
    if(!productImage){
      const notFoundError: INotFoundEx = {
        status: false,
        message: `The image with id '${id}' was not found`
      };
      throw new NotFoundException(notFoundError);
    }
    const recourse: IRecourseFound<ProductImage> = {
      status: true,
      message: "The product image was found succesfully",
      recourse: productImage
    }
    return recourse;
  }

  async findOneByIdAndUrl(productId: number, url: string): Promise<IRecourseFound<ProductImage>>{
    const productImage = await this.imageRepository.findOneBy({ product: { id: productId }, url}).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: `Error loading the product with id '${productId}' and url '${url}'`
      };
      throw new BadRequestException(badRequestError);
    });
    if(!productImage){
      const notFoundError: INotFoundEx = {
        status: false,
        message: `The product image with id '${productId}' and url '${url}' was not founded`
      }
      throw new NotFoundException(notFoundError);
    }
    const recourse: IRecourseFound<ProductImage> = {
      status: true,
      message: "The product image was found succesfully",
      recourse: productImage
    }
    return recourse;
  }

  // async update(id: number, updateImageDto: UpdateImageDto): Promise<IRecourseUpdated<ProductImage>> {
  //   console.log("UPDATE IMAGE DTO")
  //   console.log(updateImageDto)
  //   const productImageToUpdate: ProductImage = (await this.findOne(id)).recourse;
  //   const imageBody: ProductImage = { ...productImageToUpdate, ...updateImageDto };
  //   if((updateImageDto.productId) && (updateImageDto.productId !== productImageToUpdate.product.id) ){
  //     const newProduct: Product = (await this.productService.findOne(updateImageDto.productId)).recourse;
  //     imageBody.product = newProduct;
  //   }
  //   console.log("\n\n IMAGE BODY")
  //   console.log(imageBody)
  //   const productImageUpdated = await this.imageRepository.save(imageBody).catch((error) => {
  //     console.error(error);
  //     const badRequestError: IBadRequestex = {
  //       status: false,
  //       message: `Error updating the product image with id: '${id}'`
  //     };
  //     throw new BadRequestException(badRequestError);
  //   });
  //   const recourse: IRecourseUpdated<ProductImage> = {
  //     status: true,
  //     message: "The product image was updated succesfully",
  //     recourse: productImageUpdated
  //   };
  //   return recourse;
  // }

  async remove(id: number): Promise<IRecourseDeleted<ProductImage>> {
    const productImage: ProductImage = (await this.findOne(id)).recourse;
    const remotePath: string = productImage.url;
    await this.ftpService.deleteFile(remotePath);
    const removed: ProductImage = await this.imageRepository.remove(productImage).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: `Error removing the product image with id: '${id}'`
      };
      throw new BadRequestException(badRequestError);
    });
    const recourse: IRecourseDeleted<ProductImage> = {
      status: true,
      message: "The product image was deleted succesfully",
      recourse: removed
    };
    return recourse;
  }
}
