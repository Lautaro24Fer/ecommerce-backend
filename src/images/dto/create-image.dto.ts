import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsPositive, IsString, Length } from "class-validator";


export class CreateImageDto {
  @ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(1, 80)
	url: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	@IsPositive()
	productId: number;
}
