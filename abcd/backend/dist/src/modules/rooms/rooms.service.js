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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RoomsService = class RoomsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRoom(motelId, data) {
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
                status: client_1.RoomStatus.AVAILABLE,
            },
        });
    }
    async searchRooms(query) {
        const where = {};
        if (query.status) {
            where.status = query.status;
        }
        else {
            where.status = client_1.RoomStatus.AVAILABLE;
        }
        if (query.isSelfContained !== undefined) {
            where.isSelfContained = query.isSelfContained;
        }
        if (query.minPrice || query.maxPrice) {
            where.basePrice = {};
            if (query.minPrice)
                where.basePrice.gte = query.minPrice;
            if (query.maxPrice)
                where.basePrice.lte = query.maxPrice;
        }
        if (query.minArea || query.maxArea) {
            where.areaSqm = {};
            if (query.minArea)
                where.areaSqm.gte = query.minArea;
            if (query.maxArea)
                where.areaSqm.lte = query.maxArea;
        }
        if (query.city || query.district) {
            where.motel = {};
            if (query.city)
                where.motel.city = { contains: query.city, mode: 'insensitive' };
            if (query.district)
                where.motel.district = { contains: query.district, mode: 'insensitive' };
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
    async getRoomById(id) {
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
        if (!room)
            throw new common_1.NotFoundException('Không tìm thấy thông tin phòng');
        return room;
    }
    async updateRoom(id, data) {
        return await this.prisma.room.update({
            where: { id },
            data,
        });
    }
    async updateRoomStatus(id, status) {
        return await this.prisma.room.update({
            where: { id },
            data: { status },
        });
    }
    async deleteRoom(id) {
        return await this.prisma.room.delete({
            where: { id },
        });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map