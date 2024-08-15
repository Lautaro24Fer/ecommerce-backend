import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { BrandService } from 'src/brand/brand.service';
import { SupplierService } from 'src/supplier/supplier.service';
import { Brand } from 'src/brand/entities/brand.entity';
import { QueryParamsDto } from './dto/query-params.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly brandService: BrandService,
    private readonly supplierService: SupplierService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar que el id de supplier y brand existen. Para eso primero haremos sus respectivos repositorios primero(01:04)

    const brand: Brand = await this.brandService.findOne(
      createProductDto.brandId,
    );

    const supplier: Supplier = await this.supplierService.findOne(
      createProductDto.supplierId,
    );

    const newProduct = this.productRepository.create({
      ...createProductDto,
      brand: brand,
      supplier: supplier,
    });

    const { id }: Product = await this.productRepository.save(newProduct);

    const productCreated: Product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'supplier', 'product_image'],
    });
    return productCreated;
  }

  async findAll(queryParams: QueryParamsDto): Promise<Product[]> {
    const queryBuilder = this.dataSource
      .createQueryBuilder(Product, 'product')
      .innerJoinAndSelect('product.brand', 'brand');

    if (queryParams.brand) {
      queryBuilder.andWhere('brand.name LIKE :brand', {
        brand: `%${queryParams.brand}%`,
      });
    }

    if (queryParams.maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: queryParams.maxPrice,
      });
    }

    if (queryParams.minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: queryParams.minPrice,
      });
    }

    if (queryParams.price) {
      queryBuilder.andWhere('product.price = :price', {
        price: queryParams.price,
      });
    }

    if (queryParams.name) {
      queryBuilder.andWhere('product.name LIKE :name', {
        name: `%${queryParams.name}%`,
      });
    }

    if (queryParams.limit) {
      queryBuilder.take(queryParams.limit);
    }

    const products: Product[] = await queryBuilder.getMany();

    return products;
  }

  async findOne(id: number): Promise<Product> {
    const productFinded: Product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'supplier', 'secondariesImages'],
    });
    if (!productFinded) {
      throw new NotFoundException(
        `The product with the id '${id}' was not founded`,
      );
    }
    return productFinded;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const productFinded: Product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'supplier', 'product_image'],
    });
    if (!productFinded) {
      throw new NotFoundException(
        `The product with the id '${id}' was not founded`,
      );
    }

    if (updateProductDto.name) {
      productFinded.name = updateProductDto.name;
    }

    if (updateProductDto.price) {
      productFinded.price = updateProductDto.price;
    }

    const brand: Brand = await this.brandService.findOne(
      updateProductDto?.brandId,
    );

    const supplier: Supplier = await this.supplierService.findOne(
      updateProductDto?.supplierId,
    );

    if (brand) {
      productFinded.brand = brand;
    }

    if (supplier) {
      productFinded.supplier = supplier;
    }

    const productUpdated: Product =
      await this.productRepository.save(productFinded);
    return productUpdated;
  }

  async remove(id: number): Promise<void> {
    const product: Product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`The product with the id '${id}' was not founded`);
    }
    await this.productRepository.remove(product);
  }
}
