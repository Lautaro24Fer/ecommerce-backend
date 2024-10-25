import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateIdTypeDto } from './dto/create-id-type.dto';
import { UpdateIdTypeDto } from './dto/update-id-type.dto';
import { Repository } from 'typeorm';
import { IdType } from './entities/id-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IBadRequestex, INotFoundEx } from './dto/responseInterfaces';

@Injectable()
export class IdTypeService {

  constructor( @InjectRepository(IdType) private readonly idTypeRepository: Repository<IdType> ) {}
  // DNI: Argentina, Perú
  // CPF: Brazil
  // CURP: Mexico
  // RUT: Chile

  async create(createIdTypeDto: CreateIdTypeDto): Promise<IdType> {
    const idTypeCreated: IdType = await this.idTypeRepository.save(createIdTypeDto).catch((error) => {
      const exResponse: IBadRequestex = { status: false, message: error };
      throw new BadRequestException(exResponse);
    });
    return idTypeCreated;
    
  }

  async findAll(): Promise<IdType[]> {
    const idTypes: IdType[] = await this.idTypeRepository.find().catch((error) => {
      const exResponse: IBadRequestex = { status: false, message: error }
      throw new BadRequestException(exResponse);
    });

    if(idTypes.length < 1){
      const exResponse: INotFoundEx = { status: false, message: 'Identification types not founded in database' };
      throw new NotFoundException(exResponse);
    }
    return idTypes;
  }

  async findOne(id: number): Promise<IdType> {
    const idType: IdType = await this.idTypeRepository.findOneBy({ id }).catch((error) => {
      const exResponse: IBadRequestex = { status: false, message: error }
      throw new BadRequestException(exResponse);
    });
    if(!idType){
      const exResponse: INotFoundEx = { status: false, message: 'Identification type not founded' };
      throw new NotFoundException(exResponse);
    }
    return idType;
  }

  async update(id: number, updateIdTypeDto: UpdateIdTypeDto): Promise<IdType> {
    const idTypeToUpdate: IdType = await this.idTypeRepository.findOneBy({ id }).catch((error) => {
      const exResponse: IBadRequestex = { status: false, message: error };
      throw new BadRequestException(exResponse);
    });

    const idTypeUpdatedBody = { ...idTypeToUpdate, ...updateIdTypeDto };

    const idTypeUpdated: IdType = await this.idTypeRepository.save(idTypeUpdatedBody).catch((error) => {
      const exResponse: IBadRequestex = { status: false, message: error };
      throw new BadRequestException(exResponse);
    });

    return idTypeUpdated;
  }

  async remove(id: number) {
    
    const idTypeToRemove: IdType = await this.idTypeRepository.findOneBy({ id }).catch((error) => {
      const exResponse: IBadRequestex = { status: false, message: error };
      throw new BadRequestException(exResponse);
    });
    
    if(!idTypeToRemove){
      const exResponse: IBadRequestex = { status: false, message: `The id '${id}' was not founded` };
      throw new BadRequestException(exResponse);
    }

    await this.idTypeRepository.remove(idTypeToRemove).catch((error) => {
      const exResponse: IBadRequestex = { status: false, message: error };
      throw new BadRequestException(exResponse);
    });
  }
}
