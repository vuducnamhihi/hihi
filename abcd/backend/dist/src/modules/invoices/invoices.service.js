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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const queue_service_1 = require("../queue/queue.service");
let InvoicesService = class InvoicesService {
    constructor(prisma, queueService) {
        this.prisma = prisma;
        this.queueService = queueService;
    }
    async getInvoicesForLandlord(landlordId, filter) {
        const where = {
            room: {
                motel: { landlordId },
            },
        };
        if (filter?.motelId)
            where.room.motelId = filter.motelId;
        if (filter?.periodMonth)
            where.periodMonth = filter.periodMonth;
        if (filter?.periodYear)
            where.periodYear = filter.periodYear;
        if (filter?.status)
            where.status = filter.status;
        return await this.prisma.invoice.findMany({
            where,
            include: {
                room: { include: { motel: true } },
                tenant: true,
                contract: true,
            },
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async getInvoicesForTenant(tenantId) {
        return await this.prisma.invoice.findMany({
            where: { tenantId },
            include: {
                room: {
                    include: {
                        motel: {
                            include: {
                                landlord: {
                                    select: { id: true, fullName: true, phoneNumber: true },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        });
    }
    async getInvoiceById(id) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: {
                room: { include: { motel: { include: { landlord: true } } } },
                tenant: true,
                contract: true,
            },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Không tìm thấy hóa đơn');
        return invoice;
    }
    async updateAndApproveInvoice(id, data) {
        const invoice = await this.prisma.invoice.findUnique({
            where: { id },
            include: { room: { include: { motel: true } } },
        });
        if (!invoice)
            throw new common_1.NotFoundException('Không tìm thấy hóa đơn');
        const motel = invoice.room.motel;
        const elecPrice = Number(motel.electricityUnitPrice || 3500);
        const waterPrice = Number(motel.waterUnitPrice || 25000);
        let elecUsage = data.electricityUsage ?? invoice.electricityUsage;
        if (data.newElectricity !== undefined && data.oldElectricity !== undefined) {
            elecUsage = Math.max(0, data.newElectricity - data.oldElectricity);
        }
        let waterUsage = data.waterUsage ?? invoice.waterUsage;
        if (data.newWater !== undefined && data.oldWater !== undefined) {
            waterUsage = Math.max(0, data.newWater - data.oldWater);
        }
        const roomAmt = data.roomAmount ?? Number(invoice.roomAmount);
        const elecAmount = elecUsage * elecPrice;
        const waterAmount = waterUsage * waterPrice;
        const otherFees = data.otherFees ?? Number(invoice.otherFees);
        const totalAmount = roomAmt + elecAmount + waterAmount + otherFees;
        const newStatus = data.approveImmediately ? client_1.InvoiceStatus.PENDING_PAYMENT : invoice.status;
        const updated = await this.prisma.invoice.update({
            where: { id },
            data: {
                roomAmount: roomAmt,
                electricityUsage: elecUsage,
                electricityAmount: elecAmount,
                waterUsage: waterUsage,
                waterAmount: waterAmount,
                otherFees: otherFees,
                totalAmount: totalAmount,
                status: newStatus,
            },
            include: { room: { include: { motel: true } }, tenant: true },
        });
        if (data.newElectricity !== undefined || data.newWater !== undefined) {
            await this.prisma.meterReading.upsert({
                where: {
                    roomId_periodMonth_periodYear: {
                        roomId: invoice.roomId,
                        periodMonth: invoice.periodMonth,
                        periodYear: invoice.periodYear,
                    },
                },
                create: {
                    roomId: invoice.roomId,
                    contractId: invoice.contractId,
                    periodMonth: invoice.periodMonth,
                    periodYear: invoice.periodYear,
                    oldElectricity: data.oldElectricity || 0,
                    newElectricity: data.newElectricity || elecUsage,
                    oldWater: data.oldWater || 0,
                    newWater: data.newWater || waterUsage,
                },
                update: {
                    oldElectricity: data.oldElectricity,
                    newElectricity: data.newElectricity,
                    oldWater: data.oldWater,
                    newWater: data.newWater,
                },
            });
        }
        if (data.approveImmediately) {
            await this.queueService.notifyTenantInvoicePublished({
                invoiceId: updated.id,
                tenantId: updated.tenantId,
                amount: Number(updated.totalAmount),
                month: updated.periodMonth,
            });
        }
        return updated;
    }
    async submitPaymentProof(id, paymentProofUrl, tenantNote) {
        const invoice = await this.prisma.invoice.findUnique({ where: { id } });
        if (!invoice)
            throw new common_1.NotFoundException('Không tìm thấy hóa đơn');
        return await this.prisma.invoice.update({
            where: { id },
            data: {
                paymentProofUrl,
                tenantNote: tenantNote || invoice.tenantNote,
                status: client_1.InvoiceStatus.PAYMENT_SUBMITTED,
            },
        });
    }
    async confirmPaymentSuccess(id) {
        const invoice = await this.prisma.invoice.findUnique({ where: { id } });
        if (!invoice)
            throw new common_1.NotFoundException('Không tìm thấy hóa đơn');
        return await this.prisma.invoice.update({
            where: { id },
            data: {
                status: client_1.InvoiceStatus.PAID,
                paidAt: new Date(),
            },
        });
    }
    async triggerGenerateMonthly(month, year) {
        return await this.queueService.triggerGenerateInvoicesNow(month, year);
    }
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        queue_service_1.QueueService])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map