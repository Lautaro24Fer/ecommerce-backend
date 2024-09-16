import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

// Para ingresar el correo al que se mandará el código

export class RequestUpdatePasswordCodeDto{
	@ApiProperty()
	@IsString()
	usernameOrEmail: string;	
}