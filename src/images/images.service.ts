import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/image.entity';
import { DataSource, Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ImagesService {

  constructor(@InjectRepository(ProductImage) private readonly imageRepository: Repository<ProductImage>,
  @Inject(forwardRef(() => ProductService)) private readonly productService: ProductService,
  private readonly dataSource: DataSource) {}

  async create(createImageDto: CreateImageDto) {
    const product: Product = await this.productService.findOne(createImageDto.productId);

    const imageCreated: ProductImage = this.imageRepository.create({ ...createImageDto, product });

    const imageSaved: ProductImage = await this.imageRepository.save(imageCreated);
    return imageSaved;
  }

  async findAll() {
    try{
      const allImages: ProductImage[] = await this.imageRepository.createQueryBuilder('product_image')
      .leftJoin('product_image.product', 'product')
      .addSelect('product.id')
      .orderBy('product_image.id', 'ASC') 
      .getMany()
      return allImages;
    }
    catch(error){
      console.log(error)
      throw new BadRequestException({ error: 'Error exception loading all images' })
    }
  }

  async findOne(id: number) {
    const productImage: ProductImage = await this.imageRepository.findOneBy({ id });
    if(!productImage){
      throw new NotFoundException({ error: `The product image id '${id}' was not founded` });
    }
    return productImage;
  }

  async findOneByIdAndUrl(productId: number, url: string){
    const productImage = await this.imageRepository.findOneBy({ product: { id: productId }, url});
    if(!productImage){
      throw new NotFoundException({ error: `The product image with id ''${productId}'' and url '${url}' was not founded` });
    }
    return productImage;
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const productImageToUpdate: ProductImage = await this.imageRepository.findOneBy({ id });
    if(!productImageToUpdate){
      throw new NotFoundException({ error: `The product image id '${id}' was not founded` });
    }
    const productImageUpdated: ProductImage = { ...productImageToUpdate, ...updateImageDto };
    await this.imageRepository.save(productImageUpdated);
    return productImageUpdated;
  }

  async remove(id: number) {
    const productImage: ProductImage = await this.imageRepository.findOneBy({ id });
    if(!productImage){
      throw new NotFoundException({ error: `The product image id '${id}' was not founded` });
    }
    await this.imageRepository.delete(productImage);
    return productImage;
  }
}
