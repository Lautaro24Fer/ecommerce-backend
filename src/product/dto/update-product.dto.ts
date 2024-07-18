import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, IsString, Length } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 200)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 200)
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  price?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  brandId?: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  supplierId?: number;
}
