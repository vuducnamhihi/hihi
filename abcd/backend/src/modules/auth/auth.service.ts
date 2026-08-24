import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Đăng nhập hoặc Đăng ký bằng Số điện thoại + OTP (Giả lập OTP 6 số hoặc demo '123456')
   */
  async loginWithPhoneOtp(phoneNumber: string, otp: string, role: Role = Role.TENANT, fullName?: string) {
    if (otp !== '123456' && otp !== '888888') {
      throw new UnauthorizedException('Mã OTP không đúng hoặc đã hết hạn (Mã demo: 123456)');
    }

    let user = await this.prisma.user.findUnique({
      where: { phoneNumber },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phoneNumber,
          fullName: fullName || (role === Role.LANDLORD ? 'Chủ Trọ Mới' : 'Khách Thuê Mới'),
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

  async getProfile(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getAllDemoUsers() {
    return await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}
