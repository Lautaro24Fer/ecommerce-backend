import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class UpdateUserPasswordValidate{
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsNumber()
	@MinLength(6)
	code: number;
}