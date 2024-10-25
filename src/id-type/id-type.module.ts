import { Module } from '@nestjs/common';
import { IdTypeService } from './id-type.service';
import { IdTypeController } from './id-type.controller';

@Module({
  controllers: [IdTypeController],
  providers: [IdTypeService],
})
export class IdTypeModule {}
