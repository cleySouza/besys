import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private client: any;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      const { PrismaClient } = await import('@prisma/client');
      const { PrismaPg } = await import('@prisma/adapter-pg');
      const { Pool } = await import('pg');

      const pool = new Pool({
        connectionString: this.configService.get<string>('DATABASE_URL'),
      });

      const adapter = new PrismaPg(pool);

      // Usar any para contornar problemas de tipo do Prisma v7
      this.client = new (PrismaClient as any)({
        adapter: adapter as any,
        log: ['error', 'warn'],
        errorFormat: 'minimal',
      });
      
      await this.client.$connect();
    } catch (error) {
      console.error('Erro ao inicializar Prisma:', error);
      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client) {
      await this.client.$disconnect();
    }
  }

  get user() {
    return this.client?.user;
  }

  get company() {
    return this.client?.company;
  }

  get $transaction() {
    return this.client?.$transaction?.bind(this.client);
  }
}
