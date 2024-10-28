import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';

@Module({
  controllers: [AddressController],
  providers: [AddressService],
  imports: [TypeOrmModule.forFeature([Address])],
  exports: [TypeOrmModule, AddressService]
})
export class AddressModule {}
