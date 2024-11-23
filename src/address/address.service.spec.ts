import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AddressService', () => {
  let service: AddressService;
  let repository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    repository = module.get<Repository<Address>>(getRepositoryToken(Address));
  });

  it('test_remove_orphaned_addresses_success', async () => {
    const orphanedAddresses = [{ id: 1 }, { id: 2 }];
    jest.spyOn(repository, 'createQueryBuilder').mockReturnValue({
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(orphanedAddresses),
    } as any);
    jest.spyOn(repository, 'remove').mockResolvedValue(orphanedAddresses as any);

    await service.removeOrphanedAddresses();

    expect(repository.remove).toHaveBeenCalledWith(orphanedAddresses);
  });

  it('test_find_or_create_existing_address', async () => {
    const createAddressDto: Address = {
      postalCode: '12345',
      addressStreet: 'Main St',
      addressNumber: '10',
      id: 1,
      user: []
    };
    jest.spyOn(service, 'findOneByAllData').mockResolvedValue({
      status: true,
      message: 'Found',
      recourse: createAddressDto,
    });

    const result = await service.findOrCreate(createAddressDto);

    expect(result.recourse).toEqual(createAddressDto);
  });

  it('test_create_address_error_handling', async () => {
    const createAddressDto: CreateAddressDto = {
      postalCode: '12345',
      addressStreet: 'Main St',
      addressNumber: '10',
    };
    jest.spyOn(repository, 'create').mockImplementation(() => {
      throw new Error('Creation error');
    });

    await expect(service.create(createAddressDto)).rejects.toThrow(BadRequestException);
  });
});