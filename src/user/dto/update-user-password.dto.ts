import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, MinLength } from "class-validator";

// Nueva contraseña

export class UpdateUserPasswordDto{
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	@Length(1, 100)
    newPassword: string;
}