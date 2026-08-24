"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InvoiceProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bullmq_3 = require("@nestjs/bullmq");
const client_1 = require("@prisma/client");
let InvoiceProcessor = InvoiceProcessor_1 = class InvoiceProcessor extends bullmq_1.WorkerHost {
    constructor(prisma, invoiceQueue, notificationQueue) {
        super();
        this.prisma = prisma;
        this.invoiceQueue = invoiceQueue;
        this.notificationQueue = notificationQueue;
        this.logger = new common_1.Logger(InvoiceProcessor_1.name);
    }
    async onModuleInit() {
        if (this.invoiceQueue) {
            try {
                await this.invoiceQueue.add('GENERATE_MONTHLY_INVOICES', {}, {
                    repeat: { pattern: '0 0 1 * *' },
                    jobId: 'monthly-invoice-cron',
                    removeOnComplete: true,
                });
                this.logger.log('Đã đăng ký BullMQ Cron Job: Tự động khởi tạo hóa đơn vào 00:00 ngày 1 hằng tháng.');
            }
            catch (e) {
                this.logger.warn('Chưa thể kết nối Redis để đăng ký Cron Job BullMQ:', e.message);
            }
        }
    }
    async process(job) {
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
    async generateDraftInvoices(targetMonth, targetYear) {
        const now = new Date();
        const currentMonth = targetMonth || now.getMonth() + 1;
        const currentYear = targetYear || now.getFullYear();
        try {
            const activeContracts = await this.prisma.contract.findMany({
                where: { status: client_1.ContractStatus.ACTIVE },
                include: {
                    room: { include: { motel: true } },
                    tenant: true,
                },
            });
            this.logger.log(`Tìm thấy ${activeContracts.length} hợp đồng ACTIVE để sinh hóa đơn.`);
            let createdCount = 0;
            const landlordIdsToNotify = new Set();
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
                            status: client_1.InvoiceStatus.DRAFT,
                            dueDate: dueDate,
                        },
                    });
                    createdCount++;
                    landlordIdsToNotify.add(contract.room.motel.landlordId);
                }
            }
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
        }
        catch (e) {
            this.logger.error('Lỗi khi sinh hóa đơn tự động:', e);
            return { success: false, error: e.message };
        }
    }
    async notifyTenant(data) {
        this.logger.log(`Push Notification gửi đến Khách thuê ${data.tenantId}: Hóa đơn T${data.month} số tiền ${data.amount} VND đã được duyệt.`);
        return { notified: true };
    }
};
exports.InvoiceProcessor = InvoiceProcessor;
exports.InvoiceProcessor = InvoiceProcessor = InvoiceProcessor_1 = __decorate([
    (0, bullmq_1.Processor)('invoice-queue'),
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, bullmq_3.InjectQueue)('invoice-queue')),
    __param(2, (0, common_1.Optional)()),
    __param(2, (0, bullmq_3.InjectQueue)('notification-queue')),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue,
        bullmq_2.Queue])
], InvoiceProcessor);
//# sourceMappingURL=invoice.processor.js.map