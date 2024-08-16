import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { BrandModule } from 'src/brand/brand.module';
import { SupplierModule } from 'src/supplier/supplier.module';
import { TypeModule } from 'src/type/type.module';
import { ImagesModule } from 'src/images/images.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([Product]), 
  forwardRef(() => ImagesModule),
  BrandModule, 
  SupplierModule, 
  TypeModule],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule {}
