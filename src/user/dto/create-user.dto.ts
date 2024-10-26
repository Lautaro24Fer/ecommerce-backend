import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsPositive, IsPostalCode, IsString, Length, MinLength } from 'class-validator';
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
  @IsString()
  @Length(4, 8)
  postalCode: string;

  @ApiProperty()
  @IsPositive()
  idType: number;

  @ApiProperty()
  @IsPositive()
  idNumber: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addressStreet?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  addressNumber?: string;
}