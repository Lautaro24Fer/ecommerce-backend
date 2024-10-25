import { Test, TestingModule } from '@nestjs/testing';
import { IdTypeService } from './id-type.service';

describe('IdTypeService', () => {
  let service: IdTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdTypeService],
    }).compile();

    service = module.get<IdTypeService>(IdTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
