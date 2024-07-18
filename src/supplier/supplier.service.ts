import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    try {
      const supplierCreated: Supplier =
        await this.supplierRepository.save(createSupplierDto);
      return supplierCreated;
    } catch {
      throw new BadRequestException(
        'Error exception creating the new supplier',
      );
    }
  }

  async findAll(): Promise<Supplier[]> {
    const suppliers: Supplier[] = await this.supplierRepository.find();
    if (!suppliers || suppliers.length < 1) {
      throw new NotFoundException('suppliers not founded');
    }
    return suppliers;
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier: Supplier = await this.supplierRepository.findOne({
      where: { id: id },
    });
    if (!supplier) {
      throw new NotFoundException(
        `The supplier with the id '${id}' was not founded`,
      );
    }
    return supplier;
  }

  async update(
    id: number,
    updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    const supplier: Supplier = await this.supplierRepository.findOne({
      where: { id: id },
    });
    if (!supplier) {
      throw new NotFoundException(
        `The supplier with the id '${id}' was not founded`,
      );
    }
    try {
      Object.assign(supplier, updateSupplierDto);
      const supplierUpdated: Supplier =
        await this.supplierRepository.save(supplier);
      return supplierUpdated;
    } catch {
      throw new BadRequestException('Error updating the brand');
    }
  }

  async remove(id: number): Promise<void> {
    const supplier: Supplier = await this.supplierRepository.findOne({
      where: { id: id },
    });
    if (!supplier) {
      throw new NotFoundException(
        `The supplier with the id '${id}' was not founded`,
      );
    }
    try {
      await this.supplierRepository.remove(supplier);
    } catch {
      throw new BadRequestException('Error deliting the supplier');
    }
  }
}
