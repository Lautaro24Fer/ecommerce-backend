import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/image.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImagesService {

  constructor(@InjectRepository(ProductImage) private readonly imageRepository: Repository<ProductImage>) {}

  async create(createImageDto: CreateImageDto) {
    const urlExists: boolean = await this.imageRepository.existsBy({ url: createImageDto.url });
    if(urlExists){
      throw new BadRequestException({ error: `The url is currenly exists in the database` });
    }
    const imageCreated: ProductImage = await this.imageRepository.save(createImageDto);
    return imageCreated;
  }

  async findAll() {
    try{
      const allImages: ProductImage[] = await this.imageRepository.find();
      return allImages;
    }
    catch{
      throw new BadRequestException({ error: 'Error exception loading all images' })
    }
  }

  async findOne(id: number) {
    const productImage: ProductImage = await this.imageRepository.findOneBy({ id });
    if(!productImage){
      throw new NotFoundException({ error: `The product image id ${id} was not founded` });
    }
    return productImage;
  }

  async update(id: number, updateImageDto: UpdateImageDto) {
    const productImageToUpdate: ProductImage = await this.imageRepository.findOneBy({ id });
    if(!productImageToUpdate){
      throw new NotFoundException({ error: `The product image id ${id} was not founded` });
    }
    const productImageUpdated: ProductImage = { ...productImageToUpdate, ...updateImageDto };
    await this.imageRepository.save(productImageUpdated);
    return productImageUpdated;
  }

  async remove(id: number) {
    const productImage: ProductImage = await this.imageRepository.findOneBy({ id });
    if(!productImage){
      throw new NotFoundException({ error: `The product image id ${id} was not founded` });
    }
    await this.imageRepository.delete(productImage);
    return productImage;
  }
}
