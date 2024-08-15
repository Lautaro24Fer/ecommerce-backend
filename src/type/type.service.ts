import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductType } from './entities/type.entity';

@Injectable()
export class TypeService {

  constructor(@InjectRepository(ProductType) private readonly typeRepository: Repository<ProductType>){}

  async create(createTypeDto: CreateTypeDto) {
    const nameExists: boolean = await this.typeRepository.existsBy({ name: createTypeDto.name});
    if(nameExists){
      throw new BadRequestException({ error: `the product type name '${createTypeDto.name}' already exists` });
    }
    const newProductType: ProductType = await this.typeRepository.save(createTypeDto);
    return newProductType;
  }

  async findAll() {
    try{
      const productTypes: ProductType[] = await this.typeRepository.find();
      return productTypes;
    }
    catch{
      throw new BadRequestException({ error: 'Error exception loading product types' });
    }
  }

  async findOne(id: number) {
    const productType: ProductType = await this.typeRepository.findOneBy({ id });
    if(!productType){
      throw new NotFoundException({ error: `The product type id '${id}' was not founded` });
    }
    return productType;
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const productTypeToUpdate: ProductType = await this.typeRepository.findOneBy({ id });
    if(!productTypeToUpdate){
      throw new NotFoundException({ error: `The product type id '${id}' was not founded` });
    }
    const productTypeUpdated: ProductType = { ...productTypeToUpdate, ...updateTypeDto };
    await this.typeRepository.save(productTypeUpdated)
    return productTypeUpdated
  }

  async remove(id: number) {
    const productType: ProductType = await this.typeRepository.findOneBy({ id });
    if(!productType){
      throw new NotFoundException({ error: `The product type id '${id} was not founded'` });
    }
    await this.typeRepository.delete(productType);
    return {...productType, message: 'product type deleted succesfully'}
  }
}
