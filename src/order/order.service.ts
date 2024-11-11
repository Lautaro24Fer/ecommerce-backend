import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, ProductOrder } from './entities/order.entity';
import { Repository, TreeRepositoryNotSupportedError } from 'typeorm';
import { IBadRequestex, INotFoundEx, IRecourseCreated, IRecourseDeleted, IRecourseFound } from 'src/global/responseInterfaces';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/user/dto/user.dto';
import { OrderDto } from './dto/order.dto';
import { MethodPaymentType } from 'src/global/enum';

@Injectable()
export class OrderService {

  constructor( 
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>, 
    @InjectRepository(ProductOrder) private readonly productOrderRepository: Repository<ProductOrder>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly configService: ConfigService) {}

    ACCESS_TOKEN = this.configService.get<string>('MP_ACCESS_TOKEN');

    async verifyStatus(paymentId: number){
      if(paymentId === 12345 ){ // Codigo de prueba
        return true;
      }
      const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.ACCESS_TOKEN}`,
        },
      })
      .then(data => data.json())
      .catch((error) => {
        console.error(error);
        const badRequestError: IBadRequestex = {
          status: false,
          message: "Error fetching the payment status by payment id"
        };
        throw new BadRequestException(badRequestError);
      });
      if(response?.status === 404) {
        const badRequestError: INotFoundEx = {
          status: false,
          message: `The payment order with id '${paymentId}' was not founded in marcado pago server`
        }
        throw new NotFoundException(badRequestError);
      }
      return response;
    }

  async create(createOrderDto: CreateOrderDto): Promise<IRecourseCreated<OrderDto>> {

    // Verificar si el paymentId existe en el servidor de mercado pago
    const mpApiResponse = await this.verifyStatus(createOrderDto.paymentId);

    const user: User = (await this.userService.findOneById(createOrderDto.userId)).recourse;

    const address: Address = user.address.find((add) => add.id === createOrderDto.addressId);

    if(!address) {
      const badRequestError: INotFoundEx = {
        status: false,
        message: `The address with id '${createOrderDto.addressId}' was not register with the user or not exists`
      };
      throw new NotFoundException(badRequestError);
    };

    const products = await Promise.all(createOrderDto.products.map(async (productInstance) => {
      const productFound: Product = (await this.productService.findOne(productInstance.productId)).recourse;
      return {
        product: productFound,
        quantity: productInstance.quantity
      }
    }));

    const orderInstance = this.orderRepository.create({
      ...createOrderDto,
      address,
      user,
      paymentId: createOrderDto.paymentId.toString(),
      productOrder: products,
    })

    const orderCreated: Order = await this.orderRepository.save(orderInstance).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error in the creation of a new order"
      };
      throw new BadRequestException(badRequestError);
    });

    console.log(" --- CREATION OF THE NEW ORDER ---- ");
    console.log("order created: (no parsed or formatted)")
    console.log(JSON.stringify(orderCreated, null, 2));

    const userParsed: UserDto = this.userService.mapUserToUserDto(orderCreated.user);

    const orderParsed: OrderDto = {
      ...orderCreated,
      user: userParsed,
      items: [...orderCreated.productOrder]
    };

    const recourseCreated: IRecourseCreated<OrderDto> = {
      status: true,
      message: "The order was created succesfully",
      recourse: orderParsed
    };

    return recourseCreated;
  }

  async findAll(): Promise<IRecourseFound<OrderDto[]>> {
    const orders: OrderDto[] = await this.orderRepository.find().then((orders) => {
      const ordersDto: OrderDto[] = orders.map((order) => {
        const userDto: UserDto = this.userService.mapUserToUserDto(order.user);
        const orderDto: OrderDto = {
          ...order,
          user: userDto,
          items: [...order.productOrder]
        };
        return orderDto;
      });
      return ordersDto;
    }).
    catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error loading the orders from the database"
      };
      throw new BadRequestException(badRequestError);
    });

    const response: IRecourseFound<OrderDto[]> = {
      status: true,
      message: "The orders was found succesfully",
      recourse: orders
    };
    return response;
  }

  async findOneById(id: number): Promise<IRecourseFound<Order>> {
    
    const order: Order = await this.orderRepository.findOneBy({ id })
    .catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error finding the order by id"
      };
      throw new BadRequestException(badRequestError);
    });
    if(!order){
      const notFoundError: INotFoundEx = {
        status: false,
        message: `The order with id '${id}' was not found`
      };
      throw new NotFoundException(notFoundError);
    }
    const response: IRecourseFound<Order> = {
      status: true,
      message: "The order was found succesfully",
      recourse: order
    };
    return response;
  }

  async remove(id: number): Promise<IRecourseDeleted<Order>> {
    
    const order: Order = (await this.findOneById(id)).recourse;
    const orderDeleted: Order = await this.orderRepository.remove(order).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: `Error removing the order with id '${id}'`
      };
      throw new BadRequestException(badRequestError);
    });
    const recourseDeleted: IRecourseDeleted<Order> = {
      status: true,
      message: `The recourse was deleted succesfully`,
      recourse: orderDeleted
    };
    return recourseDeleted;
  }
}
