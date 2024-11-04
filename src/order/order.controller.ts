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

@ApiTags('Orders')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
  create(@Body() createOrderDto: CreateOrderDto): Promise<IRecourseCreated<Order>> {
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
  findOne(@Param('id') id: number): Promise<IRecourseFound<Order>> {
    return this.orderService.findOneById(id);
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
