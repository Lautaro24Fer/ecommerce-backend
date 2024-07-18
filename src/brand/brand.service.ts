import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    try {
      const brandCreated: Brand =
        await this.brandRepository.save(createBrandDto);
      return brandCreated;
    } catch {
      throw new BadRequestException('Error creating the brand');
    }
  }

  async findAll(): Promise<Brand[]> {
    const brands: Brand[] = await this.brandRepository.find();
    if (!brands || brands.length < 1) {
      throw new NotFoundException('Brands not founded');
    }
    return brands;
  }

  async findOne(id: number): Promise<Brand> {
    const brand: Brand = await this.brandRepository.findOne({
      where: { id: id },
    });
    if (!brand) {
      throw new NotFoundException(`Brand with id '${id}' was not founed`);
    }
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brand: Brand = await this.brandRepository.findOne({
      where: { id: id },
    });
    if (!brand) {
      throw new NotFoundException(`Brand with id '${id}' was not founed`);
    }
    Object.assign(brand, updateBrandDto);
    const brandUpdated: Brand = await this.brandRepository.save(brand);
    return brandUpdated;
  }

  async remove(id: number): Promise<void> {
    const brand: Brand = await this.brandRepository.findOne({
      where: { id: id },
    });
    if (!brand) {
      throw new NotFoundException(`Brand with id '${id}' was not founed`);
    }
    await this.brandRepository.remove(brand);
  }
}
