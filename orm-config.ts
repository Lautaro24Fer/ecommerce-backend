import { DataSource } from 'typeorm';
import { User } from './src/user/entities/user.entity';
import { Brand } from './src/brand/entities/brand.entity';
import { Order, ProductOrder } from './src/order/entities/order.entity';
import { Product } from './src/product/entities/product.entity';
import { ProductType } from './src/type/entities/type.entity';
import { ProductImage } from './src/images/entities/image.entity';
import { Role } from './src/roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { Address } from './src/address/entities/address.entity';
dotenv.config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'sqlite',
  // port: configService.get<number>('TYPEORM_DATABASE_PORT'),
  // username: configService.get<string>('TYPEORM_DATABASE_USERNAME'),
  // password: configService.get<string>('TYPEORM_DATABASE_PASSWORD'),
  database: 'C:\\Users\\lauta\\Desktop\\DATABASES\\ONE.sql',
  synchronize: false,
  logging: false,
  entities: [User, Brand, Order, Product, ProductType, ProductImage, Role, Address, ProductOrder], // Ajusta según tus entidades
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

  