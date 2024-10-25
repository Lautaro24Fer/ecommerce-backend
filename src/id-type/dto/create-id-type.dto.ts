import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, MaxLength } from "class-validator";


export class CreateIdTypeDto {
  @ApiProperty()
  @IsString()
  @Length(1, 8)
  name: string;
}
