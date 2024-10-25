import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdTypeService } from './id-type.service';
import { CreateIdTypeDto } from './dto/create-id-type.dto';
import { UpdateIdTypeDto } from './dto/update-id-type.dto';

@Controller('id-type')
export class IdTypeController {
  constructor(private readonly idTypeService: IdTypeService) {}

  @Post()
  create(@Body() createIdTypeDto: CreateIdTypeDto) {
    return this.idTypeService.create(createIdTypeDto);
  }

  @Get()
  findAll() {
    return this.idTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.idTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdTypeDto: UpdateIdTypeDto) {
    return this.idTypeService.update(+id, updateIdTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.idTypeService.remove(+id);
  }
}
