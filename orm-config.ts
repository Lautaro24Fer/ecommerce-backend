import { DataSource } from 'typeorm';
import { User } from './src/user/entities/user.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { ProductType } from 'src/product/entities/type.entity';
import { ProductImage } from 'src/product/entities/image.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'nest',
  synchronize: false,
  logging: false,
  entities: [User, Brand, Order, Product, Supplier, ProductType, ProductImage], // Ajusta según tus entidades
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});
