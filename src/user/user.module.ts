import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from 'src/roles/roles.module';
import { EmailModule } from 'src/email/email.module';
import { IdTypeModule } from 'src/id-type/id-type.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    RolesModule,
    EmailModule,
    IdTypeModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '5m' }, // TIEMPO DE VIDA DEL JWT
        global: true,
      }),
    }),
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
