import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { BrandModule } from './brand/brand.module';
import { SupplierModule } from './supplier/supplier.module';
import { OrderModule } from './order/order.module';
import { Brand } from './brand/entities/brand.entity';
import { Order } from './order/entities/order.entity';
import { Product } from './product/entities/product.entity';
import { Supplier } from './supplier/entities/supplier.entity';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'nest',
      entities: [Brand, Order, Product, Supplier, User],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    ProductModule,
    BrandModule,
    SupplierModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
