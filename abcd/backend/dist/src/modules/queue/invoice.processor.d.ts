import { WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
export declare class InvoiceProcessor extends WorkerHost implements OnModuleInit {
    private readonly prisma;
    private readonly invoiceQueue?;
    private readonly notificationQueue?;
    private readonly logger;
    constructor(prisma: PrismaService, invoiceQueue?: Queue, notificationQueue?: Queue);
    onModuleInit(): Promise<void>;
    process(job: Job<any, any, string>): Promise<any>;
    generateDraftInvoices(targetMonth?: number, targetYear?: number): Promise<{
        success: boolean;
        period: string;
        createdInvoicesCount: number;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        period?: undefined;
        createdInvoicesCount?: undefined;
    }>;
    private notifyTenant;
}
