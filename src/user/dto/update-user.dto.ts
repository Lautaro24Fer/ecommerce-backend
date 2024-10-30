import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsPositive,
  IsPostalCode,
  IsString,
  Length,
} from 'class-validator';
import { Address } from 'src/address/entities/address.entity';

export class FullUpdateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @Length(8, 50)
  password: string;

  @ApiProperty()
  @IsEmail()
  email: string;  

  @ApiProperty()
  @IsPositive()
  idType: number;

  @ApiProperty()
  @IsPositive()
  idNumber: string;

  @ApiProperty()
  address: AddressDto[];
}

export class PartialUpdateUserDto {
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
  @IsOptional()
  @IsPositive()
  idType?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  idNumber?: string;

  @ApiProperty()
  @IsOptional()
  address?: AddressDto[];
}

class AddressDto {

  @ApiProperty()
  @IsString()
  @Length(4, 8)
  postalCode: string;

  @ApiProperty()
  @IsString()
  @Length(1, 50)
  addressStreet: string;

  @ApiProperty()
  @IsString()
  @Length(1, 8)
  addressNumber: string;
}
