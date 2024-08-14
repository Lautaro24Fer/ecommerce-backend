import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTypeDto{
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(1, 25)
    name?: string;
}