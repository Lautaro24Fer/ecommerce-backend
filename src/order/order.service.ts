import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { IBadRequestex, INotFoundEx, IRecourseCreated, IRecourseDeleted, IRecourseFound } from 'src/global/responseInterfaces';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Address } from 'src/address/entities/address.entity';

@Injectable()
export class OrderService {

  constructor( 
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>, 
    private readonly productService: ProductService,
    private readonly userService: UserService) {}

  async create(createOrderDto: CreateOrderDto): Promise<IRecourseCreated<Order>> {

    const products: Product[] = await Promise.all(createOrderDto.productId.map(async (productId) => {
      const product: IRecourseFound<Product> = await this.productService.findOne(productId);
      return product.recourse;
    }));

    const user: User = (await this.userService.findOneById(createOrderDto.userId)).recourse;

    const address: Address = user.address.find((ad) => ad.id === createOrderDto.addressId);

    if(!address){
      const badRequestError: IBadRequestex = {
        status: false,
        message: "The address arrived is not a valid address for this user"
      };
      throw new BadRequestException(badRequestError);
    }

    const bodyOrder: Order = this.orderRepository.create({ ...createOrderDto, user, products, address });

    const order: Order = await this.orderRepository.save(bodyOrder).catch((error) => {
      console.error(error);
      const badRequestError: IBadRequestex = {
        status: false,
        message: "Error in the creation of the new order"
      };
      throw new BadRequestException(badRequestError);
    });

    const recourseCreated: IRecourseCreated<Order> = {
      status: true,
      message: "The order was created succesfully",
      recourse: order
    };

    return recourseCreated;
  }

  async findAll(): Promise<IRecourseFound<Order[]>> {
    const orders: Order[] = await this.orderRepository.find().catch((error) => {
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

  async findOneById(id: number): Promise<IRecourseFound<Order>> {
    
    const order: Order = await this.orderRepository.findOneBy({ id }).catch((error) => {
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
