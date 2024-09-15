import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export type ResponsetUpdatePasswordCodeDto = {
	status: boolean;
    description: string;
    user?: UserDto | null;
}