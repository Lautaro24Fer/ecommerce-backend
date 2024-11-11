import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsPositive, ValidateNested } from "class-validator";
import { MethodPaymentType } from "src/global/enum";

export class CreateOrderDto {
  @ApiProperty()
  @IsPositive()
  userId: number;

  @ApiProperty()
  @IsPositive()
  addressId: number;

  @ApiProperty()
  @IsPositive()
  paymentId: number;

  @ApiProperty({ type: () => [ProductQuantity] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductQuantity)
  products: ProductQuantity[];

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  installments?: number;

  @ApiProperty({ enum: MethodPaymentType, default: MethodPaymentType.MP_TRANSFER })
  @IsEnum(MethodPaymentType)
  paymentMethod: MethodPaymentType;
}

export class ProductQuantity {

  @ApiProperty()
  @IsPositive()
  productId: number;

  @ApiProperty()
  @IsPositive()
  quantity: number;
}