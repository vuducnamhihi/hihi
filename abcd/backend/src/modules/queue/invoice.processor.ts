import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { ContractStatus, InvoiceStatus } from '@prisma/client';

@Processor('invoice-queue')
@Injectable()
export class InvoiceProcessor extends WorkerHost implements OnModuleInit {
  private readonly logger = new Logger(InvoiceProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @Optional() @InjectQueue('invoice-queue') private readonly invoiceQueue?: Queue,
    @Optional() @InjectQueue('notification-queue') private readonly notificationQueue?: Queue,
  ) {
    super();
  }

  async onModuleInit() {
    if (this.invoiceQueue) {
      try {
        await this.invoiceQueue.add(
          'GENERATE_MONTHLY_INVOICES',
          {},
          {
            repeat: { pattern: '0 0 1 * *' },
            jobId: 'monthly-invoice-cron',
            removeOnComplete: true,
          },
        );
        this.logger.log('Đã đăng ký BullMQ Cron Job: Tự động khởi tạo hóa đơn vào 00:00 ngày 1 hằng tháng.');
      } catch (e) {
        this.logger.warn('Chưa thể kết nối Redis để đăng ký Cron Job BullMQ:', e.message);
      }
    }
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Thực thi Job BullMQ: ${job.name} (ID: ${job.id})`);

    switch (job.name) {
      case 'GENERATE_MONTHLY_INVOICES':
        return await this.generateDraftInvoices();
      case 'NOTIFY_TENANT_INVOICE_PUBLISHED':
        return await this.notifyTenant(job.data);
      default:
        this.logger.warn(`Không nhận diện được Job: ${job.name}`);
    }
  }

  /**
   * Tạo Hóa đơn DRAFT cho tất cả hợp đồng ACTIVE
   */
  async generateDraftInvoices(targetMonth?: number, targetYear?: number) {
    const now = new Date();
    const currentMonth = targetMonth || now.getMonth() + 1;
    const currentYear = targetYear || now.getFullYear();

    try {
      const activeContracts = await this.prisma.contract.findMany({
        where: { status: ContractStatus.ACTIVE },
        include: {
          room: { include: { motel: true } },
          tenant: true,
        },
      });

      this.logger.log(`Tìm thấy ${activeContracts.length} hợp đồng ACTIVE để sinh hóa đơn.`);

      let createdCount = 0;
      const landlordIdsToNotify = new Set<string>();

      for (const contract of activeContracts) {
        const existing = await this.prisma.invoice.findUnique({
          where: {
            contractId_periodMonth_periodYear: {
              contractId: contract.id,
              periodMonth: currentMonth,
              periodYear: currentYear,
            },
          },
        });

        if (!existing) {
          const dueDate = new Date(currentYear, currentMonth - 1, contract.paymentDay || 5);

          await this.prisma.invoice.create({
            data: {
              contractId: contract.id,
              roomId: contract.roomId,
              tenantId: contract.tenantId,
              periodMonth: currentMonth,
              periodYear: currentYear,
              roomAmount: contract.rentalPrice,
              electricityUsage: 0,
              electricityAmount: 0,
              waterUsage: 0,
              waterAmount: 0,
              otherFees: 0,
              totalAmount: contract.rentalPrice,
              status: InvoiceStatus.DRAFT,
              dueDate: dueDate,
            },
          });

          createdCount++;
          landlordIdsToNotify.add(contract.room.motel.landlordId);
        }
      }

      // Gửi thông báo cho Chủ trọ
      for (const landlordId of landlordIdsToNotify) {
        if (this.notificationQueue) {
          await this.notificationQueue.add('PUSH_NOTIFICATION', {
            targetUserId: landlordId,
            title: `Hóa đơn T${currentMonth}/${currentYear} đã được tạo nháp`,
            body: 'Vui lòng kiểm tra, nhập số điện/nước và duyệt hóa đơn cho các phòng.',
          });
        }
      }

      return {
        success: true,
        period: `${currentMonth}/${currentYear}`,
        createdInvoicesCount: createdCount,
      };
    } catch (e) {
      this.logger.error('Lỗi khi sinh hóa đơn tự động:', e);
      return { success: false, error: e.message };
    }
  }

  private async notifyTenant(data: { invoiceId: string; tenantId: string; amount: number; month: number }) {
    this.logger.log(`Push Notification gửi đến Khách thuê ${data.tenantId}: Hóa đơn T${data.month} số tiền ${data.amount} VND đã được duyệt.`);
    return { notified: true };
  }
}
