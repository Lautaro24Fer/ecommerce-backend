import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

// Para ingresar el correo al que se mandará el código

export class RequestUpdatePasswordCodeDto{
	@ApiProperty()
	@IsEmail()
	email: string;	
}