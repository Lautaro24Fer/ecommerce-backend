import { forwardRef, Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductImage } from './entities/image.entity';
import { ProductModule } from 'src/product/product.module';
import { FtpModule } from 'src/ftp/ftp.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import * as path from "path"

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [
    TypeOrmModule.forFeature([ProductImage]), 
    forwardRef(() => ProductModule), 
    MulterModule.register({
      dest: path.resolve('./temp'),
    }),
    FtpModule, 
    ConfigModule
  ],
  exports: [ImagesService, TypeOrmModule],

})
export class ImagesModule {}
