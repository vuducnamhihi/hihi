import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InvoiceProcessor } from './invoice.processor';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: parseInt(configService.get<string>('REDIS_PORT', '6379'), 10),
          lazyConnect: true,
          retryStrategy: (times) => Math.min(times * 1000, 30000),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'invoice-queue' },
      { name: 'notification-queue' },
    ),
  ],
  providers: [InvoiceProcessor, QueueService],
  exports: [QueueService, BullModule],
})
export class QueueModule {}
