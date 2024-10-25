import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateIdTypeDto{
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;
}
