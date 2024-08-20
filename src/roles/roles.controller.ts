import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}


  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Role created succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error creating the role'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Can not create a role, unauthorized request'
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'All roles loaded succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error roles all products'
  })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiOperation({ summary: 'Get a role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role loaded succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error loading all roles'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Can not get this role, unauthorized request'
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.rolesService.findOne(id);
  }

  // Los siguientes endpoints solamente estarán de manera temporal
  // Debemos hablar si un administrdor puede eliminar o actualizar roles, o que lo pueda hacer solo con 
  // aquellos que no sean ni User o Admin

  @ApiOperation({ summary: 'Update a role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role updated succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error updating role'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Can not update this role, unauthorized request'
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiOperation({ summary: 'Delete a role by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role deleted succesfully'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error deleting all roles'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Role not found'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Can not delete this role, unauthorized request'
  })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.rolesService.remove(id);
  }
}
