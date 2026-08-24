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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async loginWithPhoneOtp(phoneNumber, otp, role = client_1.Role.TENANT, fullName) {
        if (otp !== '123456' && otp !== '888888') {
            throw new common_1.UnauthorizedException('Mã OTP không đúng hoặc đã hết hạn (Mã demo: 123456)');
        }
        let user = await this.prisma.user.findUnique({
            where: { phoneNumber },
        });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    phoneNumber,
                    fullName: fullName || (role === client_1.Role.LANDLORD ? 'Chủ Trọ Mới' : 'Khách Thuê Mới'),
                    role: role,
                },
            });
        }
        const payload = {
            id: user.id,
            phoneNumber: user.phoneNumber,
            fullName: user.fullName,
            role: user.role,
            avatarUrl: user.avatarUrl,
        };
        const token = this.jwtService.sign(payload);
        return {
            accessToken: token,
            user,
        };
    }
    async getProfile(userId) {
        return await this.prisma.user.findUnique({
            where: { id: userId },
        });
    }
    async getAllDemoUsers() {
        return await this.prisma.user.findMany({
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map