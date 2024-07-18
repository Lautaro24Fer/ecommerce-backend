import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BrandModule } from 'src/brand/brand.module';
import { SupplierModule } from 'src/supplier/supplier.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]), BrandModule, SupplierModule],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
