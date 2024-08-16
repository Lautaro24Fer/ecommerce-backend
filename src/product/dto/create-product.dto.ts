import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
  isURL,
  Length,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty() 
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 200)
  image: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 1024)
  description: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  secondariesImages?: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  brandId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  supplierId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  typeId: number;
}
