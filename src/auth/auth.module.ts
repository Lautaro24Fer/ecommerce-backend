import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/auth-google.strategy';
import { jwt_secret } from './constaints';
import { SessionSerializer } from './serialezers/auth-google.serializer';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, SessionSerializer],
  exports: [AuthService],
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.register({
      secret: 'aavs8dyvwhbfejknwJKABS8bh8hbhb',
      global: true,
      signOptions: { expiresIn: '2m' }, // tiempo que dura el JWT
    }),
  ],
})
export class AuthModule {}
