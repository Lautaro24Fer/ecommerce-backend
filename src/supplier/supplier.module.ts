import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';

@Module({
  controllers: [SupplierController],
  providers: [SupplierService],
  imports: [TypeOrmModule.forFeature([Supplier])],
  exports: [TypeOrmModule],
})
export class SupplierModule {}
