import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPositive,
  IsPostalCode,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(8, 50)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsPostalCode()
  postalCode?: string;

  @ApiProperty()
  @IsPositive()
  idType?: number;

  @ApiProperty()
  @IsPositive()
  idNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addressStreet?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addressNumber?: string;
}
