import { Queue } from 'bullmq';
import { InvoiceProcessor } from './invoice.processor';
export declare class QueueService {
    private readonly invoiceProcessor;
    private readonly invoiceQueue?;
    private readonly logger;
    constructor(invoiceProcessor: InvoiceProcessor, invoiceQueue?: Queue);
    triggerGenerateInvoicesNow(month?: number, year?: number): Promise<{
        success: boolean;
        period: string;
        createdInvoicesCount: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        period?: undefined;
        createdInvoicesCount?: undefined;
    } | {
        message: string;
        jobId: string;
    }>;
    notifyTenantInvoicePublished(payload: {
        invoiceId: string;
        tenantId: string;
        amount: number;
        month: number;
    }): Promise<void>;
}
