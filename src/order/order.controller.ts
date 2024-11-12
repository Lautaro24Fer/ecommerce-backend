import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRecourseCreated, IRecourseDeleted, IRecourseFound } from 'src/global/responseInterfaces';
import { Order } from './entities/order.entity';
import { OrderDto } from './dto/order.dto';
import { UserService } from 'src/user/user.service';
import { UserDto } from 'src/user/dto/user.dto';

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly userService: UserService) {}

  @ApiOperation({
    summary: "Create a new order"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The order was created succesfully"
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Not authorized to create orders"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Error in the creation of the order"
  })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<IRecourseCreated<OrderDto>> {
    const response: IRecourseCreated<Order> = await this.orderService.create(createOrderDto);
    const orderDto: OrderDto = this.orderService.mapOrderToOrderDto(response.recourse);
    const recourse: IRecourseCreated<OrderDto> = {
      ...response,
      recourse: orderDto
    };
    return recourse;
  }

  @ApiOperation({
    summary: "Find all orders"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The orders was found succesfully"
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Not authorized to load orders"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Error finding the ordersr"
  })
  @Get()
  findAll(): Promise<IRecourseFound<Order[]>> {
    return this.orderService.findAll();
  }

  @ApiOperation({
    summary: "Find one order by id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The order was found succesfully"
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Not authorized to load orders"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Order not found by id"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Error finding the order"
  })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IRecourseFound<OrderDto>> {
    const recourseFound: IRecourseFound<Order> = await this.orderService.findOneById(id);
    
    try{

      console.log("RECOURSE FOUND");
      console.log(JSON.stringify(recourseFound, null, 2));

      const orderDto: OrderDto = this.orderService.mapOrderToOrderDto(recourseFound.recourse);

      const response: IRecourseFound<OrderDto> = {
        ...recourseFound,
        recourse: orderDto
      }

      return response;
    }
    catch(error){
      console.error(error)
      throw new BadRequestException({ error: "asndjkasdnjasdnjakdn" })
    }
  }

  // @Patch(':id')
  // update(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  @ApiOperation({
    summary: "Delete one order by id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The order was deleted succesfully"
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "Not authorized to delete orders"
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Order not found by id"
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Error deleting the order"
  })
  @Delete(':id')
  remove(@Param('id') id: number): Promise<IRecourseDeleted<Order>> {
    return this.orderService.remove(id);
  }
}
