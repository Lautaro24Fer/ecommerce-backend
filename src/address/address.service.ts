import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { IBadRequestex, INotFoundEx, IRecourseDeleted } from 'src/global/responseInterfaces';

@Injectable()
export class AddressService {

  constructor( @InjectRepository(Address) private readonly addressRepository: Repository<Address> ) {}

  async create(createAddressDto: CreateAddressDto) {
    
    const addressCreated: Address = await this.addressRepository.save(createAddressDto).catch((_) => {
      const response: IBadRequestex = { status: false, message: 'Error creating the new address' };
      throw new BadRequestException(response);
    })

    return addressCreated;
  }

  async findAll() {
    const addresses: Address[] = await this.addressRepository.find().catch((_) => {
      const response: IBadRequestex = { status: false, message: 'Error loading the addresses saved' };
      throw new BadRequestException(response);
    })
    return addresses;
  }

  async findOne(id: number): Promise<Address> {
    const address: Address = await this.addressRepository.findOneBy({ id }).catch((_) => {
      const response: IBadRequestex = { status: false, message: 'Error loading the addresses saved' };
      throw new BadRequestException(response);
    })
    if(!address){
      const response: INotFoundEx = { status: false, message: `The address with id '${id}' was not founded` }
      throw new NotFoundException(response);
    }
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) {

    const addressToUpdate: Address = await this.findOne(id);
    if(!addressToUpdate){
      const response: INotFoundEx = { status: false, message: `The address with id '${id}' was not founded` }
      throw new NotFoundException(response);
    }
    const updatedBody = { ...addressToUpdate, ...updateAddressDto };
    const addressUpdated: Address = await this.addressRepository.save(updatedBody).catch((_) => {
      const response: IBadRequestex = { status: false, message: 'Error saving the new state of the address' };
      throw new BadRequestException(response);
    })

    return addressUpdated;
  }

  async remove(id: number) {
    const address: Address = await this.findOne(id);
    await this.addressRepository.remove(address);
    const response: IRecourseDeleted = { status: true, message: `The address with id '${id}' was deleted succesfully`, recourse: address };
    return response;
  }
}
