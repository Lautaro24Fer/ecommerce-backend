import { ApiProperty } from "@nestjs/swagger";
import { Address } from "src/address/entities/address.entity";
import { Product } from "src/product/entities/product.entity";
import { UserDto } from "src/user/dto/user.dto";
import { ProductOrder } from "../entities/order.entity";

export class OrderDto{

  user: UserDto;

  address: Address;

  paymentId: string;

  items: ProductOrder[];
}
