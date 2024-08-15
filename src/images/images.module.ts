import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/image.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [TypeOrmModule.forFeature([ProductImage]), ProductModule],
  exports: [ImagesService, TypeOrmModule],

})
export class ImagesModule {}
