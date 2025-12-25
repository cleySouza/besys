import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

// Mocks simples
jest.mock('@prisma/client');
jest.mock('@prisma/adapter-pg');
jest.mock('pg');

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const mockConfigService = {
      getOrThrow: jest
        .fn()
        .mockReturnValue('postgresql://test:test@localhost:5432/test'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be an instance of PrismaService', () => {
    expect(service).toBeInstanceOf(PrismaService);
  });
});
