import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductOrder } from './entities/order.entity';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { MethodPaymentType } from '../global/enum';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let productOrderRepository: Repository<ProductOrder>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ProductOrder),
          useClass: Repository,
        },
        {
          provide: ProductService,
          useValue: {}, // Mock ProductService
        },
        {
          provide: UserService,
          useValue: {
            findOneById: jest.fn().mockResolvedValue({
              status: true,
              message: "",
              recourse: {
                id: 1,
                address: [{ id: 1 }] 
              }
            }),
            mapUserToUserDto: jest.fn()
          }, // Mock UserService
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'MP_ACCESS_TOKEN':
                  return 'test-access-token'; // Provide a mock value for the access token
                default:
                  return null;
              }
            }),
          }, // Mock ConfigService
        },
        {
          provide: EmailService,
          useValue: {}, // Mock EmailService
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    productOrderRepository = module.get<Repository<ProductOrder>>(getRepositoryToken(ProductOrder));
  });

  describe('verifyStatus', () => {
    it('should return true for test paymentId', async () => {
      const result = await service.verifyStatus(12345);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if paymentId is not found', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve({ status: 404 }),
        } as Response)
      );

      await expect(service.verifyStatus(99999)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on fetch error', async () => {
      jest.spyOn(global, 'fetch').mockImplementation(() => Promise.reject(new Error('Fetch error')));

      await expect(service.verifyStatus(99999)).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create an order successfully', async () => {
      // Mock dependencies and repository methods
      jest.spyOn(orderRepository, 'save').mockResolvedValue({} as Order);
      jest.spyOn(orderRepository, 'existsBy').mockResolvedValue(false);
      // Add more mocks as needed

      const createOrderDto: CreateOrderDto = {
        userId: 1,
        addressId: 1,
        paymentId: 123,
        products: [{ productId: 1, quantity: 1 }],
        paymentMethod: MethodPaymentType.MP_TRANSFER,
      };

      const result = await service.create(createOrderDto);
      expect(result.status).toBe(true);
      expect(result.message).toBe('The order was created succesfully');
    });

    it('should throw BadRequestException if paymentId already exists', async () => {
      jest.spyOn(orderRepository, 'existsBy').mockResolvedValue(true);

      const createOrderDto = {
        userId: 1,
        addressId: 1,
        paymentId: 123,
        products: [{ productId: 1, quantity: 1 }],
        paymentMethod: MethodPaymentType.MP_TRANSFER,
      };

      await expect(service.create(createOrderDto)).rejects.toThrow(BadRequestException);
    });

    // Add more tests for other error cases
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      jest.spyOn(orderRepository, 'find').mockResolvedValue([{} as Order]);

      const result = await service.findAll();
      expect(result.status).toBe(true);
      expect(result.message).toBe('The orders was found succesfully');
      expect(result.recourse).toHaveLength(1);
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(orderRepository, 'find').mockRejectedValue(new Error('DB error'));

      await expect(service.findAll()).rejects.toThrow(BadRequestException);
    });
  });

  describe('findProductOrderById', () => {
    it('should return a product order', async () => {
      jest.spyOn(productOrderRepository, 'findOne').mockResolvedValue({} as ProductOrder);

      const result = await service.findProductOrderById(1);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if product order is not found', async () => {
      jest.spyOn(productOrderRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findProductOrderById(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(productOrderRepository, 'findOne').mockRejectedValue(new Error('DB error'));

      await expect(service.findProductOrderById(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOneById', () => {
    it('should return an order successfully', async () => {
      const mockOrder = { id: 1, user: { id: 1 }, productOrder: [] } as Order;
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(mockOrder);
      jest.spyOn(service, 'findProductOrderById').mockResolvedValue({} as ProductOrder);
      jest.spyOn(service['userService'], 'findOneById').mockResolvedValue({
        status: true,
        message: "",
        recourse: mockOrder.user
      });

      const result = await service.findOneById(1);
      expect(result.status).toBe(true);
      expect(result.message).toBe('The order was found succesfully');
      expect(result.recourse).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order is not found', async () => {
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOneById(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(orderRepository, 'findOne').mockRejectedValue(new Error('DB error'));

      await expect(service.findOneById(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove an order successfully', async () => {
      const mockOrder: Order = { id: 1 } as Order;
      jest.spyOn(service, 'findOneById').mockResolvedValue({
        status: true,
        message: "",
        recourse: mockOrder
      });
      jest.spyOn(orderRepository, 'delete').mockResolvedValue(undefined);

      const result = await service.remove(1);
      expect(result.status).toBe(true);
      expect(result.message).toBe('The recourse was deleted succesfully');
      expect(result.recourse).toEqual(mockOrder);
    });

    it('should throw BadRequestException on error', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue({
        status: true,
        message: "",
        recourse: { id: 1 } as Order
      });
      jest.spyOn(orderRepository, 'delete').mockRejectedValue(new Error('DB error'));

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('mapOrderToOrderDto', () => {
    it('should map an order to OrderDto successfully', () => {
      const mockOrder: Order = {
        id: 1,
        user: { id: 1, name: 'John', username: 'john_doe' },
        address: { id: 1 },
        paymentId: '12345',
        productOrder: [{ id: 1, product: {}, quantity: 2 }] as ProductOrder[],
      } as Order;

      jest.spyOn(service['userService'], 'mapUserToUserDto').mockReturnValue(mockOrder.user);

      const result = service.mapOrderToOrderDto(mockOrder);
      expect(result).toEqual({
        user: mockOrder.user,
        address: mockOrder.address,
        paymentId: mockOrder.paymentId,
        items: mockOrder.productOrder.map(po => ({
          id: po.id,
          orderId: mockOrder.id,
          product: po.product,
          quantity: po.quantity,
        })),
      });
    });
  });
});