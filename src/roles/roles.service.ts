import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {

  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>){}

  async create(createRoleDto: CreateRoleDto) {
    try{
      const roleCreated: Role = await this.roleRepository.save(createRoleDto);
      return roleCreated;
    }
    catch{
      throw new BadRequestException({ error: 'Error in the creation of the role' });
    }
  }

  async findAll() {
   try{
    const rolesFinded: Role[] = await this.roleRepository.find();
    return rolesFinded;
   }
   catch{
    throw new BadRequestException({ error: 'Error finding all roles' });
   }
  }

  async findOne(id: number) {
    
    const roleFinded: Role = await this.roleRepository.findOneBy({ id });
    if(!roleFinded){
      throw new NotFoundException({error: `role id '${id}' was not founded`});
    }
    return roleFinded;
  }

  async findOneByName(name: string){
    const role: Role = await this.roleRepository.findOneBy({ name });
    if(!role){
      throw new NotFoundException({error: `role name '${name}' was not founded`});
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    let roleFinded: Role = await this.roleRepository.findOneBy({ id });
    if(!roleFinded){
      throw new NotFoundException({error: `role id '${id}' was not founded`});
    }
    try{
      roleFinded = { ...roleFinded, ...updateRoleDto };
      await this.roleRepository.save(roleFinded);
      return roleFinded;
    }
    catch{
      throw new BadRequestException({ error: 'Error updating role' });
    }
  }

  async remove(id: number) {
    const roleFinded: Role = await this.roleRepository.findOneBy({ id });
    if(!roleFinded){
      throw new NotFoundException({error: `role id '${id}' was not founded`});
    }
    try{
      // Sería interesante aplicar una logica de NO eliminación del rol de usuarios o administrador
      // para evitar problemas con los usuarios existentes, entonces solo podrías borrar aquellos 
      // roles secundarios como moderadores, que generarían menos problemas
      await this.roleRepository.delete(roleFinded);
      return { ...roleFinded, deleted: true };
    }
    catch{
      throw new BadRequestException({ error: 'Error updating role' });
    }
  }
}
