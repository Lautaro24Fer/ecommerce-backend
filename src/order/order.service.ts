import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, ProductOrder } from './entities/order.entity';
import { Repository, TreeRepositoryNotSupportedError } from 'typeorm';
import { IBadRequestex, INotFoundEx, IRecourseCreated, IRecourseDeleted, IRecourseFound, IRecourseUpdated } from 'src/global/responseInterfaces';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/user/dto/user.dto';
import { OrderDto } from './dto/order.dto';
import { MethodPaymentType } from 'src/global/enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductOrderDto } from './dto/product-order.dto';

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

  async create(createOrderDto: CreateOrderDto): Promise<IRecourseCreated<Order>> {

    // Verificar si el paymentId existe en el servidor de mercado pago
    // const mpApiResponse = await this.verifyStatus(createOrderDto.paymentId);

    const user: User = (await this.userService.findOneById(createOrderDto.userId)).recourse;

    const address: Address = user.address.find((add) => add.id === createOrderDto.addressId);

    const paymentIdExists: boolean = await this.orderRepository.existsBy({ paymentId:createOrderDto.paymentId.toString() });

    if(paymentIdExists) {
      const badRequestError: IBadRequestex = {
        status: false,
        message: `The payment id '${createOrderDto.paymentId}' already exists`
      };
      throw new BadRequestException(badRequestError);
    }

    if(!address) {
      const badRequestError: INotFoundEx = {
        status: false,
        message: `The address with id '${createOrderDto.addressId}' was not register with the user or not exists`
      };
      throw new NotFoundException(badRequestError);
    };

    const orderInstance = this.orderRepository.create({
      ...createOrderDto,
      address,
      user,
      paymentId: createOrderDto.paymentId.toString(),
      productOrder: [],
    });

    await Promise.all(createOrderDto.products.map(async (productInstance) => {
      const product: Product = (await this.productService.findOne(productInstance.productId)).recourse;
      if(product.stock < productInstance.quantity){
        const badRequestError: IBadRequestex = {
          status: false,
          message: `The product with id '${product.id}' not have many stock`
        };
        throw new BadRequestException(badRequestError);
      }
    }));

    const orderCreated: Order = await this.orderRepository.save(orderInstance).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error in the creation of a new order"
      };
      throw new BadRequestException(badRequestError);
    });

    const products: ProductOrder[] = await Promise.all(createOrderDto.products.map(async (productInstance) => {
      const productFound: Product = (await this.productService.findOne(productInstance.productId)).recourse;

      // TODO: ESTO DEBE HACERSE AL FINAL UNA VEZ NO HAYA EXCEPCIONES AL CREAR LA ORDEN
      productFound.stock = productFound.stock - productInstance.quantity;

      const productUpdated: Product = (await this.productService.update(productFound.id, { stock: productFound.stock })).recourse;

      const productOrder: ProductOrder = this.productOrderRepository.create({
        product: productUpdated,
        quantity: productInstance.quantity,
        order: orderCreated,
      });
      const productOrderCreated: ProductOrder = await this.productOrderRepository.save(productOrder).catch((error) => {
        console.error(error);
        const badRequestError: IBadRequestex = {
          status: false,
          message: `Error in the creation of the productOrder in the order service`
        };
        throw new BadRequestException(badRequestError);
      })
      return productOrderCreated;
    }));

    orderCreated.productOrder = [...products]; 

    console.log(" ==== ORDER CREATED === ");
    console.log(JSON.stringify(orderCreated, null, 2));

    const orderUpdated: Order = await this.orderRepository.save(orderCreated).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error adding the products in the order"
      };
      throw new BadRequestException(badRequestError);
    });

    const recourse: IRecourseCreated<Order> = {
      status: true,
      message: "The order was created succesfully",
      recourse: orderUpdated
    };

  
    return recourse;
  }

  async update(updateOrderDto: UpdateOrderDto): Promise<IRecourseUpdated<OrderDto>> {
    // Actualizacion de fechas de entrega estimadas, finales, y fechas de pago

    return
  }

  async findAll(): Promise<IRecourseFound<Order[]>> {
    const orders: Order[] = await this.orderRepository.find().
    catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error loading the orders from the database"
      };
      throw new BadRequestException(badRequestError);
    });

    const response: IRecourseFound<Order[]> = {
      status: true,
      message: "The orders was found succesfully",
      recourse: orders
    };
    return response;
  }

  async findProductOrderById(id: number) {
    const productOrder: ProductOrder = await this.productOrderRepository.findOne({ where: { id }, relations: ['product'] }).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: `Error finding the productOrder with id '${id}'`
      };
      throw new BadRequestException(badRequestError);
    });
    if(!productOrder){
      const badRequestError: INotFoundEx = {
        status: false,
        message: `Order product with id '${id}' was not found`
      };
      throw new NotFoundException(badRequestError);
    }
    return productOrder;
  }

  async findOneById(id: number): Promise<IRecourseFound<Order>> {
    
    const order: Order = await this.orderRepository.findOne({ where: { id }, relations: { productOrder: true, user: true }})
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

    const user: User = (await this.userService.findOneById(order.user.id)).recourse;
    order.user = user;

    const productOrders: ProductOrder[] = await Promise.all(order.productOrder.map(async (po) => {
      const productOrder: ProductOrder = await this.findProductOrderById(po.id);
      console.log("======== product order ========")
      console.log(JSON.stringify(productOrder, null, 2));
      console.log("\n\n");
      return productOrder;
    }));

    order.productOrder = [...productOrders];

    const response: IRecourseFound<Order> = {
      status: true,
      message: "The order was found succesfully",
      recourse: order
    };
    return response;
  }

  async remove(id: number): Promise<IRecourseDeleted<Order>> {
    
    const order: Order = (await this.findOneById(id)).recourse;
    console.log("\n\n\n ==== REMOVE ==== ")
    console.log("order")
    console.log(order)
    await this.orderRepository.delete(order.id).catch((error) => {
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
      recourse: order
    };
    return recourseDeleted;
  }

  mapOrderToOrderDto(order: Order): OrderDto{

    const userDto: UserDto = this.userService.mapUserToUserDto(order.user);


    const productOrdersDto: ProductOrderDto[] = order.productOrder.map((po) => {

      const productOrderDto: ProductOrderDto = {
        id: po.id,
        orderId: order.id,
        product: po.product,
        quantity: po.quantity
      }
      return productOrderDto;
    })

    const orderDto: OrderDto = {
      user: userDto,
      address: order.address,
      paymentId: order.paymentId,
      items: productOrdersDto
    };

    return orderDto;
  }
}
