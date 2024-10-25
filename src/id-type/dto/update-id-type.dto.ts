import { PartialType } from '@nestjs/swagger';
import { CreateIdTypeDto } from './create-id-type.dto';

export class UpdateIdTypeDto extends PartialType(CreateIdTypeDto) {}
