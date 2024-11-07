import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsPositive, IsPostalCode, IsString, Length, MinLength, ValidateNested } from 'class-validator';
import { Address } from 'src/address/entities/address.entity';
import { IdType } from 'src/id-type/entities/id-type.entity';
import { Role } from 'src/roles/entities/role.entity';

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(4, 20)
  surname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(8, 50)
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
  idNumber: number;

  @ApiProperty({ type: () => [AddressDto] })
  @ValidateNested({ each: true })  // Valida cada objeto dentro del array
  @Type(() => AddressDto)  // Especifica que el tipo de cada elemento es `AddressDto`
  address: AddressDto[];
}

class AddressDto {

  @ApiProperty()
  @IsString()
  @Length(1, 10)
  postalCode: string;

  @ApiProperty()
  @IsString()
  @Length(1, 30)
  addressStreet: string;

  @ApiProperty()
  @IsString()
  @Length(1, 10)
  addressNumber: string;
}