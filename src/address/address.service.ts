import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { IBadRequestex, INotFoundEx, IRecourseDeleted, IRecourseFound } from 'src/global/responseInterfaces';
import { Exception } from 'handlebars';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class AddressService {

  constructor(
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    private readonly schedulerRegistery: SchedulerRegistry) {}

  // @Cron('*/2 * * * *')  cada dos min
  @Cron('0 0 * * *') // Ejecuta la limpieza cada día a medianoche

  async handleCron() {
    await this.removeOrphanedAddresses();
  }

  async removeOrphanedAddresses(): Promise<void> {
    const orphanedAddresses = await this.addressRepository
      .createQueryBuilder('address')
      .leftJoin('address.user', 'user')
      .where('user.id IS NULL')
      .getMany();

    if (orphanedAddresses.length > 0) {
      await this.addressRepository.remove(orphanedAddresses);
    }
  }

  async findOrCreate(createAddressDto: CreateAddressDto){
    const { postalCode, addressNumber, addressStreet } = createAddressDto;
    const address: Address = await this.findOneByAllData(postalCode, addressStreet, addressNumber)
    .then(data => data.recourse)
    .catch((error) => {
      if(error instanceof NotFoundException){
        return this.create({ postalCode, addressNumber, addressStreet });
      }
      else{
        throw error;
      }
    });
    return address;
  }

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

  // Teniendo en cuenta que hay muchas variantes de direcciones, se busca 
  // que una dirección exacta exista previamente en la base de datos
  async findOneByAllData(postalCode: string, addressStreet: string, addressNumber: string){

    const address: Address = await this.addressRepository.findOneBy({
      postalCode,
      addressStreet,
      addressNumber
    }).catch((error) => {
      console.error(error);
      const response: IBadRequestex = { status: false, message: 'Error finding the address by all data of the entity' };
      throw new BadRequestException(response);
    });

    if(!address){
      const response: INotFoundEx = { 
        status: false, 
        message: `The address with postal code '${postalCode}', addressStreet '${addressStreet}' and addressNumber ${addressNumber} was not founded` 
      };
      throw new NotFoundException(response);
    };

    const recourse: IRecourseFound = {
      status: true,
      message: 'The recourse was founded succesfully',
      recourse: address
    };

    return recourse;
  }
}
