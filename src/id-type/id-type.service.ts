import { Injectable } from '@nestjs/common';
import { CreateIdTypeDto } from './dto/create-id-type.dto';
import { UpdateIdTypeDto } from './dto/update-id-type.dto';

@Injectable()
export class IdTypeService {
  create(createIdTypeDto: CreateIdTypeDto) {
    return 'This action adds a new idType';
  }

  findAll() {
    return `This action returns all idType`;
  }

  findOne(id: number) {
    return `This action returns a #${id} idType`;
  }

  update(id: number, updateIdTypeDto: UpdateIdTypeDto) {
    return `This action updates a #${id} idType`;
  }

  remove(id: number) {
    return `This action removes a #${id} idType`;
  }
}
