import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";


export class CreateAddressDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  postalCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 30)
  addressStreet: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  addressNumber: string;
}
