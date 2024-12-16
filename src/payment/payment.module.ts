import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';
import { EmailModule } from 'src/email/email.module';
import { OrderModule } from 'src/order/order.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, ConfigService],
  imports: [ConfigModule, JwtModule, AuthModule, UserModule, ProductModule, EmailModule, OrderModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1m' }, //TODO: TIEMPO DE VIDA DEL JWT POR DEFECTO
        global: true,
      }),
    }),
  ]
})
export class PaymentModule {}
