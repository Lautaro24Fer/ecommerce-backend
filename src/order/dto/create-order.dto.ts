import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsPositive, ValidateNested } from "class-validator";
import { Product } from "src/product/entities/product.entity";

export class CreateOrderDto {
  @ApiProperty()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsPositive()
  addressId: number;

  @ApiProperty()
  @IsArray()
  productId: number[];
}
