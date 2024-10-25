import { Test, TestingModule } from '@nestjs/testing';
import { IdTypeController } from './id-type.controller';
import { IdTypeService } from './id-type.service';

describe('IdTypeController', () => {
  let controller: IdTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdTypeController],
      providers: [IdTypeService],
    }).compile();

    controller = module.get<IdTypeController>(IdTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
