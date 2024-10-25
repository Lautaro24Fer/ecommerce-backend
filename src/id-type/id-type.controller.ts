import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { IdTypeService } from './id-type.service';
import { CreateIdTypeDto } from './dto/create-id-type.dto';
import { UpdateIdTypeDto } from './dto/update-id-type.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('id-type')
export class IdTypeController {
  constructor(private readonly idTypeService: IdTypeService) {}

  @ApiOperation({
    summary: 'Create e new identification type'
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New identification type created'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are not autorize to create identification types'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error in the creation of the identification type'
  })
  @Post()
  create(@Body() createIdTypeDto: CreateIdTypeDto) {
    return this.idTypeService.create(createIdTypeDto);
  }

  @ApiOperation({
    summary: 'Get all identification types'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All identification types loaded'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are not autorize to get identification types'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The identification type id was not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error in the finding of the identification types'
  })
  @Get()
  findAll() {
    return this.idTypeService.findAll();
  }

  @ApiOperation({
    summary: 'Find a identification type by id'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Identification type finded'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are not autorize to find identification types'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The identification type id was not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error in the loading of the identification type'
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.idTypeService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Update of identification type by id'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The identidication type was updated succesfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are not autorize to update identification types'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The identification type id was not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error in the updating of the identification type'
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdTypeDto: UpdateIdTypeDto) {
    return this.idTypeService.update(+id, updateIdTypeDto);
  }

  @ApiOperation({
    summary: 'Delete a identification type by id'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The identidication type was deleted succesfully'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'You are not autorize to delete identification types'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The identification type id was not founded'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error in the deleting of the identification type'
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.idTypeService.remove(+id);
  }
}
