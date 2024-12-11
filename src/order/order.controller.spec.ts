import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { IRecourseCreated, IRecourseFound, IRecourseDeleted } from '../global/responseInterfaces';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDto } from './dto/order.dto';
import { QueryParamsDto } from './dto/query-params.dto';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';
import { IdType } from '../id-type/entities/id-type.entity';
import { Address } from '../address/entities/address.entity';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOrdersByUserId: jest.fn(),
            findOneById: jest.fn(),
            remove: jest.fn(),
            mapOrderToOrderDto: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: EmailService,
          useValue: {
            sendEmailForOrder: jest.fn().mockResolvedValue({
              status: true,
              message: 'The order mail was sent successfully to the admin',
              recourse: {},
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const createOrderDto: CreateOrderDto = { /* datos del DTO */ } as unknown as CreateOrderDto;
      const order = new Order(); // Crea una instancia de Order
      order.id = 1; // Asegúrate de establecer las propiedades necesarias
  
      const expectedResponse: IRecourseCreated<OrderDto> = {
        status: true,
        message: 'The order was created succesfully',
        recourse: {
          user: {
            id: 0,
            name: '',
            surname: '',
            username: '',
            phone: '',
            idType: new IdType,
            idNumber: '',
            address: [],
            email: '',
            method: '',
            roles: []
          }, // Asegúrate de que esto coincida con el mapeo esperado
          address: {
            id: 0,
            postalCode: '',
            addressStreet: '',
            addressNumber: '',
            user: []
          },
          paymentId: '1',
          items: [],
          netPrice: 0,
          IVA: 0.21,
          total: 0,
          profit: 0,
        },
      };
  
      jest.spyOn(orderService, 'create').mockResolvedValue({
        status: true,
        message: 'The order was created succesfully',
        recourse: order,
      });
  
      jest.spyOn(orderService, 'mapOrderToOrderDto').mockReturnValue(expectedResponse.recourse);
  
      const result = await controller.create(createOrderDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should find all orders', async () => {
      const queryParams: QueryParamsDto = { minDate: '2023-01-01', maxDate: '2023-12-31' };
      const expectedResponse: IRecourseFound<Order[]> = {
        status: true,
        message: 'The orders was found succesfully',
        recourse: []
      };

      jest.spyOn(orderService, 'findAll').mockResolvedValue(expectedResponse);

      const result = await controller.findAll(queryParams);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('getUserOrders', () => {
    it('should get all orders of a user by id', async () => {
      const userId = 1;
      const expectedResponse: IRecourseFound<Order[]> = {
        status: true,
        message: '',
        recourse: []
      };

      jest.spyOn(orderService, 'findOrdersByUserId').mockResolvedValue(expectedResponse);

      const result = await controller.getUserOrders(userId);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findOne', () => {
    it('should find one order by id', async () => {
      const orderId = 1;
      const order = new Order(); // Crea una instancia de Order
      order.id = orderId; // Asegúrate de establecer las propiedades necesarias
  
      const expectedResponse: IRecourseFound<OrderDto> = {
        status: true,
        message: 'The order was found successfully',
        recourse: {
          user: {
            id: 0,
            name: '',
            surname: '',
            username: '',
            phone: '',
            idType: new IdType,
            idNumber: '',
            address: [],
            email: '',
            method: '',
            roles: []
          },
          address: {
            id: 0,
            postalCode: '',
            addressStreet: '',
            addressNumber: '',
            user: []
          },
          paymentId: '1',
          items: [],
          netPrice: 0,
          IVA: 0.21,
          total: 0,
          profit: 0,
        },
      };
  
      jest.spyOn(orderService, 'findOneById').mockResolvedValue({
        status: true,
        message: 'The order was found successfully',
        recourse: order,
      });
  
      jest.spyOn(orderService, 'mapOrderToOrderDto').mockReturnValue(expectedResponse.recourse);
  
      const result = await controller.findOne(orderId);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('remove', () => {
    it('should delete an order by id', async () => {
      const orderId = 1;
      const order = new Order(); // Crea una instancia de Order
      order.id = orderId; // Asegúrate de establecer las propiedades necesarias
      order.paymentId = '1';
      order.netPrice = 0;
      order.IVA = 0.21;
      order.total = 0;
      order.profit = 0;
      order.address = {
        id: 0,
        postalCode: '',
        addressStreet: '',
        addressNumber: '',
        user: []
      } as unknown as Address;
      order.user = {
        id: 0,
        name: '',
        surname: '',
        username: '',
        phone: '',
        idType: new IdType(),
        idNumber: '',
        address: [],
        email: '',
        method: '',
        roles: []
      } as unknown as User;
      order.productOrder = [];
  
      const expectedResponse: IRecourseDeleted<OrderDto> = {
        status: true,
        message: 'The order was deleted successfully',
        recourse: {
          user: {
            id: 0,
            name: '',
            surname: '',
            username: '',
            phone: '',
            idType: new IdType(),
            idNumber: '',
            address: [],
            email: '',
            method: '',
            roles: []
          },
          address: {
            id: 0,
            postalCode: '',
            addressStreet: '',
            addressNumber: '',
            user: []
          },
          paymentId: '1',
          items: [],
          netPrice: 0,
          IVA: 0.21,
          total: 0,
          profit: 0,
        },
      };
  
      jest.spyOn(orderService, 'remove').mockResolvedValue({
        status: true,
        message: 'The order was deleted successfully',
        recourse: order,
      });
  
      jest.spyOn(orderService, 'mapOrderToOrderDto').mockReturnValue(expectedResponse.recourse);
  
      const result = await controller.remove(orderId);
      expect(result).toEqual(expectedResponse);
    });
  });
});