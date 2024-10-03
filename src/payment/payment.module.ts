import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, ConfigService],
  imports: [TypeOrmModule.forFeature([Payment]), ConfigModule, JwtModule, AuthModule]
})
export class PaymentModule {}
