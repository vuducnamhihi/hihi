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
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ContractsService = class ContractsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createContract(data) {
        let tenantId = data.tenantId;
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
            throw new common_1.BadRequestException('Cần cung cấp thông tin người thuê');
        }
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
                status: client_1.ContractStatus.ACTIVE,
            },
        });
        await this.prisma.room.update({
            where: { id: data.roomId },
            data: { status: client_1.RoomStatus.OCCUPIED },
        });
        return contract;
    }
    async getContractsByLandlord(landlordId) {
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
    async getContractsByTenant(tenantId) {
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
    async terminateContract(id) {
        const contract = await this.prisma.contract.findUnique({
            where: { id },
        });
        if (!contract)
            throw new common_1.NotFoundException('Không tìm thấy hợp đồng');
        const updated = await this.prisma.contract.update({
            where: { id },
            data: { status: client_1.ContractStatus.TERMINATED },
        });
        await this.prisma.room.update({
            where: { id: contract.roomId },
            data: { status: client_1.RoomStatus.AVAILABLE },
        });
        return {
            success: true,
            message: 'Đã thanh lý hợp đồng và chuyển phòng về trạng thái TRỐNG.',
            contract: updated,
        };
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map