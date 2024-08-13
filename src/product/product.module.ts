import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BrandModule } from 'src/brand/brand.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { ProductType } from './entities/type.entity';
import { ProductImage } from './entities/image.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, ProductType, ProductImage]), BrandModule, SupplierModule],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
