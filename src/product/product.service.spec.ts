import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BrandService } from '../brand/brand.service';
import { SupplierService } from '../supplier/supplier.service';
import { TypeService } from '../type/type.service';
import { FtpService } from '../ftp/ftp.service';
import { ImagesService } from '../images/images.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IRecourseFound } from 'src/global/responseInterfaces';
import { ItemDto } from 'src/payment/dto/preference-payment';

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: BrandService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: SupplierService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: TypeService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: FtpService,
          useValue: { saveImageOnFTPServer: jest.fn() },
        },
        {
          provide: ImagesService,
          useValue: { create: jest.fn(), remove: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      // Mock dependencies
      jest.spyOn(productRepository, 'create').mockReturnValue({} as Product);
      jest.spyOn(productRepository, 'save').mockResolvedValue({ id: 1 } as Product);
      jest.spyOn(service, 'findOne').mockResolvedValue({ recourse: {} as Product } as any);

      const result = await service.create({ brandId: 1, supplierId: 1, typeId: 1, cost: 50, price: 100 } as any, {} as any);
      expect(result.status).toBe(true);
      expect(result.message).toBe("The product was created succesfully");
    });

    it('should throw BadRequestException if cost is greater than or equal to price', async () => {
      await expect(service.create({ cost: 100, price: 100 } as any, {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await service.findAll({});
      expect(result.status).toBe(true);
      expect(result.message).toBe("The products was found succesfully");
    });

    it('should handle errors when retrieving products', async () => {
      jest.spyOn(productRepository, 'createQueryBuilder').mockReturnValue({
        innerJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Error')),
      } as any);

      await expect(service.findAll({})).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue({} as Product);

      const result = await service.findOne(1);
      expect(result.status).toBe(true);
      expect(result.message).toBe("The product was found succcesfully");
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });
  describe('update', () => {
    it('should update a product successfully', async () => {
      const product = { id: 1, image: 'old-image-url' } as Product;
      jest.spyOn(service, 'findOne').mockResolvedValue({ recourse: product } as any);
      jest.spyOn(productRepository, 'save').mockResolvedValue({ ...product, name: 'Updated Name' } as Product);

      const result = await service.update(1, { name: 'Updated Name' } as any);
      expect(result.status).toBe(true);
      expect(result.message).toBe("The product was updated succesfully");
    });

    it('should throw BadRequestException if update fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ recourse: {} as Product } as any);
      jest.spyOn(productRepository, 'save').mockRejectedValue(new Error('Error'));

      await expect(service.update(1, {} as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const product = { id: 1, image: 'image-url', secondariesImages: [] } as Product;
      jest.spyOn(service, 'findOne').mockResolvedValue({ recourse: product } as any);
      jest.spyOn(productRepository, 'remove').mockResolvedValue(product);

      const result = await service.remove(1);
      expect(result.status).toBe(true);
      expect(result.message).toBe("The product was deleted succesfully");
    });

    it('should throw BadRequestException if remove fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({ recourse: {} as Product } as any);
      jest.spyOn(productRepository, 'remove').mockRejectedValue(new Error('Error'));

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateOperation', () => {

    const product = { id: 1, stock: 10 } as unknown as Product;
    const findOneResult: IRecourseFound<Product> = {
      status: true,
      message: '',
      recourse: product
    }
    const itemDto: ItemDto = {
      id: 0,
      title: '',
      currency_id: '',
      description: '',
      category_id: '',
      quantity: 0,
      unit_price: 0
    }

    it('should validate operation successfully', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(findOneResult);

      const result = await service.validateOperation([itemDto]);
      expect(result.status).toBe(true);
      expect(result.message).toBe("The operation vas validated succesfully. Valid order");
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(findOneResult);

      const itemDtoFail: ItemDto = {
        id: 1,
        quantity: 999,
      } as unknown as ItemDto;

      await expect(service.validateOperation([itemDtoFail])).rejects.toThrow(BadRequestException);
    });
  });
});