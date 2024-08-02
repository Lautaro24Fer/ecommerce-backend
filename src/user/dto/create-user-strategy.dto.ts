import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserStrategyDto {
  @ApiProperty()
  @IsString()
  username?: string;
  // Al momento de inicializarse será nulo, luego desde el front create una ventana que le indique al usuario
  // que ingrese su username. Una vez cargado, se actualiza el registro, ya que la idea es hacer este proceso
  // una unica vez ( Cuando el usuario se logea por primera vez )

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  method: string;
}
