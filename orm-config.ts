import { DataSource } from 'typeorm';
import { User } from './src/user/entities/user.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Order, ProductOrder } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { Supplier } from '../supplier/entities/supplier.entity';
import { ProductType } from '../type/entities/type.entity';
import { ProductImage } from '../images/entities/image.entity';
import { Role } from '../roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { IdType } from '../id-type/entities/id-type.entity';
import { Address } from '../address/entities/address.entity';
dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('TYPEORM_DATABASE_HOST'),
  port: configService.get<number>('TYPEORM_DATABASE_PORT'),
  username: configService.get<string>('TYPEORM_DATABASE_USERNAME'),
  password: configService.get<string>('TYPEORM_DATABASE_PASSWORD'),
  database: configService.get<string>('TYPEORM_DATABASE_NAME'),
  synchronize: false,
  logging: false,
  entities: [User, Brand, Order, Product, Supplier, ProductType, ProductImage, Role, IdType, Address, ProductOrder], // Ajusta según tus entidades
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

  