import { IsEmail } from "class-validator";

export class UpdateUserPassword{
	@IsEmail()
	email: string;	
}