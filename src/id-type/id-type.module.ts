import { Module } from '@nestjs/common';
import { IdTypeService } from './id-type.service';
import { IdTypeController } from './id-type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdType } from './entities/id-type.entity';

@Module({
  controllers: [IdTypeController],
  providers: [IdTypeService],
  imports: [TypeOrmModule.forFeature([IdType])],
  exports: [IdTypeService, TypeOrmModule]
})
export class IdTypeModule {}
