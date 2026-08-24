import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MotelsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMotel(landlordId: string, data: {
    name: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    electricityUnitPrice?: number;
    waterUnitPrice?: number;
  }) {
    return await this.prisma.motel.create({
      data: {
        landlordId,
        name: data.name,
        address: data.address,
        ward: data.ward,
        district: data.district,
        city: data.city,
        electricityUnitPrice: data.electricityUnitPrice || 3500,
        waterUnitPrice: data.waterUnitPrice || 25000,
      },
    });
  }

  async getMotelsByLandlord(landlordId: string) {
    return await this.prisma.motel.findMany({
      where: { landlordId },
      include: {
        rooms: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMotelById(id: string) {
    const motel = await this.prisma.motel.findUnique({
      where: { id },
      include: {
        rooms: {
          include: {
            contracts: {
              where: { status: 'ACTIVE' },
              include: { tenant: true },
            },
          },
        },
      },
    });
    if (!motel) throw new NotFoundException('Không tìm thấy thông tin nhà trọ');
    return motel;
  }

  async updateMotel(id: string, landlordId: string, data: any) {
    return await this.prisma.motel.update({
      where: { id },
      data,
    });
  }

  async deleteMotel(id: string) {
    return await this.prisma.motel.delete({
      where: { id },
    });
  }
}
