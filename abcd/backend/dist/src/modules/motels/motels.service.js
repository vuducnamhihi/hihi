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
exports.MotelsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let MotelsService = class MotelsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMotel(landlordId, data) {
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
    async getMotelsByLandlord(landlordId) {
        return await this.prisma.motel.findMany({
            where: { landlordId },
            include: {
                rooms: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMotelById(id) {
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
        if (!motel)
            throw new common_1.NotFoundException('Không tìm thấy thông tin nhà trọ');
        return motel;
    }
    async updateMotel(id, landlordId, data) {
        return await this.prisma.motel.update({
            where: { id },
            data,
        });
    }
    async deleteMotel(id) {
        return await this.prisma.motel.delete({
            where: { id },
        });
    }
};
exports.MotelsService = MotelsService;
exports.MotelsService = MotelsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MotelsService);
//# sourceMappingURL=motels.service.js.map