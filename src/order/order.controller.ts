import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
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
  create(@Body() createOrderDto: CreateOrderDto): Promise<IRecourseCreated<OrderDto>> {
    return this.orderService.create(createOrderDto);
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
  findAll(): Promise<IRecourseFound<OrderDto[]>> {
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
    const userDto: UserDto = this.userService.mapUserToUserDto(recourseFound.recourse.user);
    const response: IRecourseFound<OrderDto> = {
      ...recourseFound,
      recourse: {
        ...recourseFound.recourse, user: userDto,
        items: [
          ...recourseFound.recourse.productOrder
        ]
      }
    };
    return response;
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
