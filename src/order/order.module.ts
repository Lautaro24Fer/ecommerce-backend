import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, ProductOrder } from './entities/order.entity';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Order, ProductOrder]), ProductModule, UserModule, ConfigModule],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
