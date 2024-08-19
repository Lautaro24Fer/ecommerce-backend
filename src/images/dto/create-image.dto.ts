import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString, IsUrl, Length } from "class-validator";


export class CreateImageDto {
  @ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsUrl()
	url: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	productId: number;
}
