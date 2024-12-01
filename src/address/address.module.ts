import { forwardRef, Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [
    TypeOrmModule.forFeature([Address]), 
    forwardRef(() => UserModule)
  ],
  exports: [TypeOrmModule, AddressService]
})
export class AddressModule {}
