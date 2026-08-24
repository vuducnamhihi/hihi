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
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("bullmq");
const bullmq_2 = require("@nestjs/bullmq");
const invoice_processor_1 = require("./invoice.processor");
let QueueService = QueueService_1 = class QueueService {
    constructor(invoiceProcessor, invoiceQueue) {
        this.invoiceProcessor = invoiceProcessor;
        this.invoiceQueue = invoiceQueue;
        this.logger = new common_1.Logger(QueueService_1.name);
    }
    async triggerGenerateInvoicesNow(month, year) {
        if (this.invoiceQueue) {
            try {
                const job = await this.invoiceQueue.add('GENERATE_MONTHLY_INVOICES', { month, year });
                return { message: 'Đã thêm job vào BullMQ', jobId: job.id };
            }
            catch (e) {
                this.logger.warn('BullMQ Queue chưa sẵn sàng, thực thi trực tiếp qua Processor:', e.message);
            }
        }
        return await this.invoiceProcessor.generateDraftInvoices(month, year);
    }
    async notifyTenantInvoicePublished(payload) {
        if (this.invoiceQueue) {
            try {
                await this.invoiceQueue.add('NOTIFY_TENANT_INVOICE_PUBLISHED', payload);
                return;
            }
            catch (e) {
                this.logger.warn('BullMQ notify fallback:', e.message);
            }
        }
        this.logger.log(`[Direct Notify] Thông báo đã gửi đến khách thuê ${payload.tenantId}`);
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, bullmq_2.InjectQueue)('invoice-queue')),
    __metadata("design:paramtypes", [invoice_processor_1.InvoiceProcessor,
        bullmq_1.Queue])
], QueueService);
//# sourceMappingURL=queue.service.js.map