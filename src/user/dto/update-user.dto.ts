import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 80)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  @Length(1, 50)
  email: string;
}
