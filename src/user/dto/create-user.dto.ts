import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPositive, IsPostalCode, IsString, MinLength } from 'class-validator';
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
  @IsPostalCode()
  postalCode: string;

  @ApiProperty()
  @IsPositive()
  idType: number;

  @ApiProperty()
  @IsPositive()
  idNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressStreet?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressNumber?: string;
}