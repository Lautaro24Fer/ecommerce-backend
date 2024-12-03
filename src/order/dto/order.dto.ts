import { ApiProperty } from "@nestjs/swagger";
import { Address } from "src/address/entities/address.entity";
import { Product } from "src/product/entities/product.entity";
import { UserDto } from "src/user/dto/user.dto";
import { ProductOrder } from "../entities/order.entity";
import { ProductOrderDto } from "./product-order.dto";

export class OrderDto{

  user: UserDto;

  address: Address;

  paymentId: string;

  items: ProductOrderDto[];
}

export class OrderQueryParams {
  minDate: Date;
  maxDate: Date;
}