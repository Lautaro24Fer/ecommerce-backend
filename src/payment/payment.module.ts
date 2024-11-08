import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, ConfigService],
  imports: [ConfigModule, JwtModule, AuthModule, UserModule]
})
export class PaymentModule {}
