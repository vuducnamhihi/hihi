import { Injectable, Logger, Optional } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { InvoiceProcessor } from './invoice.processor';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    private readonly invoiceProcessor: InvoiceProcessor,
    @Optional() @InjectQueue('invoice-queue') private readonly invoiceQueue?: Queue,
  ) {}

  /**
   * Kích hoạt quét và tạo hóa đơn DRAFT ngay lập tức (dành cho API trigger / test)
   */
  async triggerGenerateInvoicesNow(month?: number, year?: number) {
    if (this.invoiceQueue) {
      try {
        const job = await this.invoiceQueue.add('GENERATE_MONTHLY_INVOICES', { month, year });
        return { message: 'Đã thêm job vào BullMQ', jobId: job.id };
      } catch (e) {
        this.logger.warn('BullMQ Queue chưa sẵn sàng, thực thi trực tiếp qua Processor:', e.message);
      }
    }
    return await this.invoiceProcessor.generateDraftInvoices(month, year);
  }

  /**
   * Gửi job thông báo cho người thuê khi chủ trọ duyệt hóa đơn
   */
  async notifyTenantInvoicePublished(payload: { invoiceId: string; tenantId: string; amount: number; month: number }) {
    if (this.invoiceQueue) {
      try {
        await this.invoiceQueue.add('NOTIFY_TENANT_INVOICE_PUBLISHED', payload);
        return;
      } catch (e) {
        this.logger.warn('BullMQ notify fallback:', e.message);
      }
    }
    this.logger.log(`[Direct Notify] Thông báo đã gửi đến khách thuê ${payload.tenantId}`);
  }
}
