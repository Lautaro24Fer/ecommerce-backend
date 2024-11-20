import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Repository } from 'typeorm';
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
import { IBadRequestex, INotFoundEx, IRecourseCreated, IRecourseDeleted, IRecourseFound, IRecourseUpdated } from 'src/global/responseInterfaces';
import { UpdateType } from 'src/global/enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { Item, ItemDto } from 'src/payment/dto/preference-payment';
import { MulterFile } from 'src/images/dto/multer-file';
import { FtpService } from 'src/ftp/ftp.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(forwardRef(() => ImagesService)) private readonly productImageService: ImagesService,
    private readonly brandService: BrandService,
    private readonly supplierService: SupplierService,
    private readonly typeService: TypeService,
    private readonly ftpService: FtpService
  ) {}

  async create(createProductDto: CreateProductDto, file?: MulterFile): Promise<IRecourseCreated<Product>> {

    // Verificar que el id de supplier y brand existen. Para eso primero haremos sus respectivos repositorios primero

    const brand: Brand = (await this.brandService.findOne(createProductDto.brandId)).recourse;

    const supplier: Supplier = (await this.supplierService.findOne(createProductDto.supplierId)).recourse;

    const type: ProductType = (await this.typeService.findOne(createProductDto.typeId)).recourse;

    let imageUrl: string = "";

    if(file){
      imageUrl = await this.ftpService.saveImageOnFTPServer(file);
    }

    const newProduct: Product = this.productRepository.create({  
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      type,
      supplier,
      brand,
      image: imageUrl
    });

    const { id }: Product = await this.productRepository.save(newProduct);

    // if(createProductDto.secondariesImages){
    //   const secondariesImagesMapped: ProductImage[] = await Promise.all(createProductDto.secondariesImages.map(async(image) =>{
    //     return (await this.productImageService.create({ productId: id, url: image })).recourse;
    //   }));

    //   newProduct.secondariesImages = [ ...secondariesImagesMapped ];
    //   await this.productRepository.save(newProduct);
    // }

    const productCreated: Product = (await this.findOne(id)).recourse;
    const response: IRecourseCreated<Product> = {
      status: true,
      message: "The product was created succesfully",
      recourse: productCreated
    }
    return response;
  } 

  async findAll(queryParams: QueryParamsDto): Promise<IRecourseFound<Product[]>> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product') 
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

    const products: Product[] = await queryBuilder.getMany().catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error loading all products"
      };
      throw new BadRequestException(badRequestError);
    });

    const response: IRecourseFound<Product[]> = {
      status: true,
      message: "The products was found succesfully",
      recourse: products
    }

    return response;
  }

  async findOne(id: number): Promise<IRecourseFound<Product>> {
    const product: Product = await this.productRepository.findOne({
      where: { id }, relations: ['brand', 'supplier', 'type', 'secondariesImages']})
      .catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error finding the product by id"
      };
      throw new BadRequestException(badRequestError);
    })
    if (!product) {
      const notFoundError: INotFoundEx = {
        status: false,
        message: `The product with id '${id}' was not found`
      }
      throw new NotFoundException(notFoundError);
    }
    const recourseFound: IRecourseFound<Product> = {
      status: true,
      message: "The product was found succcesfully",
      recourse: product
    };
    return recourseFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<IRecourseUpdated<Product>> {
    const productFinded: Product = (await this.findOne(id)).recourse;

    const body: Product = {
      ...productFinded,
      ...updateProductDto
    }

    if (updateProductDto.brandId) {
      const brand: Brand = (await this.brandService.findOne(updateProductDto?.brandId)).recourse;
     body.brand = brand;
    }

    if (updateProductDto.supplierId) {
      const supplier: Supplier = (await this.supplierService.findOne(updateProductDto?.supplierId)).recourse;
     body.supplier = supplier;
    }

    if(updateProductDto.typeId){
      const type: ProductType = (await this.typeService.findOne(updateProductDto?.typeId)).recourse;
     body.type = type;
    }

    const productUpdated: Product = await this.productRepository.save(body).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error updating the product"
      };
      throw new BadRequestException(badRequestError);
    });
    const recourse: IRecourseUpdated<Product> = {
      status: true,
      message: "The product was updated succesfully",
      recourse: productUpdated
    };

    return recourse;
  }

  async remove(id: number): Promise<IRecourseDeleted<Product>> {
    const product: Product = (await this.findOne(id)).recourse;
    const urlPath: string = product.image;
    const removed: Product = await this.productRepository.remove(product).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: `Error removing the product with id '${id}'`
      };
      throw new BadRequestException(badRequestError);
    });
    await this.ftpService.deleteFile(urlPath);
    await Promise.all(product.secondariesImages.map(async (image) => {
      await this.ftpService.deleteFile(image.url);
    }));
    const response: IRecourseDeleted<Product> = {
      status: true,
      message: "The product was deleted succesfully",
      recourse: removed
    };
    return response;
  }

  async validateOperation(items: ItemDto[]): Promise<IRecourseFound<any>> {
    console.log("--THIS IS THE VALIDATION OF THE PAYMENT OPERATION--")
    for(const item of items) {
      const product: Product = (await this.findOne(item.id)).recourse;
      console.log("product: \n" + product);
      if(product.stock < item.quantity) {
        console.log("The product have not many stock. \n product stock: " + product.stock + "\nproduct quantity in order: " + item.quantity + "\n\n")
        const badRequestError: IBadRequestex = {
          status: false,
          message: `There is not enough stock of the product with id '${item.id}' to carry out the operation`
        }
        throw new BadRequestException(badRequestError);
      }
    }
    const response: IRecourseFound<any> = {
      status: true,
      message: "The operation vas validated succesfully. Valid order",
      recourse: null
    };
    return response;
  }
}
