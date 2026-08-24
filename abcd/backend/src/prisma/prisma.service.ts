import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e) {
      console.warn('Prisma could not connect to PostgreSQL server directly on startup (Standalone/Mock mode available).', e.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
