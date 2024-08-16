import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
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
import { ProductType } from 'src/type/entities/type.entity';
import { TypeService } from 'src/type/type.service';
import { ProductImage } from 'src/images/entities/image.entity';
import { ImagesService } from 'src/images/images.service';
import { CreateImageDto } from 'src/images/dto/create-image.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    //@InjectRepository(ImagesService)
    //private readonly productImagesRepository: Repository<ImagesService>
    @Inject(forwardRef(() => ImagesService)) private readonly productImageService: ImagesService,
    private readonly brandService: BrandService,
    private readonly supplierService: SupplierService,
    private readonly dataSource: DataSource,
    private readonly typeService: TypeService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {

    // Verificar que el id de supplier y brand existen. Para eso primero haremos sus respectivos repositorios primero

    const brand: Brand = await this.brandService.findOne(createProductDto.brandId);

    const supplier: Supplier = await this.supplierService.findOne(createProductDto.supplierId);

    const type: ProductType = await this.typeService.findOne(createProductDto.typeId);

    const newProduct: Product = this.productRepository.create({  
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      image: createProductDto.image,
      type,
      supplier,
      brand
    });

    const { id }: Product = await this.productRepository.save(newProduct);

    /*
    
    LOGICA DE CASCADAS

    Cuando las cascadas están activadas en una relacion entre dos entidades, te permite cambiar en una misma operacion
    los valores de dos o más tablas a partir de las instancias a las entidades desde ts.
    En este caso existe una propiedad llamada secondariesImages en la entidad de product que NO pertenece a la tabla de 
    productos, sino que es una propiedad que hace referencia a aquellas imagenes que están en la tabla de imagesProducts que estén
    relacionadas con la actual instancia de producto. De esta manera desde esta instancia podemos actualizar aquellos
    registros que esten conectados mediante su id en distintas tablas
    
    */

    if(createProductDto.secondariesImages){
      const secondariesImagesMapped: any[] = await Promise.all(createProductDto.secondariesImages.map(async(image) =>{
        return await this.productImageService.create({ productId: id, url: image });
      }));

      newProduct.secondariesImages = [ ...secondariesImagesMapped ];
      await this.productRepository.save(newProduct);
    }

    const productCreated: Product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'supplier', 'secondariesImages'],
    });
    return productCreated;
  } 

  async findAll(queryParams: QueryParamsDto): Promise<Product[]> {
    const queryBuilder = this.dataSource
      .createQueryBuilder(Product, 'product') 
      .innerJoinAndSelect('product.brand', 'brand')
      .innerJoinAndSelect('product.type', 'type')
      .orderBy('product.id', 'ASC');

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

    if(queryParams.type){
      queryBuilder.andWhere('type.name LIKE :type', { // name es una propiedad de la tabla type
        type: `%${queryParams.type}%`
      })
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
      relations: ['brand', 'supplier', 'secondariesImages', 'type'],
    });
    if (!productFinded) {
      throw new NotFoundException(`The product with the id '${id}' was not founded`);
    }
    return productFinded;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const productFinded: Product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand', 'supplier', 'secondariesImages'],
    });
    if (!productFinded) {
      throw new NotFoundException(`The product with the id '${id}' was not founded`);
    }

    if (updateProductDto.name) {
      productFinded.name = updateProductDto.name;
    }

    if(updateProductDto.description){
      productFinded.description = updateProductDto.description;
    }

    if (updateProductDto.price) {
      productFinded.price = updateProductDto.price;
    }

    if (updateProductDto.brandId) {
      const brand: Brand = await this.brandService.findOne(updateProductDto?.brandId);
      productFinded.brand = brand;
    }

    if (updateProductDto.supplierId) {
      const supplier: Supplier = await this.supplierService.findOne(updateProductDto?.supplierId);
      productFinded.supplier = supplier;
    }

    if(updateProductDto.typeId){
      const type: ProductType = await this.typeService.findOne(updateProductDto.typeId);
      productFinded.type = type;
    }

    if(updateProductDto.secondariesImages && updateProductDto.secondariesImages.length > 0){
      productFinded.secondariesImages = await Promise.all(updateProductDto.secondariesImages.map(async (image) => {
        const newProductImageDto = this.mapUrlToProductImage(image, productFinded.id);
        const newProductImageCreated = await this.productImageService.create(newProductImageDto);
        return newProductImageCreated;
      }));
    }

    if(updateProductDto.secondariesImages && updateProductDto.secondariesImages.length === 0){
      productFinded.secondariesImages = [...updateProductDto.secondariesImages];
    } 

    const productUpdated: Product = await this.productRepository.save(productFinded);
    return productUpdated;
  }

  async remove(id: number): Promise<void> {
    const product: Product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`The product with the id '${id}' was not founded`);
    }
    await this.productRepository.remove(product);
  }

  mapUrlToProductImage(url: string, id: number){
    const productImage: CreateImageDto = {
      url,
      productId: id 
    };
    return productImage;
  }
}
