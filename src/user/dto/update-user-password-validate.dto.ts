import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

// Email de la cuenta junto con el codigo enviado por mail

export class ValidateUpdateUserPasswordCodeDto{
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	code: number;
}