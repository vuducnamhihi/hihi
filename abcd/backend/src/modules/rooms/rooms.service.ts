import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RoomStatus } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo phòng mới cho nhà trọ
   */
  async createRoom(motelId: string, data: {
    roomNumber: string;
    floor: number;
    areaSqm: number;
    basePrice: number;
    isSelfContained?: boolean;
    description?: string;
    amenities?: string[];
    images?: string[];
  }) {
    return await this.prisma.room.create({
      data: {
        motelId,
        roomNumber: data.roomNumber,
        floor: data.floor || 1,
        areaSqm: data.areaSqm,
        basePrice: data.basePrice,
        isSelfContained: data.isSelfContained ?? true,
        description: data.description,
        amenities: data.amenities || [],
        images: data.images || [],
        status: RoomStatus.AVAILABLE,
      },
    });
  }

  /**
   * Tìm kiếm phòng trọ công khai cho Người thuê trọ với bộ lọc
   */
  async searchRooms(query: {
    city?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    isSelfContained?: boolean;
    status?: RoomStatus;
  }) {
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    } else {
      // Mặc định khách tìm phòng trống
      where.status = RoomStatus.AVAILABLE;
    }

    if (query.isSelfContained !== undefined) {
      where.isSelfContained = query.isSelfContained;
    }

    if (query.minPrice || query.maxPrice) {
      where.basePrice = {};
      if (query.minPrice) where.basePrice.gte = query.minPrice;
      if (query.maxPrice) where.basePrice.lte = query.maxPrice;
    }

    if (query.minArea || query.maxArea) {
      where.areaSqm = {};
      if (query.minArea) where.areaSqm.gte = query.minArea;
      if (query.maxArea) where.areaSqm.lte = query.maxArea;
    }

    if (query.city || query.district) {
      where.motel = {};
      if (query.city) where.motel.city = { contains: query.city, mode: 'insensitive' };
      if (query.district) where.motel.district = { contains: query.district, mode: 'insensitive' };
    }

    return await this.prisma.room.findMany({
      where,
      include: {
        motel: {
          include: {
            landlord: {
              select: { id: true, fullName: true, phoneNumber: true },
            },
          },
        },
      },
      orderBy: { basePrice: 'asc' },
    });
  }

  async getRoomById(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: {
        motel: {
          include: {
            landlord: {
              select: { id: true, fullName: true, phoneNumber: true },
            },
          },
        },
        contracts: {
          where: { status: 'ACTIVE' },
          include: { tenant: true },
        },
      },
    });
    if (!room) throw new NotFoundException('Không tìm thấy thông tin phòng');
    return room;
  }

  async updateRoom(id: string, data: any) {
    return await this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async updateRoomStatus(id: string, status: RoomStatus) {
    return await this.prisma.room.update({
      where: { id },
      data: { status },
    });
  }

  async deleteRoom(id: string) {
    return await this.prisma.room.delete({
      where: { id },
    });
  }
}
