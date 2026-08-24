import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InvoiceStatus } from '@prisma/client';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly queueService: QueueService,
  ) {}

  /**
   * Lấy danh sách hóa đơn dành cho Chủ trọ quản lý
   */
  async getInvoicesForLandlord(landlordId: string, filter?: {
    motelId?: string;
    periodMonth?: number;
    periodYear?: number;
    status?: InvoiceStatus;
  }) {
    const where: any = {
      room: {
        motel: { landlordId },
      },
    };

    if (filter?.motelId) where.room.motelId = filter.motelId;
    if (filter?.periodMonth) where.periodMonth = filter.periodMonth;
    if (filter?.periodYear) where.periodYear = filter.periodYear;
    if (filter?.status) where.status = filter.status;

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

  /**
   * Lấy danh sách hóa đơn của Khách thuê
   */
  async getInvoicesForTenant(tenantId: string) {
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

  async getInvoiceById(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        room: { include: { motel: { include: { landlord: true } } } },
        tenant: true,
        contract: true,
      },
    });
    if (!invoice) throw new NotFoundException('Không tìm thấy hóa đơn');
    return invoice;
  }

  /**
   * Chủ trọ cập nhật chỉ số điện/nước và DUYỆT hóa đơn -> PENDING_PAYMENT
   */
  async updateAndApproveInvoice(
    id: string,
    data: {
      electricityUsage?: number;
      waterUsage?: number;
      otherFees?: number;
      roomAmount?: number;
      oldElectricity?: number;
      newElectricity?: number;
      oldWater?: number;
      newWater?: number;
      approveImmediately?: boolean;
    },
  ) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: { room: { include: { motel: true } } },
    });
    if (!invoice) throw new NotFoundException('Không tìm thấy hóa đơn');

    const motel = invoice.room.motel;
    const elecPrice = Number(motel.electricityUnitPrice || 3500);
    const waterPrice = Number(motel.waterUnitPrice || 25000);

    // Tính lượng điện nước
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

    const newStatus = data.approveImmediately ? InvoiceStatus.PENDING_PAYMENT : invoice.status;

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

    // Lưu chỉ số công tơ vào bảng meter_readings nếu có
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

    // Nếu duyệt, gửi thông báo cho khách thuê
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

  /**
   * Người thuê nộp minh chứng chuyển khoản (Ảnh MinIO) -> PAYMENT_SUBMITTED
   */
  async submitPaymentProof(id: string, paymentProofUrl: string, tenantNote?: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Không tìm thấy hóa đơn');

    return await this.prisma.invoice.update({
      where: { id },
      data: {
        paymentProofUrl,
        tenantNote: tenantNote || invoice.tenantNote,
        status: InvoiceStatus.PAYMENT_SUBMITTED,
      },
    });
  }

  /**
   * Chủ trọ xác nhận đã nhận tiền -> PAID
   */
  async confirmPaymentSuccess(id: string) {
    const invoice = await this.prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new NotFoundException('Không tìm thấy hóa đơn');

    return await this.prisma.invoice.update({
      where: { id },
      data: {
        status: InvoiceStatus.PAID,
        paidAt: new Date(),
      },
    });
  }

  /**
   * Kích hoạt tạo hóa đơn tức thì cho tháng được chọn
   */
  async triggerGenerateMonthly(month?: number, year?: number) {
    return await this.queueService.triggerGenerateInvoicesNow(month, year);
  }
}
