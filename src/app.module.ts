import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { BrandModule } from './brand/brand.module';
import { OrderModule } from './order/order.module';
import { Brand } from './brand/entities/brand.entity';
import { Product } from './product/entities/product.entity';
import { User } from './user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductImage } from './images/entities/image.entity';
import { ProductType } from './type/entities/type.entity';
import { TypeModule } from './type/type.module';
import { ImagesModule } from './images/images.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/entities/role.entity';
import { DataSource } from 'typeorm';
import { PaymentModule } from './payment/payment.module';
import { AddressModule } from './address/address.module';
import { Address } from './address/entities/address.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CookieMiddleware } from './auth/cookie.middleware';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConfigModule,
    ConfigModule.forRoot({ envFilePath: ['./.env'], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        // port: +configService.get<string>('TYPEORM_DATABASE_PORT'),
        // username: configService.get<string>('TYPEORM_DATABASE_USERNAME'),
        // password: configService.get<string>('TYPEORM_DATABASE_PASSWORD'),
        database: 'C:\\Users\\lauta\\Desktop\\DATABASES\\ONE.sql',
        entities: [Brand, Product, User, ProductImage, ProductType, Role, Address],
        synchronize: false,
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    ProductModule,
    BrandModule,
    OrderModule,
    TypeModule,
    ImagesModule,
    RolesModule,
    PaymentModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(CookieMiddleware)
//       .forRoutes('*'); // Apply to all routes
//   }
// }

export class AppModule {}

