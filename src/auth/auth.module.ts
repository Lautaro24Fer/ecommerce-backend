import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_LOCAL_SECRET } from './constaints';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      secret: JWT_LOCAL_SECRET,
      global: true,
      signOptions: { expiresIn: '30m' },
    }),
  ],
})
export class AuthModule {}
