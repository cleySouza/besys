import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

// Mock mais específico
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
  
  return {
    PrismaClient: jest.fn().mockImplementation(function() {
      Object.assign(this, mockPrismaClient);
      return this;
    }),
  };
});

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({})),
}));

describe('PrismaService', () => {
  let service: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('postgresql://test:test@localhost:5432/test'),
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
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getOrThrow with DATABASE_URL during construction', () => {
    expect(configService.getOrThrow).toHaveBeenCalledWith('DATABASE_URL');
  });

  it('should have onModuleInit method', () => {
    expect(typeof service.onModuleInit).toBe('function');
  });

  it('should have onModuleDestroy method', () => {
    expect(typeof service.onModuleDestroy).toBe('function');
  });

  it('should have $connect method from PrismaClient', () => {
    expect(typeof service.$connect).toBe('function');
  });

  it('should have $disconnect method from PrismaClient', () => {
    expect(typeof service.$disconnect).toBe('function');
  });
});