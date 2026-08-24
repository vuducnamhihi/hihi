import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ContractStatus, RoomStatus } from '@prisma/client';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo hợp đồng thuê mới và tự động cập nhật trạng thái phòng -> OCCUPIED
   */
  async createContract(data: {
    roomId: string;
    tenantId?: string;
    tenantPhone?: string;
    tenantName?: string;
    startDate: Date;
    endDate: Date;
    rentalPrice: number;
    depositAmount: number;
    paymentDay?: number;
    contractFileUrl?: string;
  }) {
    let tenantId = data.tenantId;

    // Nếu tạo hợp đồng bằng số điện thoại khách thuê
    if (!tenantId && data.tenantPhone) {
      let tenant = await this.prisma.user.findUnique({
        where: { phoneNumber: data.tenantPhone },
      });
      if (!tenant) {
        tenant = await this.prisma.user.create({
          data: {
            phoneNumber: data.tenantPhone,
            fullName: data.tenantName || 'Khách thuê mới',
            role: 'TENANT',
          },
        });
      }
      tenantId = tenant.id;
    }

    if (!tenantId) {
      throw new BadRequestException('Cần cung cấp thông tin người thuê');
    }

    // Tạo hợp đồng
    const contract = await this.prisma.contract.create({
      data: {
        roomId: data.roomId,
        tenantId: tenantId,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        rentalPrice: data.rentalPrice,
        depositAmount: data.depositAmount,
        paymentDay: data.paymentDay || 5,
        contractFileUrl: data.contractFileUrl,
        status: ContractStatus.ACTIVE,
      },
    });

    // Cập nhật trạng thái phòng thành OCCUPIED
    await this.prisma.room.update({
      where: { id: data.roomId },
      data: { status: RoomStatus.OCCUPIED },
    });

    return contract;
  }

  /**
   * Lấy danh sách hợp đồng do Chủ trọ quản lý
   */
  async getContractsByLandlord(landlordId: string) {
    return await this.prisma.contract.findMany({
      where: {
        room: {
          motel: { landlordId },
        },
      },
      include: {
        room: { include: { motel: true } },
        tenant: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lấy danh sách hợp đồng của Khách thuê
   */
  async getContractsByTenant(tenantId: string) {
    return await this.prisma.contract.findMany({
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
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Thanh lý / Kết thúc hợp đồng: Chuyển hợp đồng -> TERMINATED, trả phòng -> AVAILABLE
   */
  async terminateContract(id: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
    });
    if (!contract) throw new NotFoundException('Không tìm thấy hợp đồng');

    const updated = await this.prisma.contract.update({
      where: { id },
      data: { status: ContractStatus.TERMINATED },
    });

    await this.prisma.room.update({
      where: { id: contract.roomId },
      data: { status: RoomStatus.AVAILABLE },
    });

    return {
      success: true,
      message: 'Đã thanh lý hợp đồng và chuyển phòng về trạng thái TRỐNG.',
      contract: updated,
    };
  }
}
