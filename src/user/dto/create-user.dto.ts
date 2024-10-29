import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPositive, IsPostalCode, IsString, Length, MinLength } from 'class-validator';
import { Address } from 'src/address/entities/address.entity';
import { IdType } from 'src/id-type/entities/id-type.entity';
import { Role } from 'src/roles/entities/role.entity';

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPositive()
  idType: number;

  @ApiProperty()
  @IsPositive()
  idNumber: string;

  @ApiProperty()
  @IsOptional()
  address?: Address;
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